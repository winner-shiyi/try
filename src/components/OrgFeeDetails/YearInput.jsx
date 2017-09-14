import React, { Component } from 'react';
import { Input, Button, Form } from 'antd';

const FormItem = Form.Item;

class YearInputTemp extends Component {
  // hasErrors(fieldsError) {
  //   return Object.keys(fieldsError).some((field) => fieldsError[field]);
  // }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values && values.year && this.props.seachYearData(values.year);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;
    const yearError = isFieldTouched('year') && getFieldError('year');

    return (
      <Form layout="inline" onSubmit={this.handleSearch} hideRequiredMark style={{ margin: '16px 0' }}>
        <FormItem
          label="查看时间"
          validateStatus={yearError ? 'error' : ''}
          help={yearError || ''}
        >
          {getFieldDecorator('year', {
            rules: [
              { pattern: /^20[1][01234567]$/, message: '请输入有效的年份 ' },
            ],
          })(
            <Input placeholder="请输入年份，如：2017" />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            size="default"
          >
            查询
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const YearInput = Form.create()(YearInputTemp);

export default YearInput;
