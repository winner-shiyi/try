import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class CommonDatePicker extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    format: PropTypes.string,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    let value = props.value || undefined;
    if (value) {
      value = moment(value);
    }
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined;
      if (value) {
        value = moment(value);
      }
      this.setState({ value });
    }
  }

  handleChange(value) {
    const time = value ? moment(value).format(this.props.format || 'YYYY-MM-DD') : value;
    this.props.onChange(time);
  }

  render() {
    return (
      <DatePicker
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
