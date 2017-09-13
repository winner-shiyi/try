import React, { Component } from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

const MonthPicker = DatePicker.MonthPicker;

export default class MonthRange extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || {};
      this.setState(Object.assign({}, this.state, {
        startValue: value.startValue,
        endValue: value.endValue,
      }));
    }
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    this.onChange('startValue', value);
    this.props.onChange({
      startValue: value,
      endValue: this.state.endValue,
    });
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
    this.props.onChange({
      startValue: this.state.startValue,
      endValue: value,
    });
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <MonthPicker
          disabledDate={this.disabledStartDate}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM"
          value={startValue}
          placeholder="请选择开始月份"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span> ~ </span>
        <MonthPicker
          disabledDate={this.disabledEndDate}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM"
          value={endValue}
          placeholder="请结束开始月份"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}
