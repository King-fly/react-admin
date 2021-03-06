jest.autoMockOff();
jest.dontMock('../CheckboxField');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

describe('CheckboxField', () => {
    let CheckboxField;
    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        CheckboxField = require('../CheckboxField');
    });

    it('should get an input with correct default value and editable', () => {
        [true, false, 1, 0].forEach((booleanValue) => {
            let checkbox = TestUtils.renderIntoDocument(<CheckboxField name="my_checkbox_field" value={booleanValue} updateField={onChange}/>);
                checkbox = React.findDOMNode(checkbox);

            expect(checkbox.checked).toBe(booleanValue ? true : false);

            TestUtils.Simulate.change(checkbox, { 'target': { 'checked': booleanValue ? false : true} });

            expect(values['my_checkbox_field']).toBe(booleanValue ? 0 : 1);
        });
    });
});
