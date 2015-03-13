import alt from '../alt';

import ApiRequester from '../Services/ApiRequester';
import DatagridActions from '../Actions/DatagridActions';

class DatagridStore {
    constructor() {
        this.bindActions(DatagridActions);

        this.entries = [];
        this.totalItems = 0;

        this.sortDir = null;
        this.sortField = null;
    }

    loadData(args) {
        var view = args.view, page = args.page;

        var sortField = this.sortField || view.sortField() || 'id';
        var sortDir = this.sortDir || view.sortDir() || 'DESC';

        ApiRequester.getAll(view, page, true, [], sortField, sortDir)
            .then(function(data) {
                this.entries = data;
                this.totalItems = 3000;
                this.emitChange();
            }.bind(this));
    }

    sort(args) {
        this.sortDir = args.sortDir;
        this.sortField = args.sortField;

        return this.loadData(args.view);
    }
}

export default alt.createStore(DatagridStore);
