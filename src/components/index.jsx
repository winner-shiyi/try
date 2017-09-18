import React from 'react';
import {
  Input,
  Form,
  DatePicker,
  Col,
  Cascader,
  Checkbox,
  Radio,
} from 'antd';
import CommonSelect from './Select';
import CommonCheckboxGroup from './CheckboxGroup';
import ImagePicker from './ImagePicker';
import CommonDatePicker from './DatePicker';
import MonthPicker from './MonthPicker';
import MonthRange from './MonthRange';
import AutoComplete from './Input';
import InputNumber from './Number';
import NumberRange from './NumberRange';
import DateRange from './DateRange';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const { RangePicker } = DatePicker;

export const geneBox = (field, opts = {}) => {
  const newField = field;
  if (field.dataIndex) {
    newField.name = field.dataIndex;
  }
  if (field.title) {
    newField.label = field.title;
  }

  // deal with placeholder
  const phMap = {
    date: '请选择日期',
    address: '请选择地址',
    datetime: '请选择时间',
    dateRange: ['请选择开始日期', '请选择结束日期'],
    month: '请选择月份',
    datetimeRange: ['请选择开始时间', '请选择结束时间'],
    monthRange: ['请选择开始月份', '请选择结束月份'],
    select: `请选择${field.label}`,
  };
  let placeholder = field.placeholder || phMap[field.type] || `请输入${field.label}`;
  placeholder = field.disabled ? '-' : placeholder;

  // combine with options from outside
  const defaultOpts = {
    size: 'default',
    ...opts,
    disabled: newField.disabled,
    name: newField.name,
    label: newField.label,
    placeholder,
  };

  switch (newField.type) {
    case 'twodateRange':
      return (
        <DateRange
          {...defaultOpts}
        />
      );
    case 'date':
      return (
        <CommonDatePicker
          {...defaultOpts}
          format="YYYY-MM-DD"
          onChange={newField.onChange}
          disabledDate={newField.disabledDate}
        />
      );
    case 'Cascader':
    case 'address':
      return (
        <Cascader
          {...defaultOpts}
          options={newField.data}
          changeOnSelect={!!newField.changeOnSelect}
          onChange={newField.onChange}
        />
      );
    case 'datetime':
      return (
        <CommonDatePicker
          {...defaultOpts}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
        />
      );
    case 'dateRange':
      return (
        <RangePicker
          {...defaultOpts}
          format="YYYY-MM-DD"
        />
      );
    case 'month':
      return (
        <MonthPicker
          {...defaultOpts}
        />
      );
    case 'datetimeRange':
      return (
        <RangePicker
          {...defaultOpts}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
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
          action={newField.action}
          data={newField.data}
          multiple={newField.multiple}
          valueName={newField.valueName}
          displayName={newField.displayName}
          onChange={newField.onChange}
          onSelect={newField.onSelect}
          showSearch={newField.showSearch}
          allowClear={!newField.required}
          page={newField.page}
        />
      );
    // case 'editor':
    //   return (
    //     <Editor
    //       placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
    //     />
    //   )
    case 'checkboxGroup':
      return (
        <CommonCheckboxGroup
          {...defaultOpts}
          label={newField.label}
          options={newField.options}
        />
      );
    case 'checkbox':
      return (
        <CheckboxGroup
          {...defaultOpts}
        />
      );
    case 'image':
      return (
        <ImagePicker
          {...defaultOpts}
          data={newField.data}
          tokenSeparators={newField.tokenSeparators}
        />
      );
    case 'password':
      return (
        <Input
          type="password"
          {...defaultOpts}
        />
      );
    case 'number':
      return (
        <InputNumber
          {...defaultOpts}
          max={newField.max || 1000000000000000} // 16 or 99...
          min={typeof newField.min === 'number' ? newField.min : undefined}
          money={newField.money}
        />
      );
    case 'textarea':
      return (
        <Input
          type="textarea"
          {...defaultOpts}
          autosize={newField.disabled ? true : { minRows: 2, maxRows: 6 }}
          onChange={field.onChange}
        />
      );
    case 'radio':
      return (
        <Radio.Group
          onChange={newField.onChange}
        >
          {
            newField.data.map((item) => <Radio value={item[0]} key={item[0]}>{item[1]}</Radio>)
          }

        </Radio.Group>
      );
    case 'numberRange':
      return (
        <NumberRange
          {...defaultOpts}
          startMin={newField.startMin}
          endMin={newField.endMin}
          startMax={newField.startMax}
          endMax={newField.endMax}
        />
      );
    default:
      return (
        <AutoComplete
          {...defaultOpts}
          allowClear
          buttonText={newField.buttonText}
          buttonClick={newField.buttonClick}
          dataSource={newField.dataSource}
          onChange={newField.onChange}
          onSelect={newField.onSelect}
          onFocus={newField.onFocus}
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
  inputOpts.form = form;
  if (field.dataIndex) {
    field.name = field.dataIndex;
  }
  if (field.title) {
    field.label = field.title;
  }
  if (!field.max && !field.type) {
    field.max = 120;
  }
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
      if (field.type === 'IDPhotoGroup' || field.type === 'image') {
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
      rules.push({
        max: field.max,
        message: `${msgLabel}必须小于${field.max}个字符`,
        transform: (v) => {
          let newV = v;
          if (typeof newV === 'number') {
            newV += '';
          }
          return newV;
        },
      });
    } else if (field.max && field.type === 'number') {
      rules.push({ validator: (rule, value, callback) => {
        if (value && field.max < +value) {
          callback(`${msgLabel}不能大于${field.max}`);
        }
        callback();
      } });
    }
    if (field.min && field.type !== 'number') {
      rules.push({
        min: field.min,
        message: `${msgLabel}必须大于${field.min}个字符`,
        transform: (v) => {
          let newV = v;
          if (typeof newV === 'number') {
            newV += '';
          }
          return newV;
        },
      });
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

  if (field.type === 'IDPhotoGroup' || field.type === 'image') {
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
  if (field.simpleList) { // 车配任务详情页需要的配置
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
              rules,
              initialValue: field.initialValue,
            })(geneBox(field, inputOpts))
          }
        </FormItem>
      </Col>
  );
};

// makesure the props.values
export const mapPropsToFields = (props = {}) => {
  let res = {};
  const keys = Object.keys(props.values || {});
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = props.values[key];
    if (typeof param === 'object' && !(param instanceof Array)) {
      res[key] = param;
    } else {
      res[key] = { value: param };
    }
  }
  if (props.mapFields) {
    res = {
      ...res,
      ...props.mapFields(res),
    };
  }
  return res;
};

// makesure the props.changeRecord
export const onFieldsChange = (props, flds) => {
  const fields = flds;
  const keys = Object.keys(fields || {});
  const findFun = (name) => {
    const newName = name;
    return (item) => item.name === newName;
  };
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const fld = props.fields.find(findFun(fields[key]));
    fields[key].type = fld && fld.type;
  }
  props.changeRecord && props.changeRecord({
    ...props.values,
    ...fields,
  });
};
