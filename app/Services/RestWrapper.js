class RestWrapper {
    constructor(restful) {
        this.restful = restful;
    }

    /**
     * Returns the promise of one resource by URL
     *
     * @param {String} entityName
     * @param {String} url
     *
     * @returns {promise}
     */
    getOne(entityName, url) {
        return this.restful
            .oneUrl(entityName, url)
            .get()
            .then((response) => {
                return response.body().data();
            });
    }

    /**
     * Returns the promise of a list of resources
     *
     * @param {Object} params
     * @param {String} entityName
     * @param {String} url
     *
     * @returns {promise}
     */
    getList(params, entityName, url) {
        return this.restful
            .allUrl(entityName, url)
            .getAll(params)
            .then((response) => {
                return {
                    data: response().data,
                    totalCount: response.headers()['x-total-count']
                };
            });
    }

    createOne(rawEntity, entityName, url) {
        return this.restful
            .allUrl(entityName, url)
            .post(rawEntity)
            .then((response) => {
                return response().data;
            });
    }

    updateOne(rawEntity, entityName, url) {
        return this.restful
            .oneUrl(entityName, url)
            .put(rawEntity)
            .then((response) => {
                return response().data;
            });
    }

    deleteOne(entityName, url) {
        return this.restful
            .oneUrl(entityName, url)
            .delete();
    }
}

export default RestWrapper;
