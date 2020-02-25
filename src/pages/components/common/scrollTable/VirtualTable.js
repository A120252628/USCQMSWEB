import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Table } from 'antd'
import throttle from 'lodash.throttle'

class VirtualTable extends Component {
  static FillNode({ height, node, marginTop, marginBottom }) {
    if (node) {
      marginTop = marginTop || 0
      marginBottom = marginBottom || 0
      height = height || 0
      return ReactDOM.createPortal(
        <div style={{ height: `${height}px`, marginTop: `${marginTop}px`, marginBottom: `${marginBottom}px` }} />,
        node
      )
    }
    return null
  }
  constructor(props) {
    super(props)
    this.state = {
      startIndex: 0,
      visibleRowCount: 0,
      thresholdCount: 40,
      rowHeight: 30,
      topBlankHeight: 0,
      bottomBlankHeight: 0,
      maxTotalHeight: 15000000,
      preiveLeft: 0
    }
  }

  componentDidMount() {
    this.refScroll = ReactDOM.findDOMNode(this).getElementsByClassName('ant-table-body')[0]
    this.listenEvent = throttle(this.handleScrollEvent, 50)

    if (this.refScroll) {
      this.refScroll.addEventListener('scroll', this.listenEvent)
      const { height } = this.props
      this.refScroll.style.height = `${height}px`
    }

    this.createTopFillNode()
    this.createBottomFillNode()
    // 初始化设置滚动条
    this.setRowHeight()
    this.handleScrollEvent()
  }

  componentDidUpdate(preProps) {
    const { dataSource, scroll, height } = this.props
    const { dataSource: tdataSource, scroll: tScroll, height: theight } = preProps
    if (
      dataSource !== tdataSource ||
      dataSource.length !== tdataSource.length ||
      scroll !== tScroll ||
      (scroll && tScroll && scroll.y !== tScroll.y) ||
      height !== theight
    ) {
      this.refScroll.style.height = `${height}px`
      this.handleScroll(dataSource.length, scroll.y)
    }
  }

  componentWillUnmount() {
    if (this.refScroll) {
      this.refScroll.removeEventListener('scroll', this.listenEvent)
    }
  }

  createTopFillNode() {
    if (this.refScroll) {
      const ele = document.createElement('div')
      this.refScroll.insertBefore(ele, this.refScroll.firstChild)
      this.refTopNode = ele
    }
  }

  createBottomFillNode() {
    if (this.refScroll) {
      const ele = document.createElement('div')
      this.refScroll.appendChild(ele)
      this.refBottomNode = ele
    }
  }

  setRowHeight() {
    this.refTable = this.refScroll.getElementsByClassName('ant-table-body')[0]
    if (this.refTable) {
      const tr = this.refTable.getElementsByTagName('tr')[0]
      const rowHeight = (tr && tr.clientHeight) || 0
      this.setState({ rowHeight })
    }
  }

  handleScrollEvent = () => {
    const { dataSource, scroll } = this.props
    this.handleScroll((dataSource || []).length, scroll.y)
  }

  handleScroll = (length, scrollY) => {
    const { rowHeight, maxTotalHeight } = this.state
    if (rowHeight && length) {
      const visibleHeight = scrollY ? scrollY : this.refScroll.clientHeight // 显示的高度
      let { scrollTop, scrollLeft } = this.refScroll
      if (scrollLeft !== this.state.preiveLeft) {
        this.setState({
          preiveLeft: scrollLeft
        })
      } else {
        let totalHeight = length * rowHeight
        const maxTop = totalHeight - visibleHeight
        scrollTop = scrollTop > maxTop ? maxTop : scrollTop
        if (this.scrollTop !== scrollTop || this.scrollY !== scrollY) {
          this.handleBlankHeight(length, rowHeight, maxTotalHeight, visibleHeight, scrollTop)
          this.scrollTop = scrollTop
          this.scrollY = scrollY
        }
      }
    } else {
      this.setRowHeight()
    }
  }

  getIndexByScrollTop(rowHeight, scrollTop) {
    const index = (scrollTop - (scrollTop % rowHeight)) / rowHeight
    return index
  }

  // 滚动加载节流
  throttle(fn, delay) {
    let valid = true
    return function() {
      if (!valid) {
        return false
      }
      valid = false
      setTimeout(() => {
        fn()
        valid = true
      }, delay)
    }
  }

  handleBlankHeight(length, rowHeight, maxTotalHeight, visibleHeight, scrollTop) {
    let oriRowHeight = rowHeight
    let totalHeight = length * rowHeight
    let isBigData = false
    if (totalHeight > maxTotalHeight) {
      isBigData = true
      totalHeight = maxTotalHeight
      rowHeight = totalHeight / length
      scrollTop = scrollTop > maxTotalHeight ? maxTotalHeight : scrollTop
    }
    if (length >= 10000) {
      isBigData = true
    }
    let topBlankHeight, bottomBlankHeight, startIndex, visibleRowCount
    startIndex = this.getIndexByScrollTop(rowHeight, scrollTop)
    visibleRowCount = Math.ceil(visibleHeight / oriRowHeight)
    topBlankHeight = rowHeight * startIndex
    topBlankHeight = this.getValidValue(topBlankHeight, 0, totalHeight)
    bottomBlankHeight = totalHeight - scrollTop - visibleHeight
    if (bottomBlankHeight === 0 && visibleRowCount <= length) {
      const { loadMore } = this.props
      if (loadMore && typeof loadMore === 'function') {
        this.throttle(loadMore, 1000)()
      }
    }

    const slideUpHeight = Math.abs(topBlankHeight - this.state.topBlankHeight)
    const slideDownHeight = Math.abs(bottomBlankHeight - this.state.bottomBlankHeight)

    if (!this.lastSlideUpHeight) {
      this.sameSlideHeightCount = 0
      this.lastSlideUpHeight = slideUpHeight
    } else if (this.lastSlideUpHeight === slideUpHeight) {
      this.sameSlideHeightCount++
    } else {
      this.lastSlideUpHeight = slideUpHeight
      this.sameSlideHeightCount = 0
    }

    // console.log('===================')
    // console.log('oriRowHeight', oriRowHeight)
    // console.log('rowHeight', rowHeight)
    // console.log('totalHeight', totalHeight)
    // console.log('visibleHeight', visibleHeight)
    // console.log('scrollTop', scrollTop)
    // console.log('topBlankHeight', topBlankHeight)
    // console.log('bottomBlankHeight', bottomBlankHeight)
    // console.log('startIndex', startIndex)
    // console.log('visibleRowCount', visibleRowCount)
    // console.log('slideUpHeight', slideUpHeight)
    // console.log('slideDownHeight', slideDownHeight)

    let isValid = slideUpHeight >= rowHeight
    isValid = isValid || slideDownHeight >= rowHeight
    isValid = isValid || startIndex === 0
    if (isValid) {
      startIndex = startIndex - 5
      visibleRowCount = visibleRowCount + 5
      this.setState({
        startIndex,
        visibleRowCount,
        topBlankHeight,
        bottomBlankHeight,
        scrollTop
      })
      if (isBigData && this.sameSlideHeightCount >= 1) {
        // 防止大数据持续滚动期间出现空白的问题
        this.refScroll.scrollTop = scrollTop
        this.sameSlideHeightCount = 0
        console.log('set this.refScroll.scrollTop=', scrollTop)
      }
    }
  }

  checkValidIntervalTime(timeKey, interval = 100) {
    const cur = Date.now()
    if (!this[timeKey] || cur - this[timeKey] >= interval) {
      this[timeKey] = cur
      return true
    }
    return false
  }

  getValidValue(val, min = 0, max = 40) {
    if (val < min) {
      return min
    } else if (val > max) {
      return max
    }
    return val
  }

  render() {
    let { dataSource = null, scroll, columns, ...rest } = this.props
    const { topBlankHeight, bottomBlankHeight, startIndex, visibleRowCount, thresholdCount } = this.state
    const { length } = dataSource || []
    let startCount = length - visibleRowCount
    startCount = startCount > 0 ? startCount : length
    let startIn = this.getValidValue(startIndex, 0, startCount)
    let endIn = startIndex + visibleRowCount
    if (!endIn) {
      // 初始化渲染数据
      endIn = length > thresholdCount ? thresholdCount : length
    }
    endIn = this.getValidValue(endIn, startIndex, length)
    const data = (dataSource || []).slice(startIn, endIn)

    if (columns.reduce((total, item) => total + item.width, 0) < scroll.x) {
      // 当表格自适应宽度大于单元格宽度总和时，去掉最后一列的宽度，让最后一列自适应
      if (columns[columns.length - 1]) {
        delete columns[columns.length - 1].width
      }
    }

    return (
      <Fragment>
        <VirtualTable.FillNode height={topBlankHeight} node={this.refTopNode} />
        <Table columns={columns} {...rest} dataSource={data} scroll={scroll} />
        <VirtualTable.FillNode height={bottomBlankHeight} node={this.refBottomNode} />
      </Fragment>
    )
  }
}

export default VirtualTable
