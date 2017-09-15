import React from 'react';
import {
  Form,
  Input,
  Modal,
  Row,
  Button,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { createFormItem, mapPropsToFields, onFieldsChange } from '../../components';


const FormItem = Form.Item;

const ModalForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
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
