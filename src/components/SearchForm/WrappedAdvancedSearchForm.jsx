import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import { createFormItem, mapPropsToFields, onFieldsChange } from '../../components';
import './SearchForm.scss';

const FormItem = Form.Item;

class AdvancedSearchForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    search: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      expand: document.body.clientWidth > 768,
    };

    this.responsiveHandler = ((e) => {
      if (e.matches) {
        this.setState({
          expand: false,
        });
      } else {
        this.setState({
          expand: true,
        });
      }
    });
  }

  componentDidMount() {
    this.getValues((value) => {
      this.props.initSearchParams && this.props.initSearchParams(value);
    });
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.responsiveHandler);
  }

  componentWillUnmount() {
    this.mql && this.mql.removeListener(this.responsiveHandler);
  }

  getValues(callback) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const res = {};
        const {
          fields,
        } = this.props;

        const keys = Object.keys(values || {});
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          const field = fields.find((value) =>
            (value.name || value.dataIndex) === key
          );
          switch (field.type) {
            case 'dateRange':
              res[`${key}Start`] = values[key] && values[key].length !== 0 && values[key][0].format
                ? values[key][0].format('YYYY-MM-DD 00:00:00') : values[key] && values[key][0];
              res[`${key}End`] = values[key] && values[key].length !== 0 && values[key][1].format
                ? values[key][1].format('YYYY-MM-DD 23:59:59') : values[key] && values[key][1];
              break;
            case 'dateTimeRange':
              res[`${key}Start`] = values[key] && values[key].length !== 0 && values[key][0].format
                ? values[key][0].format('YYYY-MM-DD HH:mm:ss') : values[key] && values[key][0];
              res[`${key}End`] = values[key] && values[key].length !== 0 && values[key][1].format
                ? values[key][1].format('YYYY-MM-DD HH:mm:ss') : values[key] && values[key][1];
              break;
            case 'monthRange':
              res[`${key}Start`] = values[key] && values[key].length !== 0 && values[key][0].format
                ? values[key][0].format('YYYY-MM-DD') : values[key] && values[key][0];
              res[`${key}End`] = values[key] && values[key].length !== 0 && values[key][1].format
                ? values[key][1].format('YYYY-MM-DD') : values[key] && values[key][1];
              break;
            case 'twodateRange':
              res[`${key}Start`] =
                values[key] && values[key].length !== 0 && values[key][0] && values[key][0].format
                  ? values[key][0].format('YYYY-MM-DD 00:00:00') : (values[key] && values[key][0]) || '';
              res[`${key}End`] = values[key] && values[key].length !== 0 && values[key][1] && values[key][1].format
                ? values[key][1].format('YYYY-MM-DD 23:59:59') : (values[key] && values[key][1]) || '';
              break;
            case 'date':
              res[key] = values[key] && values[key].format ? values[key].format('YYYY-MM-DD') : values[key];
              break;
            case 'dateTime':
              res[key] = values[key] && values[key].format ? values[key].format('YYYY-MM-DD HH:mm:ss') : values[key];
              break;
            case 'month':
              res[key] = values[key] && values[key].format ? values[key].format('YYYY-MM-01') : values[key];
              break;
            default:
              res[key] = values[key];
          }
        }
        callback(res);
      }
    });
  }

  handleSearch = () => {
    this.getValues((values) => {
      const pageSize = (this.props.page && this.props.page.pageSize) || '10';
      this.props.search && this.props.search({
        ...values,
        pageNo: '1',
        pageSize,
      });
    });
  }

  handleReset = () => {
    if (this.props.reset) {
      this.props.reset(); // 如果没有走清空搜索字段的action的话
    } else {
      this.props.form.resetFields(); // antd 自带的清空搜索字段方法
    }
  }

  render() {
    const {
      fields,
    } = this.props;

    const {
      expand,
    } = this.state;

    // To generate mock Form.Item
    const children = [];
    const len = fields.length;
    const labelCol = expand ? 7 : 4;
    const wrapperCol = expand ? 17 : 20;
    for (let i = 0; i < len; i += 1) {
      children.push(
        createFormItem({
          field: fields[i],
          form: this.props.form,
          formItemLayout: {
            labelCol: { span: fields[i].large ? 2 : labelCol },
            wrapperCol: { span: fields[i].large ? 22 : wrapperCol },
          },
          inputOpts: {
          },
          colSpan: !expand || fields[i].large ? 24 : 8,
        })
      );
    }

    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row gutter={20}>
          {children}
        </Row>
        <Row gutter={20}>
          <Col span={8} style={{ textAlign: 'left' }}>
            <FormItem wrapperCol={{ span: 17, offset: 7 }}>
              <Button type="primary" onClick={this.handleSearch} style={{ width: 195 }}>搜索</Button>
              {
                fields.length > 1 &&
                <Button style={{ marginLeft: 8, color: '#ff9500', border: 'none' }} onClick={this.handleReset}>
                  重置
                </Button>
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})(AdvancedSearchForm);

export default WrappedAdvancedSearchForm;
