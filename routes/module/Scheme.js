module.exports = class Scheme {
    constructor(query, table, params) {
        this.getQuery = () => {
            return query;
        };

        this.getTable = () => {
            return table.map((e) => {
                if (e === '?') {
                    let p = params[0];
                    params.shift();
                    return e = p;
                } else {
                    return e;
                }
            });
        };
    }
};
