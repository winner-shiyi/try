import React from 'react';
import {
  Form,
  Input,
  Modal,
  Row,
  Button,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { createFormItem } from '../../components';


const FormItem = Form.Item;

const ModalForm = Form.create({
  mapPropsToFields(props) {
    const res = {};
    const keys = Object.keys(props.values || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const param = props.values[i];
      if (typeof param === 'object' && !(param instanceof Array)) {
        res[key] = param;
      } else {
        res[key] = { value: param };
      }
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
})(
  (props) => {
    const {
      visible,
      onCancel,
      onCreate,
      title,
      fields,
      form,
      formWidth,
      cusTitle,
      confirmLoading } = props;
    const { getFieldDecorator, validateFields } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const save = () => {
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          onCreate(values);
        }
      });
    };

    const isEdit = () => !!(props.values && props.values.id);

    const geneForm = (fieldsTemp) => (
      <Scrollbars
        autoHeight
        autoHeightMin={100}
        autoHeightMax={550}
      >
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
        </Form>
      </Scrollbars>
    );

    return (
      <Modal
        width={formWidth || 1000}
        visible={visible}
        title={cusTitle || ((isEdit() ? '修改' : '新增') + title)}
        okText="保存"
        onCancel={onCancel}
        onOk={save}
        maskClosable={false}
        footer={[
          <Button key="submit" size="large" type="primary" onClick={save} loading={confirmLoading}>
            保存
          </Button>,
          <Button size="large" key="back" onClick={onCancel}>取消</Button>,
        ]}
      >
        {geneForm(fields)}
      </Modal>
    );
  }
);
export default ModalForm;
