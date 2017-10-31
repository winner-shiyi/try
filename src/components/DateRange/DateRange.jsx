import React, { Component } from 'react';
import { DatePicker, Row, Col } from 'antd';

export default class DateRange extends Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  }
  onChange(field, value) {
    this.setState({
      [field]: value,
    });
  }

  onStartChange(value) {
    this.onChange('startValue', value);
    this.props.onChange({
      startValue: value,
      endValue: this.state.endValue,
    });
  }

  onEndChange(value) {
    this.onChange('endValue', value);
    this.props.onChange({ // this.props.onChange这是antd提供的方法
      startValue: this.state.startValue,
      endValue: value,
    });
  }

  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Row span={24}>
        <Col span={11}>
          <DatePicker
            disabledDate={this.disabledStartDate.bind(this)}
            format="YYYY-MM-DD HH:mm"
            showTime
            value={startValue}
            placeholder="选择开始时间"
            onChange={this.onStartChange.bind(this)}
            onOpenChange={this.handleStartOpenChange.bind(this)}
          />
        </Col>
        <Col span={2} style={{ textAlign: 'center' }}>
          ~
        </Col>
        <Col span={11}>
          <DatePicker
            disabledDate={this.disabledEndDate.bind(this)}
            format="YYYY-MM-DD HH:mm"
            showTime
            value={endValue}
            placeholder="选择结束时间"
            onChange={this.onEndChange.bind(this)}
            open={endOpen}
            onOpenChange={this.handleEndOpenChange.bind(this)}
          />
        </Col>
      </Row>
    );
  }
}
