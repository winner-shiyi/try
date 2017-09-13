import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import './style.scss';


export default class Editor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || '';
      this.setState({ value });
    }
  }

  handleChange(valueTemp) {
    let value = valueTemp;
    if (value === '<p><br></p>') {
      value = '';
    }
    this.props.onChange(value);
  }

  render() {
    return (
      <ReactQuill
        {...this.props}
        theme="snow"
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
