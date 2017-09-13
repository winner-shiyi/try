import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

const Option = Select.Option;

export default class CommonSelect extends Component {
  static propTypes = {
    // value: PropTypes.oneOfType([
    //   PropTypes.string,
    //   PropTypes.array,
    // ]),
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    page: PropTypes.object,
    action: PropTypes.func,
    onSelect: PropTypes.func,
    data: PropTypes.array,
    state: PropTypes.object,
    style: PropTypes.object,
    valueName: PropTypes.string,
    displayName: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    filterOption: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    showSearch: PropTypes.bool,
    optionFilterProp: PropTypes.string,
    allowClear: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    const value = typeof props.value === 'number' ? props.value
      : (props.value || (props.multiple ? [] : undefined));
    this.state = {
      value,
      page: props.page || undefined,
    };
    // this.props.form.resetFields([this.props.name])

    // props.state && this.search()
    // props.action && props.action({
    //   pageNo: props.page.pageNo || 1,
    //   pageSize: props.page.pageSize || 10,
    // }).then((res) => {
    //   this.setState({
    //     ...this.state,
    //     page: {
    //       ...this.state.page,
    //       pageNo: res.data.pageNo,
    //       pageSize: res.data.pageSize,
    //       count: res.data.count,
    //     },
    //   })
    // })
  }

  componentWillMount() {
    const props = this.props;
    props.state && this.search();
  }

  componentDidMount() {
    const {
      action,
    } = this.props;

    if (this.state.page) {
      /* eslint-disable react/no-find-dom-node */
      const dom = findDOMNode(this);
      dom.addEventListener('click', () => {
        // find the child dropdown dom
        setTimeout(() => {
          const menus = document.querySelectorAll('.ant-select-dropdown-menu');
          this.dropdownMenuDom = menus[menus.length - 1];
          this.dropdownMenuDom.addEventListener('scroll', () => {
            const sh = this.dropdownMenuDom.scrollHeight;
            const oh = this.dropdownMenuDom.offsetHeight;
            const st = this.dropdownMenuDom.scrollTop;
            const {
              page,
            } = this.state;
            if (st + oh >= sh && !page.loading && (page.count ? (page.pageNo * page.pageSize < page.count) : true)) {
              action && action({
                pageNo: (+page.pageNo || 1) + 1,
                pageSize: page.pageSize || 10,
              }).then((res) => {
                this.setState({
                  ...this.state,
                  page: {
                    ...this.state.page,
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    count: res.data.count,
                  },
                });
              });
            }

            // show 'all'
            if (page.count && (page.pageNo * page.pageSize >= page.count) && !this.state.page.all) {
              this.setState({
                ...this.state,
                page: {
                  ...this.state.page,
                  all: true,
                },
              });
            }
          }, false);
        }, 100);

        // if no data, fetch the first page data, only page available
        const data = this.props.page.data;
        if (!data || (data && data.length === 0)) {
          action && action({
            pageNo: 1,
            pageSize: 10,
          }).then((res) => {
            this.setState({
              ...this.state,
              page: {
                ...this.state.page,
                pageNo: res.data.pageNo,
                pageSize: res.data.pageSize,
                count: res.data.count,
              },
            });
          });
        }
      }, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = typeof nextProps.value === 'number' ? nextProps.value
        : (nextProps.value || (this.props.multiple ? [] : undefined));
      // let data = nextProps.state && nextProps.state.data || nextProps.data || []
      // if (data && data.length === 0) {
      //   value = undefined
      //   nextProps.value = undefined
      // }
      this.setState({
        ...this.state,
        value,
        page: {
          ...this.state.page,
          ...nextProps.page,
        },
      });
    }
  }

  onChange(value) {
    this.props.onChange && this.props.onChange(value);
    this.props.onSelect && 
    this.props.onSelect(value, this.props.data.find((item) => item[this.props.valueName || 'id'] === value));
  }

  dropdownMenuDom

  timer;
  lastFetchId = 0;

  search(value) {
    const action = this.props.action || this.props.state.action;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      this.props.state.lastFetch += 1;
      action && action(value, {
        component: this,
      });
      // promise && promise.then && promise.then(() => {
      //   me.props.form.resetFields([me.props.name])
      // })
    }, 300);
  }

  render() {
    let {
      data = [],
    } = this.props;

    const {
      state,
      multiple,
      placeholder,
      disabled,
      valueName,
      displayName,
      filterOption,
      showSearch,
      optionFilterProp,
      allowClear = true,
      page,
    } = this.props;

    let options;

    if (page) {
      data = page.data;
    }

    if (state) {
      options = state.data.map(
        (item) => <Option key={item[valueName || 'id'] || item.value}>{item[displayName || 'label']}</Option>
      );
    } else {
      options = data.map((item) => {
        if (Object.prototype.toString.call(item) === '[object Array]') {
          return <Option key={item[0]}>{item[1]}</Option>;
        } 
        return <Option key={`${item[valueName || 'id'] || item.value}`}>{item[displayName || 'label']}</Option>;
      });
    }

    if (page && this.state.page.all) {
      options.push(<Option disabled key="_selectIsAll">{'已加载全部'}</Option>);
    }

    if (page && page.loading) {
      options.push(<Option disabled key="_selectLoading"><Spin size="small" /></Option>);
    }

    return (
      <Select
        showSearch={showSearch}
        filterOption={filterOption}
        allowClear={allowClear}
        optionFilterProp={optionFilterProp || 'children'}
        mode={multiple ? 'multiple' : ''}
        value={typeof this.state.value === 'number' ? (`${this.state.value}`) : this.state.value}
        style={this.props.style}
        notFoundContent={state && state.loading ? <Spin size="small" /> : '无匹配结果'}
        onSearch={state && this.search.bind(this)}
        onChange={this.onChange.bind(this)}
        placeholder={placeholder}
        disabled={disabled}
      >
        {options}
      </Select>
    );
  }
}
