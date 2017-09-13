import React, { Component } from 'react';
import { Upload, Modal, Icon, Button, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import { getBaseUrl } from '../../util';

class ImagePicker extends Component {
  static propTypes = {
    value: PropTypes.string,
    disabled: PropTypes.bool,
    closeable: PropTypes.bool,
  }

  static defaultProps = {
    value: undefined,
    disabled: false,
    closeable: true,
  }

  constructor(props) {
    super(props);
    const value = props.value;
    this.state = {
      value,
      coverfix: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || undefined;
      this.setState(Object.assign({}, this.state, {
        value,
      }));
    }
  }

  onClose(e) {
    e.stopPropagation();
    this.props.onClose(this.props.sequence);
  }

  onPreview(e) {
    e.stopPropagation();
    this.setState(Object.assign({}, this.state, {
      previewVisible: true,
    }));
  }

  onPicCancel() {
    this.setState(Object.assign({}, this.state, {
      previewVisible: false,
    }));
  }

  onImgLoad(e) {
    const img = e.target;
    let coverfix = '';
    if ((img.naturalHeight > img.naturalWidth) || (img.height > img.width)) {
      coverfix = 'img-coverfix';
    } else {
      coverfix = '';
    }
    this.setState(Object.assign({}, this.state, {
      coverfix,
    }));
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState(Object.assign({}, this.state, {
        loading: true,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        loading: false,
      }));
    }
    if (info.file.status === 'done') {
      if (info.file.response.resultCode !== '0000') {
        message.error(info.file.response.resultDesc);
      }
      const value = info.file.response.resultData.result;
      this.setState(Object.assign({}, this.state, {
        value,
      }));
      this.props.onChange({
        key: this.props.sequence,
        value,
      });
    }
  }

  render() {
    const { previewVisible, loading = false } = this.state;
    const {
      disabled,
    } = this.props;

    function beforeUpload(file) {
      const isImg = /image.*/.test(file.type);
      if (!isImg) {
        message.error('只能上传图片');
      }
      return isImg;
    }

    return (
      <div className="flex flex-v">
        <Upload
          className="avatar-uploader"
          action={`${getBaseUrl()}/pic/upload`}
          beforeUpload={beforeUpload}
          headers={{
            Authorization: `bearer ${sessionStorage.getItem('accessToken')}`,
          }}
          onChange={this.handleChange}
          showUploadList={false}
          disabled={disabled}
        >
          {
            <Spin spinning={loading}>
              <div className={`img-wrapper ${this.state.coverfix}`}>
                {
                  this.state.value
                    ? <img src={this.state.value} alt="" onLoad={this.onImgLoad.bind(this)} />
                    : <Icon type="plus" />
                }
              </div>
            </Spin>
          }
          {
            this.state.value &&
            <Button shape="circle" icon="eye-o" className="ant-upload-preview" onClick={this.onPreview.bind(this)} />
          }
          {
            !disabled && this.props.closeable &&
            <Button shape="circle" icon="close" className="ant-upload-close" onClick={this.onClose.bind(this)} />
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.onPicCancel.bind(this)}>
          <img alt="" style={{ width: '100%' }} src={this.state.value} />
        </Modal>
      </div>
    );
  }
}

export default ImagePicker;
