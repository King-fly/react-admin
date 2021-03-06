jest.autoMockOff();
jest.dontMock('../../../Field/FieldViewConfiguration');
jest.dontMock('../../../Field/StringFieldView');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

import Field from 'admin-config/lib/Field/Field';
import NumberField from 'admin-config/lib/Field/NumberField';
import Entity from 'admin-config/lib/Entity/Entity';

const Column = require('../Column');
const FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
const StringFieldView = require('../../../Field/StringFieldView');
const NumberFieldView = require('../../../Field/NumberFieldView');

FieldViewConfiguration.registerFieldView('string', StringFieldView);
FieldViewConfiguration.registerFieldView('number', NumberFieldView);

function getColumn(field, entity, entry, dataStore, configuration) {
    const col = TestUtils.renderIntoDocument(<Column field={field} entity={entity} entry={entry}
                                                         dataStore={dataStore} configuration={configuration} />);

    return React.findDOMNode(col);
}

describe('Column', () => {

    it('should display a string field', () => {
        const field = new Field('name');
        const entity = new Entity('posts');
        const entry = {
            values: {
                'name': 'my posts #1'
            }
        };

        const col = getColumn(field, entity, entry);

        expect(col.innerHTML).toEqual('my posts #1');
    });

    it('should display a string field with a link', () => {
        const field = new NumberField('count');
        const entity = new Entity('posts');
        const entry = {
            values: {
                'count': 123
            }
        };

        field.isDetailLink(true);

        const col = getColumn(field, entity, entry);

        expect(col.tagName.toLowerCase()).toEqual('a');
        expect(col.querySelector('span').innerHTML).toEqual('123');
    });
});
