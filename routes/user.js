const router = require('express-promise-router')();
const passport = require('passport');

const passportConf = require('../passport');
const userController = require('../controllers/user');
const { validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        userController.getUser
    )
    .patch(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.updateUserSchema),
        userController.updateUser
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.addUserSchema),
        userController.addUser
    );

router.route('/all')
    .get(
        passport.authenticate('jwt', { session: false }),
        userController.getAllUser
    );

router.route('/changeStatus/:requestedUserId')
    .patch(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.changeStatusSchema),
        userController.changeStatus
    );

router.route('/address')
    .get(
        passport.authenticate('jwt', { session: false }),
        userController.getAllAddresses
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.addUserAddressSchema),
        userController.addAddress
    );

router.route('/address/:requestedCourierInfoId')
    .get(
        passport.authenticate('jwt', { session: false }),
        userController.getAddress
    )
    .patch(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.updateUserAddressSchema),
        userController.updateAddress
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        userController.deleteAddress
    );

router.route('/:requestedUserId')
    .get(
        passport.authenticate('jwt', { session: false }),
        userController.getOtherUser
    )
    .patch(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.updateUserSchema),
        userController.updateOtherUser
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        userController.deleteUser
    );

module.exports = router;
