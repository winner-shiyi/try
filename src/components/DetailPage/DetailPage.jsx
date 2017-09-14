import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Spin } from 'antd';
import { createFormItem } from '../../components';

const FormItem = Form.Item;

class DetailPage extends Component {
  static propTypes = {
  }

  render() {
    const {
      title,
      fields = [],
      form,
      loading = false,
      buttons = [],
      children = [],
    } = this.props;
    const butt = buttons.map((item, index) => {
      const key = `button${index}`;
      const { hidden } = item;
      if (!hidden) {
        return (
          <Button
            style={item.style}
            key={key}
            type={item.type || 'primary'}
            onClick={(item.handleForm || item.onClick).bind(this, form)}
            disabled={item.disabled}
            loading={item.loading}
          >
            { item.label }
          </Button>
        );
      }
      return false;
    });
    const formItemLayout = ({
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    });

    const { getFieldDecorator } = form;

    const geneForm = (fieldsTemp) => (
      <Spin spinning={loading}>
        <Form layout="horizontal">
          <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('id', {
            })(
              <Input type="hidden" />
            )}
          </FormItem>
          <Row>
            {
              fieldsTemp.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  formItemLayout,
                  inputOpts: {
                  },
                })
              ))
            }
          </Row>
          <FormItem style={{ textAlign: 'center' }}>
            { butt }
          </FormItem>
        </Form>
      </Spin>
    );
    return (
      <div className="layout-content-detail">
        {
          title &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
          </Row>
        }
        {geneForm(fields)}
        {
          children
        }
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    let res = {};
    const keys = Object.keys(props.values || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const param = props.values[key];
      if (typeof param === 'object' && 'value' in param) {
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
  },
  onFieldsChange(props, fieldsTemp) {
    const fields = fieldsTemp;
    const keys = Object.keys(fields || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const fld = props.fields.find((item) => item.name === fields[key].name);
      fields[key].type = fld && fld.type;
    }
    props.changeRecord && props.changeRecord({
      ...props.values,
      ...fields,
    });
  },
})(DetailPage);

