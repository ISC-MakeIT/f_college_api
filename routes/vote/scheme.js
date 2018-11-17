const Scheme = require('../module/Scheme');

const scheme = {
    '/:id': {
        'POST': {
            'query': 'UPDATE ?? SET ?? = ?? + 1 WHERE ?? = ?',
            'table': ['vote', 'number_of_votes', 'number_of_votes', 'product_id']
        },
        'DELETE': {
            'query': 'UPDATE ?? SET ?? = ?? - 1 WHERE ?? = ?',
            'table': ['vote', 'number_of_votes', 'number_of_votes', 'product_id']
        }
    }
};

module.exports = {
    '/:id': {
        'POST': (param) => { return new Scheme(scheme['/:id'].POST.query, scheme['/:id'].POST.table, param); },
        'DELETE': (param) => {return new Scheme(scheme['/:id'].DELETE.query, scheme['/:id'].DELETE.table, param); }
    }
};
