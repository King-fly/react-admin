/* global jest,describe,it,beforeEach,expect */

jest.autoMockOff();
jest.setMock('react-router', {Link : require('../Button/__mocks__/Link')});
jest.dontMock('../../Field/FieldViewConfiguration');
jest.dontMock('../../Field/StringFieldView');
jest.dontMock('react');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const DashboardPanel = require('../DashboardPanel');
const routerWrapper = require('../../Test/RouterWrapper');

const Entity = require('admin-config/lib/Entity/Entity');
const Entry = require('admin-config/lib/Entry');
const NumberField = require('admin-config/lib/Field/NumberField');
const Field = require('admin-config/lib/Field/Field');
const DateField = require('admin-config/lib/Field/DateField');

const FieldViewConfiguration = require('../../Field/FieldViewConfiguration');
const StringFieldView = require('../../Field/StringFieldView');
const NumberFieldView = require('../../Field/NumberFieldView');
const DateFieldView = require('../../Field/DateFieldView');

FieldViewConfiguration.registerFieldView('string', StringFieldView);
FieldViewConfiguration.registerFieldView('number', NumberFieldView);
FieldViewConfiguration.registerFieldView('date', DateFieldView);

function getPanel(view, label, dataStore, sortDir, sortField, configuration) {
    if (!configuration) {
        configuration = {
            getEntity: () => new Entity()
        };
    }

    return routerWrapper(() => <DashboardPanel
        view={view}
        label={label}
        dataStore={dataStore}
        sortDir={sortDir}
        sortField={sortField}
        configuration={configuration}
        />
    );
}

describe('DashboardPanel', () => {
    let entity;
    let view;
    let dataStore;

    beforeEach(() => {
        entity = new Entity('posts');

        view = entity
            .listView('myView')
            .fields([
            new NumberField('id').label('#'),
            new Field('title').label('Title'),
            new DateField('created_at').label('Creation date')
        ]);

        dataStore = {
            getEntries: () => [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-28' }, 1)
            ]
        };
    });

    describe('Panel header', () => {
        it('should set header with label', () => {
            let panel = getPanel(view, entity.label(), dataStore, null, null);
            panel = React.findDOMNode(panel);

            const headers = [].slice.call(panel.getElementsByClassName('panel-heading')).map(h => h.textContent);
            expect(headers).toEqual(['Posts']);
        });

        it('should set header with clickable label', () => {
            let panel = getPanel(view, entity.label(), dataStore, null, null);
            panel = React.findDOMNode(panel);

            const list = panel.getElementsByClassName('panel-heading')[0].querySelector('a');
            TestUtils.Simulate.click(list);

            expect(list.attributes['data-click-to'].value).toEqual('list');
            expect(list.attributes['data-params'].value).toEqual('{"entity":"posts"}');
        });
    });

    describe('Panel entries', () => {
        it('should set rows with correct values for each field', () => {
            let panel = getPanel(view, entity.label(), dataStore, null, null);
            panel = React.findDOMNode(panel);

            const rows = panel.querySelectorAll('table tbody tr');

            expect(rows.length).toEqual(1);
            expect(rows[0].childNodes.length).toEqual(3);
            expect(rows[0].childNodes[1].textContent).toEqual('First Post');
        });
    });
});
