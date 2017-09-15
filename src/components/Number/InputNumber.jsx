import React, { Component } from 'react';
import { InputNumber as AntdInputNumber } from 'antd';
import PropTypes from 'prop-types';
import { formatMoney } from '../../util';

export default class InputNumber extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onChange: PropTypes.func,
    max: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    money: PropTypes.bool,
    min: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    const value = typeof (props.value) === 'number' ? (props.value) : (props.value || undefined);
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = typeof (nextProps.value) === 'number' ? (nextProps.value) : (nextProps.value || undefined);
      this.setState({ value });
    }
  }

  handleChange(value) {
    this.props.onChange(`${value}`);
  }

  formatter = (val) => {
    let value = val;
    if (value) {
      value = (`${value}`).replace(/[^.\-\d]/g, '');
      let precision = 0;
      const valueStr = `${value}`;
      const index = valueStr.indexOf('.');
      if (index >= 0) {
        precision = valueStr.length - valueStr.indexOf('.') - 1;
      }
      if (precision > 2) {
        value = (`${value}`).slice(0, index + 3);
      }
    }
    value = (`${value}`).replace(/,/g, '');
    return value;
  }

  render() {
    const {
      money,
      max = 10000000000000000,
      min,
      placeholder,
      disabled,
    } = this.props;

    return (
      <AntdInputNumber
        disabled={disabled}
        max={+max}
        min={(typeof min === 'number' ? min : +min) || undefined}
        placeholder={placeholder}
        money={money}
        onChange={this.handleChange.bind(this)}
        value={this.state.value}
        formatter={(val) => {
          const value = this.formatter(val);
          return money ? formatMoney(value) : value;
        }}
        parser={(val) => (this.formatter(val))}
      />
    );
  }
}
