/* global jest,describe,it,beforeEach,expect */

jest.autoMockOff();
jest.setMock('react-router', {Link : require('../../Button/__mocks__/Link')});
jest.dontMock('../../../Field/FieldViewConfiguration');
jest.dontMock('../../../Field/StringFieldView');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const Datagrid = require('../Datagrid');
const routerWrapper = require('../../../Test/RouterWrapper');

const ListView = require('admin-config/lib/View/ListView');
const Entry = require('admin-config/lib/Entry');
const Entity = require('admin-config/lib/Entity/Entity');
const NumberField = require('admin-config/lib/Field/NumberField');
const Field = require('admin-config/lib/Field/Field');
const DateField = require('admin-config/lib/Field/DateField');

const FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
const StringFieldView = require('../../../Field/StringFieldView');
const NumberFieldView = require('../../../Field/NumberFieldView');
const DateFieldView = require('../../../Field/DateFieldView');

FieldViewConfiguration.registerFieldView('string', StringFieldView);
FieldViewConfiguration.registerFieldView('number', NumberFieldView);
FieldViewConfiguration.registerFieldView('date', DateFieldView);

function getDatagrid(name, entityName, fields, view, router, entries, sortDir, sortField, configuration) {
    if (!configuration) {
        configuration = {
            getEntity: () => new Entity()
        };
    }

    return routerWrapper(() => <Datagrid
        name={name}
        fields={fields}
        entityName={entityName}
        view={view}
        router={router}
        entries={entries}
        sortDir={sortDir}
        sortField={sortField}
        listActions={view.listActions()}
        configuration={configuration}/>
    );
}

describe('Datagrid', () => {
    let view;
    let router;
    let fields;

    beforeEach(() => {
        view = new ListView('myView');

        router = {
            getCurrentQuery: () => 1
        };

        fields = [
            new NumberField('id').label('#'),
            new Field('title').label('Title').isDetailLink(true),
            new DateField('created_at').label('Creation date')
        ];
    });

    describe('Column headers', () => {
        it('should set header with correct label for each field', () => {
            let datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            datagrid = React.findDOMNode(datagrid);

            const headers = [].slice.call(datagrid.querySelectorAll('thead th')).map(h => h.textContent);
            expect(headers).toEqual(['#', 'Title', 'Creation date']);
        });

        it('should send `sort` event to datagrid when clicking on header', () => {
            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            const datagridNode = React.findDOMNode(datagrid);
            const header = datagridNode.querySelector('thead th a');
            TestUtils.Simulate.click(header);

            expect(header.attributes['data-click-to'].value).toEqual('my-route');
        });
    });

    describe('Datagrid entries', () => {
        it('should set rows with correct values for each field', () => {
            const entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1),
                new Entry('posts', { 'id': 2, 'title': 'Second Post', 'created_at': '2015-05-28' }, 2),
                new Entry('posts', { 'id': 3, 'title': 'Third Post', 'created_at': '2015-05-29' }, 3)
            ];

            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries);
            const datagridNode = React.findDOMNode(datagrid);
            const rows = datagridNode.querySelectorAll('tbody tr');

            expect(rows.length).toEqual(3);
            expect(rows[0].childNodes.length).toEqual(3);
            expect(rows[0].childNodes[1].textContent).toEqual('First Post');
            expect(rows[2].childNodes[2].textContent).toEqual('2015-05-29');
        });

         it('should set rows with correct values, plus action buttons', () => {
            const entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1)
            ];

            view = view.listActions(['edit']);

            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries);
            const datagridNode = React.findDOMNode(datagrid);
            const cells = datagridNode.querySelectorAll('tbody tr td');

            expect(cells.length).toEqual(4);
            expect(cells[3].textContent).toContain('Edit');
        });

        it('should set rows with correct values, plus action buttons', () => {
            const entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1)
            ];

            view = view.listActions(['edit']);

            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries, null, null);
            const datagridNode = React.findDOMNode(datagrid);
            const detailLink = datagridNode.querySelector('tbody tr:nth-child(1) td:nth-child(2) a');

            expect(detailLink.tagName.toLowerCase()).toBe('a');
        });
    });
});
