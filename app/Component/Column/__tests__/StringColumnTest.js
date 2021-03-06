jest.dontMock('../StringColumn');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

describe('StringColumn', () => {
    let StringColumn;

    beforeEach(() => {
        StringColumn = require('../StringColumn');
    });

    it('should display given value', () => {
        let field = TestUtils.renderIntoDocument(<StringColumn value={'Hello'} />);
        field = React.findDOMNode(field);

        expect(field.innerHTML).toBe('Hello');
        expect(field.tagName.toLowerCase()).toBe('span');
    });
});
