const Scheme = require('../module/Scheme');

const scheme = {
    '/:genre': {
        'GET': {
            // todo ジャンルを指定してtop10の順位、作品番号、作品名、代表者名、メンバー一覧、作品写真を取得する
            // テストとしてただのselect を書く
            'query': 'SELECT ?? FROM ?? WHERE ?? = ?',
            'table': ['products.product_id', 'products', 'genre', 'fashion']
        }
    }
};

module.exports = {
    '/:genre': {
        'GET': (param) => { return new Scheme(scheme['/:genre'].GET.query, scheme['/:genre'].GET.table, param); }
    }
};