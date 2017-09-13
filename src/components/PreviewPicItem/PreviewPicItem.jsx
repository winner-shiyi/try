import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './PreviewPicItem.scss';

class PreviewPic extends Component {
  render() {
    const {
      imagrUrlArr,
      id,
    } = this.props;
    return (
      <div
        role="presentation"
        className="previewPic-component-item" 
        onClick={this.props.onClick.bind(this, imagrUrlArr, id)}
        style={{ width:`${this.props.width}px`, height:`${this.props.height}px` }}
      >
        <div className="previewPic-component-info" >
          <img src={this.props.src} alt={this.props.alt} width={this.props.width} height={this.props.height} />
        </div>
        <span className="previewPic-component-actions">
          <Icon type="eye-o" style={{ fontSize: 16, color: '#fff' }} /></span>
      </div>
    );
  }
}
export default PreviewPic;

