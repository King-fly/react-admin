import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';
import DatagridStore from '../../Store/DatagridStore';
import Header from './ColumnHeader';
import Pagination from './Pagination';

import { BooleanField, DateField, NumberField, ReferenceField, TemplateField } from './Field';

class Datagrid extends React.Component {
    constructor() {
        this.state = {
            entries: [],
            totalItems: 0
        };
    }

    componentDidMount() {
        DatagridStore.listen(this.onChange.bind(this));
        this.refreshData(this.props.view);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity !== this.props.entity) {
            // Shouldn't switching view prop re-render component directly?
            this.refreshData(nextProps.view);
        }
    }

    componentWillUnmount() {
        DatagridStore.unlisten(this.onChange.bind(this));
    }

    onChange() {
        this.setState({
            entries: DatagridStore.getState().entries,
            totalItems: DatagridStore.getState().totalItems
        });
    }

    refreshData(view) {
        DatagridActions.loadData({
            view: view,
            page: this.props.page
        });
    }

    buildHeaders() {
        let headers = [];

        let sortDir = DatagridStore.getState().sortDir;
        let sortField = DatagridStore.getState().sortField;

        for (let fieldName in this.props.fields) {
            let sort = null;
            if (this.props.view.name() + "." + fieldName === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header sort={sort} view={this.props.view} fieldName={fieldName} label={this.props.fields[fieldName].label()} />
            );
        }

        return headers;
    }

    buildRecords() {
        return this.state.entries.map(r => (
            <tr>
                {this.buildCells(r)}
            </tr>
        ));
    }

    buildCells(row) {
        var cells = [];
        for (var fieldName in this.props.fields) {
            if (!this.props.fields.hasOwnProperty(fieldName)) {
                continue;
            }

            var field = this.props.fields[fieldName];

            let renderedField;

            switch (field.type()) {
                case 'string':
                    renderedField = row[fieldName];
                    break;

                case 'boolean':
                    renderedField = <BooleanField value={row[fieldName]} />;
                    break;

                case 'date':
                    renderedField = <DateField value={row[fieldName]} format={field.format()} />;
                    break;

                case 'template':
                    renderedField = <TemplateField template={field.template()} entry={row} />;
                    break;

                case 'number':
                    renderedField = <NumberField value={row[fieldName]} />;
                    break;

                case 'reference':
                    renderedField = <ReferenceField value={row[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

            cells.push(<td>{renderedField}</td>);
        }

        return cells;
    }

    render() {
        return (
            <div>
                <table className="datagrid">
                    <thead>
                        <tr>
                        {this.buildHeaders()}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.buildRecords()}
                    </tbody>
                </table>
                <Pagination perPage={this.props.perPage} totalItems={this.state.totalItems} page={this.props.page} />
            </div>
        );
    }
}

export default Datagrid;
