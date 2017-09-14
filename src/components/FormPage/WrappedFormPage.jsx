import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Form, Row, Col, Button, Icon } from 'antd';
import { browserHistory } from 'react-router';
import SendForm from '../SendForm';
import ReceiverForm from '../ReceiverForm';
import './FormPage.scss';

const FormItem = Form.Item;

class FormPage extends Component {
  static propTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool,
    newSenderInfos: PropTypes.array,
    receiverFields: PropTypes.array.isRequired,
    reduceReceiverInfo: PropTypes.func,
    senderSearch: PropTypes.func,
    changeRecord: PropTypes.func,
    form: PropTypes.object,
    values: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      createType: 1,
    };
  }
  /**
   * 判断是否为空对象
   */
  isEmptyObject = (obj) => (Object.keys(obj).length === 0)
  /**
   * 添加收货地址
   */
  add() {
    this.props.addReceiverInfo();
  }
  /**
   * 点击【保存草稿】
   */
  handleSaveClick = () => {
    this.setState({
      createType: 2,
    });
  }
  /**
   * 提交表单
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 需要转换成 { senderInfo: {}, receiversInfoList: [{}, {}] }这种格式提交
        const senderInfo = {};
        const receiversInfoList = [];
        const receiversInfoListObj = {};
        let mw = {}; // 存放收货信息的adcode 和 经纬度信息
        let timeCompareLock = true; // 时间比较变量锁

        Object.keys(values).forEach((key) => {
          const k = Number(key.split('-')[1]);
          const name = key.split('-')[0];
          const curValue = values[key];

          if (isNaN(k)) {
            senderInfo[key] = curValue;
            if (key === 'region') {
              senderInfo.province = senderInfo[key][0];
              senderInfo.city = senderInfo[key][1];
              senderInfo.area = senderInfo[key][2];
            }
            Object.assign(senderInfo, window.mapInfosToWindow);
            delete senderInfo.region;
            if (key === 'drivingTime') {
              senderInfo[key] = new Date(senderInfo[key]).getTime(); // 转换成毫秒数
            }
          } else {
            if (!receiversInfoListObj[k]) {
              receiversInfoListObj[k] = {};
            }
            receiversInfoListObj[k][name] = curValue;
            // 把省市区数组转成 对应字符串
            if (name === 'region') {
              receiversInfoListObj[k].province = values[key][0];
              receiversInfoListObj[k].city = values[key][1];
              receiversInfoListObj[k].area = values[key][2];
            }
            // 从window上获取地图保存信息
            mw = window[`${k}mapInfosToWindow`];
            Object.assign(receiversInfoListObj[k], mw);
            delete receiversInfoListObj[k].region;
            if (name === 'deliveryBeginTime') {
              receiversInfoListObj[k].deliveryBeginTime =
              new Date(receiversInfoListObj[k].deliveryBeginTime).getTime();
            }
            if (name === 'deliveryEndTime') {
              receiversInfoListObj[k].deliveryEndTime =
              new Date(receiversInfoListObj[k].deliveryEndTime).getTime();
            }
            if (receiversInfoListObj[k].deliveryEndTime !== 0 && // 等于0的情况是，选择具体时间后又清空
              receiversInfoListObj[k].deliveryEndTime < receiversInfoListObj[k].deliveryBeginTime) {
              timeCompareLock = false;
            }
          }
        });
        Object.keys(receiversInfoListObj).forEach((key) => {
          receiversInfoList.push(receiversInfoListObj[key]);
        });
        // 如果输入的是无效地址，弹窗提示并且return禁止提交表单
        if (this.isEmptyObject(window.mapInfosToWindow) || this.isEmptyObject(mw)) {
          message.error('亲，请输入正确有效的地址哦~');
          return;
        }
        // 送达起始时间不能大于结束时间
        if (!timeCompareLock) {
          message.error('送达起始时间不能大于送达结束时间哦~');
          return;
        }
        this.props.submit({
          createType: this.state.createType,
          orderNo: this.props.params.id || '',
          senderInfo,
          receiversInfoList,
        }).then((isSuccess) => {
          this.props.clearData();
          isSuccess && this.handleGo(); // 跳转到列表页
        });
      }
    });
  }
  /**
   * 提交成功后路由跳转
   */
  handleGo = () => {
    browserHistory.push('/Manage/Distribution');
  }

  render() {
    const {
      form,
      title,
      receiverFields,
      reduceReceiverInfo,
      values, // 就是保存表单中填写的数据,
      senderSearch,
      newSenderInfos,
      changeRecord,
      getActiveId,
      receiverSearch,
      newReceiverInfos,
      clearErrors,
    } = this.props;
    return (
      <div style={{ padding: 16, flex: '1 1 auto' }}>
        {
          (title) &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
          </Row>
        }
        <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <h2 className="ant-page-title">
                发货信息
              </h2>
            </Col>
          </Row>
          <SendForm
            form={form}
            values={values}
            changeRecord={changeRecord}
            senderSearch={senderSearch}
            newSenderInfos={newSenderInfos}
            getActiveId={getActiveId}
            clearErrors={clearErrors}
          />
          <Row>
            <Col>
              <h2 className="ant-page-title">
                收货信息
              </h2>
            </Col>
          </Row>
          <ul>
            {
              receiverFields.length && receiverFields.map((item, index) => {
                const AmapId = `mapContainessrGet${index}`;
                // const key = `receiverField${index}`; 调很久的大坑，牢记
                const key = `receiverField${item.id}`;
                return (<ReceiverForm
                  form={form}
                  key={key}
                  id={item.id}
                  fields={item.fields}
                  AmapId={AmapId}
                  length={this.props.receiverFields.length}
                  reduceReceiverInfo={reduceReceiverInfo}
                  values={values}
                  changeRecord={changeRecord}
                  receiverSearch={receiverSearch}
                  newReceiverInfos={newReceiverInfos}
                  getActiveId={getActiveId}
                  clearErrors={clearErrors}
                />);
              })
            }
          </ul>
          <FormItem className="AddDistribution-btn-formItem">
            <Button type="dashed" onClick={this.add.bind(this)} className="add-form-button">
              <Icon type="plus" /> 添加收货地址
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.props.loading}
            >提交
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="save-form-button"
              loading={this.props.loading}
              onClick={this.handleSaveClick}
            >保存草稿
            </Button>
          </FormItem>
        </Form>
        {/* <Row><BackTop>111</BackTop></Row> */}
      </div>
    );
  }
}
const WrappedFormPage = Form.create({
  mapPropsToFields(props) {
    let res = {};
    const keys = Object.keys(props.values || {});
    for (let i = 0; i < keys.length; i += 1) { // props.values 拿到的就是上面传下来的【保存填写的表单数据】
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
  onFieldsChange(props, flds) {
    const fields = flds;
    const keys = Object.keys(fields || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      let fld = null;
      props.receiverFields && props.receiverFields.forEach((receiverField) => {
        fld = receiverField.fields.find((item) => item.name === fields[key].name);
      });
      fields[key].type = fld && fld.type;
    }
    props.changeRecord && props.changeRecord({ // 从上面拿到的【表单数据更新的函数】
      ...props.values,
      ...fields,
    });
  },
})(FormPage);
export default WrappedFormPage;

