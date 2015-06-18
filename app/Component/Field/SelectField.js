import React from 'react';
import Select from 'react-select';

class SelectField extends React.Component {
    onChange(value) {
        if (!!this.props.multiple) {
            value = value.split(',');
        }

        this.props.updateField(this.props.name, value);
    }

    render() {
        let attributes = {
            options: this.props.choices.map(v => { v.value = `${v.value}`; return v; }),
            multi: !!this.props.multiple,
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this)
        };

        if (this.props.value && (!attributes.multi || this.props.value.length)) {
            attributes.value = `${this.props.value}`;
        }

        return (
            <Select {...attributes} className="form-control" />
        );
    }
}

SelectField.propTypes = {
    name: React.PropTypes.string.isRequired,
    choices: React.PropTypes.array.isRequired,
    multiple: React.PropTypes.bool,
    value: React.PropTypes.any,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

export default SelectField;
