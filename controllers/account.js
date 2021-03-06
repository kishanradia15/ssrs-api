const JWT = require(`jsonwebtoken`);
const HttpStatus = require('http-status-codes');
const randomstring = require('randomstring');
const bcrypt = require('bcryptjs');
const mustache = require('mustache');

const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const tempUser = require('../models/tempUser');
const Cart = require('../models/cart');

const {
    maximumSignUpRequestBeforeBlocking,
    userBlockageTimeForTooManySignUpRequests,
    httpProtocol,
    JWT_SECRET,
    JWT_EXPIRY_TIME,
    JWT_ISSUER,
    RESET_PASSWORD_EXPIRY_TIME,
    daiictMailDomainName,
    userTypes,
    adminTypes,
    resources,
    cookiesName,
    homePage
} = require('../configuration');

const errorMessages = require('../configuration/errors');
const { accessControl } = require('./access');
const { filterResourceData } = require('../helpers/controllerHelpers');

const { smtpTransport } = require('../configuration/mail'),
    mailTemplates = require('../configuration/mailTemplates.json'),
    mailAccountUserName = process.env.MAIL_USER,
    mailAccountPassword = process.env.MAIL_PASS;

const hashPassword = async (password) => {
    //generate a salt
    const salt = await bcrypt.genSalt();
    //generate password hash
    return await bcrypt.hash(password, salt);
};

//sign a new token
const signToken = user => {
    return JWT.sign({
        iss: JWT_ISSUER,
        sub: user.daiictId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + JWT_EXPIRY_TIME),
    }, JWT_SECRET);
};

module.exports = {
    signUp: async (req, res, next) => {

        const { daiictId, password } = req.value.body;

        const createdOn = new Date();
        //check if user exist
        const foundUser = await User.findOne({ daiictId });
        const userInDB = await UserInfo.findOne({ user_inst_id: daiictId });

        //user already exist
        if (foundUser) {
            return res.status(HttpStatus.FORBIDDEN)
                .send(errorMessages.userAlreadyExist);
        }

        if (!userInDB) {
            return res.status(HttpStatus.FORBIDDEN)
                .send(errorMessages.invalidDaiictUser);
        }

        const primaryEmail = userInDB.user_email_id + '@' + daiictMailDomainName;

        const randomHash = randomstring.generate();
        const host = req.get('host');
        const link = httpProtocol + '://' + host + '/account/verify/' + daiictId + '?id=' + randomHash;

        const options = {
            link: link
        };
        let mailBody = mustache.render(mailTemplates.signUp.body, options);
        const mailOptions = {
            from: mailAccountUserName,
            to: primaryEmail,
            cc: mailTemplates.signUp.cc,
            bcc: mailTemplates.signUp.bcc,
            subject: mailTemplates.signUp.subject,
            html: mailBody
        };

        const tempUserInDB = await tempUser.findOne({ daiictId });

        if (!tempUserInDB) {
            //create new temp user
            const newUser = {
                daiictId,
                primaryEmail,
                password: await hashPassword(password),
                createdOn,
                randomHash
            };
            const savedUser = await tempUser.findOneAndUpdate({ daiictId }, newUser, { upsert: true, new:true });
        } else {

            const newUser = {
                daiictId,
                primaryEmail,
                password: await hashPassword(password),
                randomHash
            };

            const timeNotAllowed = new Date();
            timeNotAllowed.setHours(timeNotAllowed.getHours() - userBlockageTimeForTooManySignUpRequests);

            if (tempUserInDB.createdOn <= timeNotAllowed) {
                newUser.createdOn = createdOn;
                newUser.totalRequestSent = 1;
            } else if (tempUserInDB.totalRequestSent >= maximumSignUpRequestBeforeBlocking) {
                return res.status(HttpStatus.FORBIDDEN)
                    .send(errorMessages.blockUser);
            } else {
                newUser.totalRequestSent = tempUserInDB.totalRequestSent + 1;
            }
            const savedUser = await tempUser.findOneAndUpdate({ daiictId }, newUser, { upsert: true, new:true });
        }

        const info = await smtpTransport.sendMail(mailOptions);
        res.status(HttpStatus.CREATED)
            .end('Response: Verification link sent');


    },

    resendVerificationLink: async (req, res, next) => {
        const { daiictId } = req.params;
        const user = await tempUser.findOne({ daiictId });

        const timeNotAllowed = new Date();
        timeNotAllowed.setHours(timeNotAllowed.getHours() - userBlockageTimeForTooManySignUpRequests);
        if (user.createdOn <= timeNotAllowed) {
            return res.sendStatus(HttpStatus.FORBIDDEN)
                .send(errorMessages.signUpRequestExpired);
        } else if (user.totalRequestSent >= maximumSignUpRequestBeforeBlocking) {
            return res.status(HttpStatus.FORBIDDEN)
                .send(errorMessages.blockUser);
        } else {
            user.totalRequestSent = user.totalRequestSent + 1;
            await user.save();
        }
        const primaryEmail = user.primaryEmail;
        const host = req.get('host');
        const link = httpProtocol + '://' + host + '/account/verify/' + daiictId + '?id=' + user.randomHash;

        const options = {
            link: link
        };
        let mailBody = mustache.render(mailTemplates.signUp.body, options);
        const mailOptions = {
            from: mailAccountUserName,
            to: primaryEmail,
            cc: mailTemplates.signUp.cc,
            bcc: mailTemplates.signUp.bcc,
            subject: mailTemplates.signUp.subject,
            html: mailBody
        };

        const resendVerificationLink = httpProtocol + '://' + host + '/account/resendVerificationLink/' + daiictId;
        const info = await smtpTransport.sendMail(mailOptions);

        res.status(HttpStatus.CREATED)
            .end('<h1>Verification link sent to email ' + primaryEmail + ' please verify your account</h1><br><a href=' + resendVerificationLink + '>Click here to resend verification link</a>');
    },

    verifyAccount: async (req, res, next) => {
        const { daiictId } = req.params;
        const user = await tempUser.findOne({ daiictId });

        // if user has been verified already
        if (!user) {
            res.end('<h2>This link has been used already and is now invalid.</h2>');
        }

        else if (req.query.id === user.randomHash) {
            //crete new Cart
            const cart = new Cart({
                requestedBy: daiictId,
                createdOn: user.createdOn,
            });
            await cart.save();

            const userInfo = await UserInfo.findOne({ user_inst_id: daiictId });

            //create new user
            const newUser = new User({
                daiictId: user.daiictId,
                primaryEmail: user.primaryEmail,
                password: user.password,
                createdOn: user.createdOn,
                cartId: cart._id,
                userInfo: userInfo._id
            });

            const savedUser = await newUser.save();
            await tempUser.findByIdAndRemove(user._id);

            req.flash('User sucessfully verified');
            res.redirect(homePage);
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).end('<h2>Bad Request</h2>');
        }
    },

    forgetPassword: async (req, res, next) => {
        const { daiictId } = req.params;

        //check if user exist
        const foundUser = await User.findOne({ daiictId });

        if (!foundUser) {
            return res.sendStatus(HttpStatus.FORBIDDEN);
        }

        let randomHash;
        const linkExpiryTime = new Date();
        linkExpiryTime.setHours(linkExpiryTime.getHours() + RESET_PASSWORD_EXPIRY_TIME);

        if (foundUser.resetPasswordRequestTime) {
            const timeNotAllowed = new Date();
            timeNotAllowed.setHours(timeNotAllowed.getHours() - userBlockageTimeForTooManySignUpRequests);

            if (foundUser.resetPasswordRequestTime <= timeNotAllowed) {
                foundUser.resetPasswordRequestTime = new Date();
                randomHash = randomstring.generate();
                foundUser.resetPasswordRequest = 1;
            } else if (foundUser.resetPasswordRequest >= maximumSignUpRequestBeforeBlocking) {
                return res.status(HttpStatus.FORBIDDEN)
                    .send(errorMessages.blockUser);
            } else {
                randomHash = foundUser.resetPasswordToken;
                foundUser.resetPasswordRequest++;
            }
        } else {
            randomHash = randomstring.generate();
            foundUser.resetPasswordRequestTime = new Date();
            foundUser.resetPasswordRequest = 1;
        }

        const primaryEmail = foundUser.primaryEmail;

        const host = req.get('host');
        const link = httpProtocol + '://' + host + '/account/resetPassword/' + daiictId + '?id=' + randomHash;

        const tags = {
            daiictId: daiictId,
            link: link
        };
        let mailBody = mustache.render(mailTemplates.forgetPassword.body, tags);

        const mailOptions = {
            from: mailAccountUserName,
            to: primaryEmail,
            cc: mailTemplates.forgetPassword.cc,
            bcc: mailTemplates.forgetPassword.bcc,
            subject: mailTemplates.forgetPassword.subject,
            html: mailBody
        };

        foundUser.resetPasswordToken = randomHash;
        foundUser.resetPasswordExpires = linkExpiryTime;
        const updatedUser = await foundUser.save();

        await smtpTransport.sendMail(mailOptions);

        res.status(HttpStatus.OK)
            .end('Response: Password reset link sent');
    },

    verifyResetPasswordLink: async (req, res, next) => {
        const { daiictId } = req.params;
        const user = await User.findOne({ daiictId });

        //user already exist
        if (!user || user.resetPasswordToken !== req.query.id || user.resetPasswordExpires < new Date()) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect(homePage);
        }

        res.render('reset', {
            user: req.user
        });
    },

    resetPassword: async (req, res, next) => {
        const { daiictId } = req.params;
        const user = await User.findOne({ daiictId });

        if (!user || user.resetPasswordToken !== req.query.id || user.resetPasswordExpires < new Date()) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/');
        }

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
        }

        user.password = await hashPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordRequest = undefined;
        user.resetPasswordRequestTime = undefined;

        await user.save();
        const primaryEmail = user.primaryEmail;

        const options = {
            daiictId: daiictId
        };
        let mailBody = mustache.render(mailTemplates.passwordChanged.body, options);
        const mailOptions = {
            from: mailAccountUserName,
            to: primaryEmail,
            cc: mailTemplates.passwordChanged.cc,
            bcc: mailTemplates.passwordChanged.bcc,
            subject: mailTemplates.passwordChanged.subject,
            html: mailBody
        };
        const info = await smtpTransport.sendMail(mailOptions);
        res.redirect(homePage);
    },

    changePassword: async (req, res, next) => {

        const { newPassword } = req.value.body;
        const { user } = req;
        const { daiictId } = user;

        const newUser = await User.findOneAndUpdate({ daiictId }, { password: await hashPassword(newPassword) }, { new: true });

        res.status(HttpStatus.OK)
            .json({});
    },

    signIn: async (req, res, next) => {

        //sign token
        const userAtt = req.value.body;
        const token = signToken(userAtt);

        //get User Id
        const { user } = req;

        if (user.userType !== 'superAdmin') {
            if ((user.userInfo.user_type !== 'STUDENT')
                && user.userInfo.user_status && user.userInfo.user_status === 'U') {
                user.userType = adminTypes.admin;
            } else {
                user.userType = userTypes.student;
            }
        }

        if (user.resetPasswordToken !== undefined) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.resetPasswordRequest = undefined;
            user.resetPasswordRequestTime = undefined;
            await user.save();
        }
        const permission = accessControl.can(user.userType)
            .readOwn(resources.user);

        const filteredUser = filterResourceData(user, permission.attributes);

        if (!user.isActive) {
            return res.status(HttpStatus.FORBIDDEN)
                .send(errorMessages.userDeactivated);
        }
        res.cookie(cookiesName.jwt, token, {
            httpOnly: false,
            expires: new Date(Date.now() + JWT_EXPIRY_TIME * 24 * 60 * 60 * 1000),
        })
            .status(HttpStatus.OK)
            .json({ user: filteredUser });
    },

    signOut: async (req, res, next) => {
        res.clearCookie('jwt');
        res.status(HttpStatus.OK)
            .json({});
    },
};
