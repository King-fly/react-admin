import React from 'react';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';
import Notification from '../Services/Notification';

import Datagrid from '../Component/Datagrid/Datagrid';
import MaDatagridPagination from '../Component/Datagrid/MaDatagridPagination';
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';

class ListView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnFailure = this.onLoadFailure.bind(this);
        EntityStore.addFailureListener(this.boundedOnFailure);

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeFailureListener(this.boundedOnFailure);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.query.page !== this.props.query.page ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).views.ListView;
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const {page, sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadListData(this.context.restful, this.props.configuration, this.getView(), page, sortField, sortDir);
    }

    onLoadFailure(response) {
        let body = response.data;
        if (typeof message === 'object') {
            body = JSON.stringify(body);
        }

        Notification.log(`Oops, an error occured during data fetching  : (code: ${response.status}) ${body}`,
            {addnCls: 'humane-flatty-error'});
    }

    buildPagination(view) {
        const totalItems = this.state.data.get('totalItems');
        const page = this.state.data.get('page');

        return <MaDatagridPagination totalItems={totalItems} entity={view.entity.name()} page={page} perPage={view.perPage()} />;
    }

    render() {
        if (!this.state) {
            return null;
        }

        const configuration = this.props.configuration;
        const entityName = this.context.router.getCurrentParams().entity;
        const view = this.getView(entityName);
        const sortDir = this.state.data.get('sortDir');
        const sortField = this.state.data.get('sortField');
        const dataStore = this.state.data.getIn(['dataStore', 'object']);
        const entries = dataStore.getEntries(view.entity.uniqueId);
        const actions = view.actions() || ['create'];

        if (!entries || !entries.length) {
            return null;
        }

        return (
            <div className="view list-view">
                <ViewActions entityName={view.entity.name()} buttons={actions} />

                <div className="page-header">
                    <h1><Compile>{view.title() || entityName + " list"}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <Datagrid
                    name={view.name()}
                    entityName={view.entity.name()}
                    configuration={configuration}
                    listActions={view.listActions()}
                    fields={view.getFields()}
                    entries={entries}
                    sortDir={sortDir}
                    sortField={sortField}
                    />

                {this.buildPagination(view)}
            </div>
        )
    }
}

ListView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired
};
ListView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('ListView', ListView);

export default ListView;
