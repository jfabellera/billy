import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

import './customInputSelect.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class CustomInputSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value || '',
      prevValue: this.props.value || '',
      suggestions: [],
      focused: false,
    };
  }

  componentDidUpdate() {
    if (this.state.prevValue !== this.props.value) {
      this.setState({ prevValue: this.props.value, value: this.props.value });
    }
  }

  getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(String(value).trim());
    const regex = new RegExp('^' + escapedValue, 'i');
    const suggestions = this.props.options.filter((option) =>
      regex.test(option)
    );

    if (suggestions.length > 0) return suggestions;
    else if (this.state.value) return [{ isAddNew: true }];
    else return [];
  };

  getSuggestionValue = (suggestion) => {
    if (suggestion.isAddNew) return this.state.value;
    else return suggestion;
  };

  // Typing
  onChange = (e, { newValue }) => {
    if (this.props.onChange) this.props.onChange(e);

    this.setState({
      value: newValue,
    });
  };

  // Suggestion selected
  onSuggestionSelected = (e, { suggestionValue }) => {
    const event = {
      target: {
        name: this.props.name ? this.props.name : '',
        value: suggestionValue,
      },
    };

    this.props.onChange(event);

    this.setState({ value: suggestionValue });
  };

  // Clear
  onClear = (e) => {
    const input = e.currentTarget.parentNode.getElementsByTagName('input')[0];
    this.setState({ value: '', suggestions: this.props.options }, () => {
      input.focus();
      const event = {
        target: {
          name: this.props.name ? this.props.name : '',
          value: '',
        },
      };
      if (this.props.onChange) this.props.onChange(event);
    });
  };

  onSuggestionsFetchRequested = (action) => {
    this.setState({
      suggestions: this.getSuggestions(action.value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  renderSuggestion = (suggestion) => {
    if (suggestion.isAddNew) return <span>Create "{this.state.value}"</span>;
    return <span>{suggestion}</span>;
  };

  render() {
    const inputProps = {
      placeholder: 'Category',
      value: this.state.value,
      onChange: this.onChange,
      id: 'autosuggest',
      name: this.props.name,
      style: {
        paddingRight: '30px',
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    };

    return (
      <div className='d-flex justify-content-end'>
        <div style={{ width: '100%' }}>
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={this.getSuggestionValue}
            shouldRenderSuggestions={() => true}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
            highlightFirstSuggestion={this.state.value ? true : false}
          />
        </div>
        <FontAwesomeIcon
          icon={faTimesCircle}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginRight: '0.6rem',
            cursor: 'pointer',
            visibility:
              this.state.value ? 'visible' : 'hidden',
          }}
          onClick={this.onClear}
        />
      </div>
    );
  }
}

export default CustomInputSelect;
