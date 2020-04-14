import React, { Component } from 'react'
import { Icon, Tabs, Tooltip } from 'antd'
import DragCmp from '../../common/DragCmp'
import EnterInput from '../../qualityInput/EnterInput'

import styles from '../engine.css'

const TabPane = Tabs.TabPane
/**
 * @desc 上下页面布局高阶组件
 * @param engine
 * @returns {function(*)}
 * @author zxy
 * @date 2019-05-08
 */
const UpAndDownHoc = engine => WrappedComponent => {
  console.log(engine)
  return class extends Component {
    onClick(record) {
      if (!engine.itemRelationPage || engine.itemRelationPage.length === 0) {
        return
      }
      //遍历循环查出每一个child的页面数据并进行装载
      if (engine.itemRelationPage) {
        const { itemRelationPage, facetype, namespace, menuId, itemNo } = engine
        this.props.dispatch({
          type: `popup/loadSubpage`,
          payload: { itemRelationPage, record, facetype, pNameSpace: namespace, menuId, itemA: itemNo }
        })
        if (!this.props.model.showTab) {
          this.props.dispatch({ type: `${engine.namespace}/packet`, payload: { showTab: true } })
        }
      }
    }

    close() {
      this.props.dispatch({ type: `${engine.namespace}/packet`, payload: { showTab: false } })
    }

    render() {
      let { panes, showTab, selectedRows } = this.props.model
      const { id, itemID, facetype, itemNo, height } = engine
      // panes = panes.filter(item => item.key !== id && item.key !== itemID)
      const closeBtn = (
        <Tooltip title='关闭'>
          <Icon type='close' onClick={this.close.bind(this)} className='tab_bar_icon' />
        </Tooltip>
      )
      return (
        <div className={styles.flexY} style={{ height: height || '100%' }}>
          <DragCmp height={showTab ? '40%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
            <div className={styles.flexX}>
              <DragCmp
                width={showTab && facetype === 21 ? '40%' : '100%'}
                canResizing={{ right: true }}
                showTab={showTab && facetype === 21}
              >
                <WrappedComponent {...this.props} onClick={this.onClick.bind(this)} />
              </DragCmp>
              {showTab && facetype === 21 && (
                <div className={styles.flexGrowX}>
                  <Tabs tabBarExtraContent={closeBtn}>
                    <TabPane tab='录入' key='1'>
                      <EnterInput selectedRows={selectedRows} itemNo={itemNo} />
                    </TabPane>
                  </Tabs>
                </div>
              )}
            </div>
          </DragCmp>
          {showTab && (
            <div className={styles.flexGrowY}>
              <Tabs defaultActiveKey={panes[0] && panes[0].key} tabBarExtraContent={closeBtn}>
                {panes.map(pane => (
                  <TabPane
                    className='tab_pane'
                    tab={
                      <span>
                        <Icon type={pane.icon} />
                        {pane.title}
                      </span>
                    }
                    key={pane.key}
                  >
                    {pane.content}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      )
    }
  }
}
export default UpAndDownHoc
