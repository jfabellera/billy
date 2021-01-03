import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

const uniqueElements = (arr) => {
  let result = [];
  arr.forEach((elem) => {
    if (!result.includes(elem)) result.push(elem);
  });
  return result;
};

/**
 * Stupid component to make up for CreatableSelect's
 * stupid behavior this shouldn't even be necessary
 * I spendt3 hours trying to find a solution but this
 * will do I guess. Also I was watching a kdrama
 * with my parent and not really paying attention to
 * whats happening in here, theres probably a better
 * way to do this.
 */
class CustomInputSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      prevSelected: '-------------------------------',
      newOptions: [],
    };
  }

  // for component onChange prop
  componentDidUpdate() {
    let selected;
    if (this.state.selected.value) selected = this.state.selected.value;
    else if (this.state.selected) selected = this.state.selected;
    else selected = this.props.defaultIfEmpty || '';

    const e = {
      target: {
        name: this.props.name,
        value: selected,
      },
    };

    if (this.state.prevSelected !== this.state.selected) {
      this.setState({ prevSelected: this.state.selected });
      this.props.onChange(e);
    }
  }

  onSelectChange = (selectedOption, action) => {
    if (action.action === 'clear') this.setState({ selected: '' });

    if (selectedOption && action.action === 'select-option')
      this.setState({ selected: selectedOption.value });

    if (selectedOption && action.action === 'create-option') {
      this.setState({
        selected: selectedOption.value,
        newOptions: [...this.state.newOptions, selectedOption.value],
      });
    }
  };

  onSelectInputChange = (selectInputValue, action) => {
    if (action.action === 'input-change') {
      this.setState({ selected: selectInputValue });
    }
  };

  render() {
    // combine new options with given options
    const options = uniqueElements(
      this.props.options.concat(this.state.newOptions)
    ).map((opt) => {
      return { value: opt, label: opt };
    });

    // default select
    const selectElement = (
      <CreatableSelect
        name={this.props.name}
        isClearable
        openMenuOnFocus
        onChange={this.onSelectChange}
        onInputChange={this.onSelectInputChange}
        placeholder={this.props.placeholder || 'Select...'}
        options={options}
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        closeMenuOnScroll={true}
      />
    );

    // stupid
    if (
      this.props.options.includes(this.props.value) ||
      this.state.newOptions.includes(this.props.value)
    ) {
      return React.cloneElement(selectElement, {
        value: { value: this.props.value, label: this.props.value },
      });
    } else if (this.props.value) {
      return React.cloneElement(selectElement, {
        inputValue: this.props.value,
      });
    } else {
      return React.cloneElement(selectElement, { value: null });
    }
  }
}

export default CustomInputSelect;
