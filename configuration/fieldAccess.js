module.exports = {
    User: {
        superAdmin: {
            canUpdate: [
                'name',
                'secondaryEmail',
                'contactNo',
                'gender',
                'programme',
                'requestedServices',
                'password',
            ],
            canRead: [
                'name',
                'secondaryEmail',
                'contactNo',
                'gender',
                'programme',
                'userType',
                'isActive',
                'requestedServices',
                'notifications',
                'daiictId',
                'primaryEmail',
                'createdOn',
                'addresses',
                'userInfo',
            ],
            canCreate: [
                'name',
                'secondaryEmail',
                'contactNo',
                'gender',
                'programme',
                'requestedServices',
                'daiictId',
                'primaryEmail',
                'password',
            ],
        },
        student: {
            canUpdate: [
                'name',
                'secondaryEmail',
                'contactNo',
                'gender',
                'programme',
                'requestedServices',
                'addresses',
            ],
            canRead: [
                'name',
                'secondaryEmail',
                'contactNo',
                'gender',
                'programme',
                'userType',
                'isActive',
                'requestedServices',
                'notifications',
                'daiictId',
                'primaryEmail',
                'createdOn',
                'addresses',
                'userInfo',
            ],
            canCreate: [
                'name',
                'secondaryEmail',
                'contactNo',
                'gender',
                'programme',
                'requestedServices',
                'daiictId',
                'primaryEmail',
                'password',
                'addresses',
            ],
        },
    },
    News: {
        superAdmin: {
            canRead: [
                '_id',
                'message',
                'createdOn',
            ],
            canCreate: [
                'message',
            ],
            canUpdate: [
                'message',
            ],
        },
        student: {
            canRead: [
                'message',
                'createdOn',
            ],
            canCreate: [],
            canUpdate: [],
        },
    },
    Notification: {
        superAdmin: {
            canRead: [
                '_id',
                'message',
                'createdOn',
            ],
            canCreate: [
                'message',
            ],
            canUpdate: [
                'message',
            ],
        },
        student: {
            canRead: [
                '_id',
                'message',
                'createdOn',
            ],
            canCreate: [],
            canUpdate: [],
        },
    },
    Order: {
        superAdmin: {
            canRead: [
                '_id',
                'requestedBy',
                'cartId',
                'service',
                'serviceName',
                'createdOn',
                'lastModified',
                'lastModifiedBy',
                'serviceCost',
                'parameterCost',
                'comment',
                'collectionTypeCost',
                'totalCost',
                'status',
                'parameters',
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'delivery',
                'pickup',
                'collectionType',
                'validityErrors',
                'unitsRequested',
                'cancelReason',
                'statusChangeTime'
            ],
            canCreate: [],
            canUpdate: [
                'status',
                'cancelReason',
                'statusChangeTime'
            ],
        },
        student: {
            canRead: [
                '_id',
                'requestedBy',
                'cartId',
                'service',
                'serviceName',
                'createdOn',
                'lastModified',
                'serviceCost',
                'parameterCost',
                'collectionTypeCost',
                'totalCost',
                'status',
                'comment',
                'parameters',
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'delivery',
                'pickup',
                'collectionType',
                'validityErrors',
                'unitsRequested',
                'cancelReason',
                'statusChangeTime'
            ],
            canCreate: [
                'service',
                'parameters',
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'comment',
                'collectionType',
                'unitsRequested',
                'delivery',
                'pickup',
            ],
            canUpdate: [
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'comment',
                'delivery',
                'pickup',
                'unitsRequested',
            ]
        },
    },
    Cart: {
        superAdmin: {
            canRead: [
                '_id',
                'orderId',
                'requestedBy',
                'orders',
                'createdOn',
                'lastModified',
                'lastModifiedBy',
                'collectionTypeCost',
                'ordersCost',
                'totalCost',
                'status',
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'paymentCode',
                'delivery',
                'pickup',
                'collectionType',
                'validityErrors',
                'cancelReason',
                'statusChangeTime'
            ],
            canCreate: [],
            canUpdate: [
                'status',
                'cancelReason',
                'statusChangeTime'
            ],
        },
        student: {
            canRead: [
                '_id',
                'orderId',
                'requestedBy',
                'orders',
                'createdOn',
                'lastModified',
                'lastModifiedBy',
                'collectionTypeCost',
                'ordersCost',
                'totalCost',
                'status',
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'paymentCode',
                'delivery',
                'pickup',
                'collectionType',
                'validityErrors',
                'cancelReason',
                'statusChangeTime'
            ],
            canCreate: [
                'orders',
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'delivery',
                'pickup',
                'collectionType',
            ],
            canUpdate: [
                'paymentType',
                'isPaymentDone',
                'paymentId',
                'delivery',
                'pickup',
                'statusChangeTime'
            ]
        },
    },
    Service: {
        superAdmin: {
            canRead: [
                '_id',
                'name',
                'description',
                'createdOn',
                'createdBy',
                'isApplicationSpecific',
                'isSpecialService',
                'isActive',
                'maxUnits',
                'baseCharge',
                'availableParameters',
                'specialServiceUsers',
                'availablePaymentModes',
                'collectionTypes',
                'allowedUserTypes',
                'allowedProgrammes',
                'allowedBatches'
            ],
            canCreate: [
                'name',
                'description',
                'isApplicationSpecific',
                'isAvailableForAlumni',
                'isCourierAvailable',
                'isSpecialService',
                'isActive',
                'maxUnits',
                'baseCharge',
                'availableParameters',
                'specialServiceUsers',
                'availablePaymentModes',
                'collectionTypes',
                'allowedUserTypes',
                'allowedProgrammes',
                'allowedBatches'
            ],
            canUpdate: [
                'name',
                'description',
                'isApplicationSpecific',
                'isAvailableForAlumni',
                'isCourierAvailable',
                'isSpecialService',
                'isActive',
                'maxUnits',
                'baseCharge',
                'availableParameters',
                'specialServiceUsers',
                'availablePaymentModes',
                'collectionTypes',
                'allowedUserTypes',
                'allowedProgrammes',
                'allowedBatches'
            ],
        },
        student: {
            canRead: [
                '_id',
                'name',
                'description',
                'maxUnits',
                'baseCharge',
                'availableParameters',
                'availablePaymentModes',
                'collectionTypes',
            ],
            canCreate: [],
            canUpdate: []
        },
    },
    SpecialService: {
        superAdmin: {
            canRead: [
                '*'
            ],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [],
            canCreate: [],
            canUpdate: []
        },
    },
    InActiveResource: {
        superAdmin: {
            canRead: [
                '*'
            ],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [],
            canCreate: [],
            canUpdate: []
        },
    },
    changeResourceStatus: {
        superAdmin: {
            canRead: [],
            canCreate: [],
            canUpdate: [
                '*'
            ],
        },
        student: {
            canRead: [],
            canCreate: [],
            canUpdate: []
        },
    },
    Collector: {
        superAdmin: {
            canRead: [
                '_id',
                'name',
                'daiictId',
                'contactNo',
                'email',
                'collectionCode',
                'createdOn',
                'createdBy',
                'orderId',
                'status',
            ],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [
                '_id',
                'name',
                'daiictId',
                'contactNo',
                'email',
                'collectionCode',
                'orderId',
                'status',
            ],
            canCreate: [
                'name',
                'daiictId',
                'contactNo',
                'email',
            ],
            canUpdate: [
                'name',
                'daiictId',
                'contactNo',
                'email',
            ]
        },
    },
    Courier: {
        superAdmin: {
            canRead: [
                '_id',
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'createdOn',
                'createdBy',
                'pinCode',
                'trackingId',
                'courierServiceName',
                'orderId',
                'status',
            ],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [
                '_id',
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'pinCode',
                'trackingId',
                'courierServiceName',
                'orderId',
                'status',
            ],
            canCreate: [
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'pinCode',
            ],
            canUpdate: [
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'pinCode',
            ]
        },
    },
    CourierInfo: {
        superAdmin: {
            canRead: [],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [
                '_id',
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'pinCode',
            ],
            canCreate: [
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'pinCode',
            ],
            canUpdate: [
                'name',
                'contactNo',
                'email',
                'address',
                'city',
                'state',
                'country',
                'pinCode',
            ]
        },
    },
    Parameter: {
        superAdmin: {
            canRead: [
                '_id',
                'name',
                'description',
                'baseCharge',
                'createdOn',
                'createdBy',
                'isActive'
            ],
            canCreate: [
                '_id',
                'name',
                'description',
                'baseCharge',
            ],
            canUpdate: [
                'name',
                'description',
                'baseCharge',
                'isActive'
            ],
        },
        student: {
            canRead: [
                '_id',
                'name',
                'description',
                'baseCharge',
                'isActive'
            ],
            canCreate: [],
            canUpdate: []
        },
    },
    CollectionType: {
        superAdmin: {
            canRead: [
                '_id',
                'name',
                'description',
                'baseCharge',
                'createdOn',
                'createdBy',
                'isActive',
                'category'
            ],
            canCreate: [
                '_id',
                'name',
                'description',
                'baseCharge',
                'category'
            ],
            canUpdate: [
                'name',
                'description',
                'baseCharge',
                'isActive',
                'category'
            ],
        },
        student: {
            canRead: [
                '_id',
                'name',
                'description',
                'baseCharge',
                'category'
            ],
            canCreate: [],
            canUpdate: []
        },
    },
    AccessLevel: {
        superAdmin: {
            canRead: [],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [],
            canCreate: [],
            canUpdate: []
        },
    },
    Role: {
        superAdmin: {
            canRead: [],
            canCreate: [],
            canUpdate: [],
        },
        student: {
            canRead: [],
            canCreate: [],
            canUpdate: []
        },
    },
    UserInfo: {
        superAdmin: {
            canRead: [
                '_id',
                'user_inst_id',
                'user_type',
                'user_first_name',
                'user_last_name',
                'user_sex',
                'user_email_id',
                'user_status',
                'user_adr_contact_name',
                'user_adr_line1',
                'user_adr_line2',
                'user_adr_line3',
                'user_adr_city',
                'user_adr_district',
                'user_adr_state',
                'user_adr_country',
                'user_adr_pincode',
                'user_adr_telno',
                'user_adr_mobileno',
                'user_adr_emailid',
                'user_batch',
                'user_programme',
            ],
            canCreate: [
                'user_inst_id',
                'user_type',
                'user_first_name',
                'user_last_name',
                'user_sex',
                'user_email_id',
                'user_status',
                'user_adr_contact_name',
                'user_adr_line1',
                'user_adr_line2',
                'user_adr_line3',
                'user_adr_city',
                'user_adr_district',
                'user_adr_state',
                'user_adr_country',
                'user_adr_pincode',
                'user_adr_telno',
                'user_adr_mobileno',
                'user_adr_emailid',
                'user_batch',
                'user_programme',
            ],
            canUpdate: [
                'user_inst_id',
                'user_type',
                'user_first_name',
                'user_last_name',
                'user_sex',
                'user_email_id',
                'user_status',
                'user_adr_contact_name',
                'user_adr_line1',
                'user_adr_line2',
                'user_adr_line3',
                'user_adr_city',
                'user_adr_district',
                'user_adr_state',
                'user_adr_country',
                'user_adr_pincode',
                'user_adr_telno',
                'user_adr_mobileno',
                'user_adr_emailid',
                'user_batch',
                'user_programme',
            ],
        },
        student: {
            canRead: [
                'user_inst_id',
                'user_type',
                'user_first_name',
                'user_last_name',
                'user_sex',
                'user_email_id',
                'user_status',
                'user_adr_contact_name',
                'user_adr_line1',
                'user_adr_line2',
                'user_adr_line3',
                'user_adr_city',
                'user_adr_district',
                'user_adr_state',
                'user_adr_country',
                'user_adr_pincode',
                'user_adr_telno',
                'user_adr_mobileno',
                'user_adr_emailid',
                'user_batch',
                'user_programme',
            ],
            canCreate: [],
            canUpdate: [],
        }
    }
};
