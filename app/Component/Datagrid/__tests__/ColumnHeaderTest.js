jest.autoMockOff();

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('ColumnHeader', function() {
    var ColumnHeader, DatagridActions;

    beforeEach(function() {
        ColumnHeader = require('../ColumnHeader');
        DatagridActions = require('../../../Actions/DatagridActions');
    });

    it('should set text to field label', function() {
        var header = TestUtils.renderIntoDocument(<ColumnHeader label="Name"/>);
        header = React.findDOMNode(header);

        expect(header.textContent).toBe('Name');
    });

    it('should show correct sort icon if sorted by current column', function() {
        // ASC order
        var header = TestUtils.renderIntoDocument(<ColumnHeader sort="ASC" label="Name"/>);
        header = React.findDOMNode(header);
        var sortIcon = header.querySelectorAll(".sorted-asc");
        expect(sortIcon.length).toBe(1);

        // DESC order
        header = TestUtils.renderIntoDocument(<ColumnHeader sort="DESC" label="Name"/>);
        header = React.findDOMNode(header);
        sortIcon = header.querySelectorAll(".sorted-desc");
        expect(sortIcon.length).toBe(1);
    });

    it('should send sort action when clicking on header link', function() {
        var sortMock = jest.genMockFunction();
        DatagridActions.sort = sortMock;

        var view = { name: function() { return 'myView'; } };
        var header = TestUtils.renderIntoDocument(<ColumnHeader sort="ASC" fieldName="name" label="Name" view={view}/>);
        header = React.findDOMNode(header);

        var link = header.querySelector('a');
        TestUtils.Simulate.click(link);

        expect(sortMock.mock.calls.length).toBe(1);
        expect(sortMock.mock.calls[0][0]).toEqual({
            sortField: 'myView.name',
            sortDir: 'DESC',
            view: view
        });
    });
});
