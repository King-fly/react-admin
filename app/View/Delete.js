import React from 'react';
import Inflector from 'inflected';
import {Link} from 'react-router';
import {shouldComponentUpdate} from 'react-immutable-render-mixin';

import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';
import Notification from '../Services/Notification';

class DeleteView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        this.boundedOnDelete = this.onDelete.bind(this);
        EntityStore.addDeleteListener(this.boundedOnDelete);

        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnFailure = this.onDeletionFailure.bind(this);
        EntityStore.addFailureListener(this.boundedOnFailure);

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeDeleteListener(this.boundedOnDelete);
        EntityStore.removeFailureListener(this.boundedOnFailure);
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const {id} = this.context.router.getCurrentParams();

        EntityActions.loadDeleteData(this.context.restful, this.props.configuration, this.getView(), id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id) {
            this.refreshData();
        }
    }

    deleteEntry() {
        const {id} = this.context.router.getCurrentParams();

        EntityActions.deleteData(this.context.restful, this.props.configuration, id, this.getView());
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).deletionView();
    }

    onDelete() {
        const params = this.context.router.getCurrentParams();
        const entityName = params.entity;

        Notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });

        this.context.router.transitionTo('list', {entity: entityName});
    }

    onDeletionFailure(response) {
        let body = response.data;
        if (typeof message === 'object') {
            body = JSON.stringify(body);
        }

        Notification.log(`Oops, an error occured : (code: ${response.status}) ${body}`, {addnCls: 'humane-flatty-error'});
    }

    render() {
        if (!this.state) {
            return null;
        }

        const params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).deletionView(),
            dataStore = this.state.data.get('dataStore').first(),
            entry = dataStore.getFirstEntry(view.entity.uniqueId),
            backParams = {
                entity: entityName,
                id: params.id
            };

        if (!entry) {
            return null;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <ViewActions entityName={view.entity.name()} buttons={['back']} />

                        <div className="page-header">
                            <h1><Compile entry={entry}>{view.title()|| "Delete one " + Inflector.singularize(entityName)}</Compile></h1>
                            <p className="description"><Compile entry={entry}>{view.description()}</Compile></p>
                        </div>
                    </div>
                </div>

                <div className="row" id="delete-view">
                    <div className="col-lg-12">
                        <p>Are you sure ?</p>
                        <button className="btn btn-danger" onClick={this.deleteEntry.bind(this)}>Yes</button>
                        <Link to="edit" params={backParams} className="btn btn-default">No</Link>
                    </div>
                </div>
            </div>
        )
    }
}

DeleteView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired
};
DeleteView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('DeleteView', DeleteView);

export default DeleteView;
