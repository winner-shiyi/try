import React, { Component } from 'react';
import { Modal } from 'antd';
import PreviewPicItem from '../PreviewPicItem';

class PreviewPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (imagrUrlArr, index) => {
    this.setState({
      previewImage: imagrUrlArr[index],
      previewVisible: true,
    });
  }
  render() {
    const {
      imagrUrlArr,
      width,
      height,
    } = this.props;

    const { previewVisible, previewImage } = this.state;
    return (
      <div className="previewPic-component">
        <div className="imgae-box clearfix">
          {
            imagrUrlArr.map((item, index) => {
              const imgAlt = `图片备注${index}`;
              const key = `img-s${index}`;
              return (<PreviewPicItem 
                src={item} 
                alt={imgAlt} 
                width={width} 
                height={height} 
                key={key}
                onClick={this.handlePreview}
                id={index}
                imagrUrlArr={imagrUrlArr}
              />);
            })
          }
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={700}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PreviewPic;

