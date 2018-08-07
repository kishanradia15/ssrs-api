const router = require('express-promise-router')();
const passport = require('passport');

const serviceController = require('../controllers/service');
const {validateBody, validateParam, schemas} = require('../helpers/routeHelpers');

router.route('/')
    .get(
        passport.authenticate('jwt',{session: false}),
        serviceController.getAllServices
    )
    .post(
        passport.authenticate('jwt',{session: false}),
        validateBody(schemas.serviceSchema),
        serviceController.addService
    );

router.route('/:serviceId')
    .get(
        passport.authenticate('jwt',{session: false}),
        validateParam(schemas.idSchema, 'serviceId'),
        serviceController.getService
    )
    .put(
        passport.authenticate('jwt',{session: false}),
        validateParam(schemas.idSchema, 'serviceId'),
        validateBody(schemas.serviceEditSchema),
        serviceController.updateService
    )
    .patch(
        passport.authenticate('jwt',{session: false}),
        validateParam(schemas.idSchema, 'serviceId'),
        validateBody(schemas.serviceEditSchema),
        serviceController.updateService
    )
    .delete(
        passport.authenticate('jwt',{session: false}),
        validateParam(schemas.idSchema, 'serviceId'),
        serviceController.deleteService
    );

module.exports = router;
