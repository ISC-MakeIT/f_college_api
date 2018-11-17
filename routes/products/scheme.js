const Scheme = require('../module/Scheme');

const scheme = {
    '/': {
        'GET': {
            'query': 'SELECT ?? FROM ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? GROUP BY ?? ORDER BY ?? DESC, ?? ASC',
            'table': [
                [
                    'products.product_id', 'products.genre', 'products.entry_order', 
                    'products.product_number', 'students.student_id', 'students.name', 
                    'students.class', 'photos.photo_path', 'profile_photos.profile_photo_path'
                ], 
                'photos', 'profile_photos', 'photos.product_id', 
                'profile_photos.product_id', 'products', 'profile_photos.product_id', 
                'products.product_id', 'students', 'products.leader_id', 
                'students.student_id', 
                [
                    'products.product_id', 'products.genre', 'products.entry_order', 
                    'products.product_number', 'students.student_id', 'students.name', 
                    'students.class', 'photos.photo_path', 'profile_photos.profile_photo_path'
                ], 
                'products.genre', 'products.entry_order'
            ]
        }
    },
    '/:id': {
        'GET': {
            1: {
                'query': 'SELECT ?? FROM ?? WHERE ?? = ?',
                'table': [
                    [
                        'products.product_id', 'products.genre', 'products.theme', 'products.concept'
                    ],
                    'products', 'products.product_id'
                ]
            },
            2: {
                'query': 'SELECT ?? FROM ?? JOIN ?? ON ?? = ?? WHERE ?? = ?',
                'table': [
                    [
                        'products.product_id', 'photos.photo_path'
                    ],
                    'products', 'photos', 'products.product_id', 
                    'photos.product_id', 'products.product_id'
                ]
            },
            3: {
                'query': 'SELECT ?? FROM ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? WHERE ?? = ?',
                'table': [
                    [
                        'products.product_id', 'product_members.student_id', 'students.name', 'students.class', 'profile_photos.profile_photo_path', 'product_members.leader_flg'
                    ],
                    'products', 'product_members', 'products.product_id',
                    'product_members.product_id', 'students', 'product_members.student_id',
                    'students.student_id', 'profile_photos', 'products.product_id',
                    'profile_photos.product_id', 'products.product_id'
                ]
            }
        }
    }
};

module.exports = {
    '/': {
        'GET': (param) => { return new Scheme(scheme['/'].GET.query, scheme['/'].GET.table, param); }
    },
    '/:id': {
        'GET': {
            1: (param) => {return new Scheme(scheme['/:id'].GET[1].query, scheme['/:id'].GET[1].table, param); },
            2: (param) => {return new Scheme(scheme['/:id'].GET[2].query, scheme['/:id'].GET[2].table, param); },
            3: (param) => {return new Scheme(scheme['/:id'].GET[3].query, scheme['/:id'].GET[3].table, param); }
        } 
    }
};
