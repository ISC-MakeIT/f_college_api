module.exports = class Scheme {
    constructor(query, table, param) {
        this.getQuery = () => {
            return query;
        };

        this.getTable = () => {
            return table.map((e) => {
                if (e === '?') {
                    let p = param[0];
                    param.shift();
                    return e = p;
                } else {
                    return e;
                }
            });
        };
    }
};
