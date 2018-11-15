module.exports = class Scheme {
    constructor(query, table, param) {

        this.getQuery = () => {
            return query;
        };

        this.getTable = () => {
            return table.concat(param);
        };
    }
};
