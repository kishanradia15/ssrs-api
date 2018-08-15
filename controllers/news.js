const HttpStatus = require('http-status-codes');

const { filterResourceData } = require('../helpers/controllerHelpers');
const News = require('../models/news');
const { NEWS_EXPIRY_TIME, resources } = require('../configuration');
const { accessControl } = require('./access');

module.exports = {
    getAllNews: async (req, res, next) => {
        const { user } = req;

        const readPermission = accessControl.can(user.userType)
            .readAny(resources.news);
        if (readPermission.granted) {

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - NEWS_EXPIRY_TIME);
            const news = await News.find({
                createdOn: {
                    $gte: startDate,
                    $lt: new Date()
                }
            })
                .sort({ createdOn: -1 });

            if (news) {
                const filteredNews = filterResourceData(news, readPermission.attributes);
                res.status(HttpStatus.ACCEPTED)
                    .json({ news: filteredNews });
            } else {
                res.sendStatus(HttpStatus.NO_CONTENT);
            }

        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    getNews: async (req, res, next) => {
        const { user } = req;
        const { daiictId } = user;
        const { newsId } = req.params;


        const readAnyPermission = accessControl.can(user.userType)
            .readAny(resources.news);
        const readOwnPermission = accessControl.can(user.userType)
            .readOwn(resources.news);

        if (readAnyPermission.granted) {
            const news = await News.findById(newsId);
            if (news) {
                const filteredNews = filterResourceData(news, readAnyPermission.attributes);
                res.status(HttpStatus.ACCEPTED)
                    .json({ news: filteredNews });
            } else {
                res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
            }

        } else if (readOwnPermission.granted) {
            const news = await News.findOne({
                _id: newsId,
                createdBy: daiictId
            });
            if (news) {
                const filteredNews = filterResourceData(news, readOwnPermission.attributes);
                res.status(HttpStatus.ACCEPTED)
                    .json({ news: filteredNews });
            } else {
                res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
            }

        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    getNewsCreatedByMe: async (req, res, next) => {
        const { user } = req;
        const { daiictId } = user;

        const readPermission = accessControl.can(user.userType)
            .readOwn(resources.news);
        if (readPermission.granted) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - NEWS_EXPIRY_TIME);

            const news = await News.find({
                createdOn: {
                    '$gte': startDate,
                    '$lt': new Date()
                },
                createdBy: daiictId,
            })
                .sort({ createdOn: -1 });

            if (news) {
                const filteredNews = filterResourceData(news, readPermission.attributes);
                res.status(HttpStatus.ACCEPTED)
                    .json({ news: filteredNews });
            } else {
                res.sendStatus(HttpStatus.NO_CONTENT);
            }

        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    addNews: async (req, res, next) => {
        const { user } = req;
        const { daiictId } = user;

        const createPermission = accessControl.can(user.userType)
            .createOwn(resources.news);
        const readPermission = accessControl.can(user.userType)
            .readOwn(resources.news);

        if (createPermission.granted) {
            const { message } = req.body;
            const createdOn = new Date();
            const newNews = new News({
                message,
                createdOn,
                createdBy: daiictId
            });
            const news = await newNews.save();

            const filteredNews = filterResourceData(news, readPermission.attributes);
            res.status(HttpStatus.ACCEPTED)
                .json({ news: filteredNews });
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    deleteNews: async (req, res, next) => {
        const { user } = req;
        const { daiictId } = user;
        const { newsId } = req.params;

        const deleteAnyPermission = accessControl.can(user.userType)
            .deleteAny(resources.news);
        const deleteOwnPermission = accessControl.can(user.userType)
            .deleteOwn(resources.news);

        if (deleteAnyPermission.granted) {
            const news = await News.findByIdAndRemove(newsId);

            if (news) {
                res.sendStatus(HttpStatus.ACCEPTED);
            } else {
                res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
            }
        } else if (deleteOwnPermission.granted) {
            const news = await News.findOneAndRemove({
                _id: newsId,
                createdBy: daiictId
            });
            if (news) {
                res.sendStatus(HttpStatus.ACCEPTED);
            } else {
                res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
            }
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    deleteAllNews: async (req, res, next) => {
        const { user } = req;

        const deletePermission = accessControl.can(user.userType)
            .deleteAny(resources.news);
        if (deletePermission.granted) {
            await News.deleteMany({});
            res.sendStatus(HttpStatus.ACCEPTED);
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    deleteNewsCreatedByMe: async (req, res, next) => {
        const { user } = req;
        const { daiictId } = user;

        const deletePermission = accessControl.can(user.userType)
            .deleteOwn(resources.news);

        if (deletePermission.granted) {
            await News.deleteMany({ createdBy: daiictId });
            res.sendStatus(HttpStatus.ACCEPTED);
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },

    updateNews: async (req, res, next) => {
        const { user } = req;
        const { daiictId } = user;
        const { newsId } = req.params;

        const updateAnyPermission = accessControl.can(user.userType)
            .updateAny(resources.news);
        const updateOwnPermission = accessControl.can(user.userType)
            .updateOwn(resources.news);
        const readAnyPermission = accessControl.can(user.userType)
            .readAny(resources.news);
        const readOwnPermission = accessControl.can(user.userType)
            .readOwn(resources.news);

        const newNews = {
            message: req.body.message
        };

        if (updateAnyPermission.granted) {
            const news = await News.findByIdAndUpdate(newsId, newNews, { new: true });

            if (news) {
                const filteredNews = filterResourceData(news, readAnyPermission.attributes);
                res.status(HttpStatus.ACCEPTED)
                    .json({ news: filteredNews });
            } else {
                res.status(HttpStatus.NOT_ACCEPTABLE);
            }
        } else if (updateOwnPermission.granted) {
            const news = await News.updateOne({
                _id: newsId,
                createdBy: daiictId
            }, newNews, { new: true });

            if (news) {
                const filteredNews = filterResourceData(news, readOwnPermission.attributes);
                res.status(HttpStatus.ACCEPTED)
                    .json({ news: filteredNews });
            } else {
                res.status(HttpStatus.NOT_ACCEPTABLE);
            }
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    },
};
