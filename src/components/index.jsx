import React from 'react';
import {
  Input,
  Form,
  DatePicker,
  Col,
  Cascader,
  Checkbox,
  Radio,
  Switch,
} from 'antd';
import CommonSelect from './Select';
import Editor from './Editor';
import CommonCheckboxGroup from './CheckboxGroup';
import ImagePicker from './ImagePicker';
import CommonDatePicker from './DatePicker';
import MonthPicker from './MonthPicker';
import MonthRange from './MonthRange';
import AutoComplete from './Input';
import InputNumber from './Number';
import NumberRange from './NumberRange';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const { RangePicker } = DatePicker;

export const geneBox = (fieldTemp, opts = {}) => {
  const field = fieldTemp;
  field.dataIndex && (field.name = field.dataIndex);
  field.title && (field.label = field.title);

  const defaultOpts = {
    size: 'default',
    ...opts,
    disabled: field.disabled,
    name: field.name,
    label: field.label,

  };
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
  switch (field.type) {
    case 'date':
      return (
        <CommonDatePicker
          {...defaultOpts}
          format="YYYY-MM-DD"
          placeholder={field.disabled ? '-' : '请选择日期'}
          onChange={field.onChange}
          disabledDate={field.disabledDate}
        />
      );
    case 'Cascader':
      return (
        <Cascader
          {...defaultOpts}
          placeholder={field.disabled ? '-' : '请选择地址'}
          options={field.data}
          onChange={field.onChange}
          changeOnSelect={!!field.changeOnSelect}
        />
      );
    case 'datetime':
      return (
        <CommonDatePicker
          {...defaultOpts}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={field.disabled ? '-' : '请选择时间'}
        />
      );
    case 'dateRange':
      return (
        <RangePicker
          {...defaultOpts}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
          placeholder={field.disabled ? '-' : ['请选择开始日期', '请选择结束日期']}
        />
      );
    case 'month':
      return (
        <MonthPicker
          {...defaultOpts}
          placeholder={field.disabled ? '-' : '请选择月份'}
        />
      );
    case 'datetimeRange':
      return (
        <RangePicker
          {...defaultOpts}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={field.disabled ? '-' : ['请选择开始时间', '请选择结束时间']}
        />
      );
    case 'monthRange':
      return (
        <MonthRange
          {...defaultOpts}
        />
      );
    case 'select':
      return (
        <CommonSelect
          {...defaultOpts}
          state={field.state}
          action={field.action}
          data={field.data}
          multiple={field.multiple}
          valueName={field.valueName}
          displayName={field.displayName}
          onSelect={field.onSelect}
          placeholder={field.disabled ? '-' : `请选择${field.labelExtra || field.label}`}
          filterOption={field.filterOption ? field.filterOption : true}
          optionFilterProp={field.optionFilterProp}
          showSearch={field.showSearch}
          allowClear={!field.required}
          page={field.page}
        />
      );
    case 'editor':
      return (
        <Editor
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
        />
      );
    case 'checkboxGroup':
      return (
        <CommonCheckboxGroup
          {...defaultOpts}
          label={field.label}
          options={field.options}
        />
      );
    case 'checkbox':
      return (
        <CheckboxGroup
          {...defaultOpts}
        />
      );
    case 'switch':
      return (
        <Switch
          checkedChildren={field.checkedChildren}
          unCheckedChildren={field.unCheckedChildren}
          {...defaultOpts}
        />
      );
    case 'image':
      return (
        <ImagePicker
          {...defaultOpts}
          data={field.data}
          tokenSeparators={field.tokenSeparators}
        />
      );
    case 'password':
      return (
        <Input
          type="password"
          {...defaultOpts}
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
        />
      );
    case 'number':
      // const min = typeof field.min === 'number' ? field.min : undefined;
      return (
        <InputNumber
          {...defaultOpts}
          max={field.max || 1000000000000000} // 16 or 99...
          min={typeof field.min === 'number' ? field.min : undefined}
          money={field.money}
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
        />
      );
    case 'textarea':
      return (
        <Input
          type="textarea"
          {...defaultOpts}
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
          autosize={field.disabled ? true : { minRows: 2, maxRows: 6 }}
          onChange={field.onChange}
        />
      );
    case 'span':
      return (
        <a
          role="button"
          tabIndex={0}
          onClick={field.onClick || ''}
        >{field.spanName || field.label || field.name}</a>
      );
    case 'radio':
      return (
        <Radio.Group
          onChange={field.onChange}
        >
          {
            field.data.map((item) => <Radio value={item[0]} key={item[0]}>{item[1]}</Radio>)
          }

        </Radio.Group>
      );
    case 'numberRange':
      return (
        <NumberRange
          {...defaultOpts}
          startMin={field.startMin}
          endMin={field.endMin}
          startMax={field.startMax}
          endMax={field.endMax}
        />
      );
    default:
      return (
        <AutoComplete
          {...defaultOpts}
          allowClear
          dataSource={field.dataSource}
          onChange={field.onChange}
          onSelect={field.onSelect}
          onFocus={field.onFocus}
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
          buttonText={field.buttonText}
          buttonClick={field.buttonClick}
        />
      );
  }
};

export const createFormItem = (opts) => {
  let {
    formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    },
    colSpan = 12,
  } = opts;

  const {
    field,
    form,
    inputOpts,
  } = opts;

  // if (!opts.formItemLayout) {
  //   formItemLayout = {
  //     labelCol: {
  //       span: 6,
  //     },
  //     wrapperCol: {
  //       span: 18,
  //     },
  //   };
  // }

  inputOpts.form = form;
  field.dataIndex && (field.name = field.dataIndex);
  field.title && (field.label = field.title);
  !field.max && !field.type && (field.max = 120);

  const rules = [];
  if (field.hidden && !field.search) {
    rules.push({
      required: false, // BUG? should set it
    });
  } else {
    let msgLabel = '';
    if (typeof field.label === 'string') {
      msgLabel = (field.labelExtra || field.label || '').replace(/\(.*\)/, '');
    }

    if (field.required) {
      let msgPefix = '请输入';
      if (['date', 'datetime', 'dateRange', 'datetimeRange', 'select'].indexOf(field.type) > -1) {
        msgPefix = '请选择';
      }
      if (field.type === 'image') {
        msgPefix = '请上传图片';
      }

      const rule = {
        required: !field.disabled,
        message: (`${msgPefix}${msgLabel}`),
      };

      if (!field.type || field.type === 'textarea') {
        rule.whitespace = true;
      }

      rules.push(rule);
    }
    if (field.validator) {
      rules.push({ validator: field.validator });
    }
    if (field.max && field.type !== 'number') {
      rules.push({ max: field.max,
        message: `${msgLabel}必须小于${field.max}个字符`,
        transform: (v) => {
          let vTemp = v;
          if (typeof v === 'number') {
            vTemp += '';
          }
          return vTemp;
        } });
    } else if (field.max && field.type === 'number') {
      rules.push({ validator: (rule, value, callback) => {
        if (value && field.max < +value) {
          callback(`${msgLabel}不能大于${field.max}`);
        }
        callback();
      } });
    }
    if (field.min && field.type !== 'number') {
      rules.push({ min: field.min,
        message: `${msgLabel}必须大于${field.min}个字符`,
        transform: (v) => {
          let vTemp = v;
          if (typeof vTemp === 'number') {
            vTemp += '';
          }
          return vTemp;
        } });
    } else if (field.min && field.type === 'number') {
      rules.push({ validator: (rule, value, callback) => {
        if (value && field.min > +value) {
          callback(`${msgLabel}不能小于${field.min}`);
        }
        callback();
      } });
    }
    if (field.pattern) {
      rules.push({ pattern: field.pattern, message: field.patternMsg });
    }
    if (field.phone) {
      rules.push({ pattern: /^1[34578][0-9]{9}$/, message: '请输入正确的手机格式' });
    }
    if (field.number) {
      rules.push({ pattern: /^\d+$/, message: '请输入数字' });
    }
    if (field.positive) {
      rules.push({ pattern:/^((\d{1,5})|(\d{1,5}\.\d{1,2}))$/, message:'请输入不大于99999.99的正数，可保留两位小数' });
    }
    if (field.ID) {
      rules.push({
        pattern: new RegExp(
          `${/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|/.source
          }${/(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.source}`
        ),
        message: '身份证格式有误',
      });
    }
    if (field.char) {
      rules.push({ pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]*$/, message: '请输入字母+数字' });
    }
    if (field.thanOne) {
      rules.push({ pattern: /^[1-9]\d{0,7}\.{0,1}\d{0,2}$/, message: '请输入大于1的正数，最多有两位小数' });
    }
    if (field.zeroToTwo) {
      rules.push({
        pattern: /^(([0-2])|(0\.(0[0-9]{0,1}|[1-9][0-9]{0,1}))|(1\.\d\d{0,1})|(2\.0[0]{0,1}))$/,
        message: '请输入0~2的数，可保留两位小数',
      });
    }
  }

  if (field.long) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: formItemLayout.labelCol.span / 2,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  if (field.small) {
    colSpan = field.small;
    formItemLayout = field.layoutData || formItemLayout;

    formItemLayout = {
      labelCol: {
        span: formItemLayout.labelCol.span / 2,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  let styles = {};
  if (!field.search && field.hidden) {
    styles.display = 'none';
  }
  if (field.style) {
    styles = {
      ...styles,
      ...field.style,
    };
  }

  if (field.type === 'checkboxGroup') {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  if (field.type === 'image') {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  if (field.simple) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
  }

  if (field.simpleHalf) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 10,
      },
    };
  }

  if (field.simpleList) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
  }

  if (field.className === 'title') {
    colSpan = 24;
    formItemLayout = {
    };
  }

  let className = (field.className && `${field.className}-form-item`) || '';
  if (!field.label) {
    className += ' item-no-required';
  }

  let children;
  if (field.type === 'title') {
    children = (<Col span={24} key={field.label} style={styles}>
      <div className={`ant-form-title ${className}`}>
        {typeof field.label === 'object' ? field.label : `${field.label}`}
      </div>
    </Col>);
  } else if (field.type === 'custom') {
    children = field.children;
  }

  return (
    field.type === 'title'
      ? children
      : <Col span={colSpan} key={field.name}>
        <FormItem
          {...formItemLayout}
          label={field.type === 'checkboxGroup' ? '' : (field.label || ' ')}
          className={className}
          style={styles}
          colon={!!field.label}
          extra={field.extra}
        >
          {
            form.getFieldDecorator(field.name, {
              valuePropName: field.type === 'switch' ? 'checked' : 'value',
              rules,
              initialValue: field.initialValue || field.value,
            })(geneBox(field, inputOpts))
          }
        </FormItem>
      </Col>
  );
};
