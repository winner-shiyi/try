import React, { Component } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';
import { formatMoney } from '../../util';


export default class CommonNumber extends Component {
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
      let max = this.props.max;
      if (typeof max === 'undefined') {
        max = 10000000000000000;
      }
      // if (+value > max) {
      //   value = this.state.value
      // }
      // if (value === 'undefined') {
      //   value = undefined // when blur, the value is string undefined?
      // }
      this.setState({ value });
    }
  }

  handleChange(value) {
    this.props.onChange(`${value}`);
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
      <InputNumber
        disabled={disabled}
        max={+max}
        min={(typeof min === 'number' ? min : +min) || undefined}
        placeholder={placeholder}
        money={money}
        onChange={this.handleChange.bind(this)}
        value={this.state.value}
        formatter={(valueTemp) => {
          let value = valueTemp;
          if (value) {
            value = (`${value}`).replace(/[^.-\d]/g, '');
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
          return money ? formatMoney(value) : value;
        }}
        parser={(valueTemp) => {
          let value = valueTemp;
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
          // if (+value > max || +value < min) {
          //   value = me.state.value
          // }
          // if (typeof min !== 'undefined' && +min >= 0) {
          //   value = value.replace(/\-/g, '')
          // }
          return value;
        }}
      />
    );
  }
}
