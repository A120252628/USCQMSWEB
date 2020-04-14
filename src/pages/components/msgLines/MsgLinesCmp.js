import React from 'react'
import { Tabs, Button } from 'antd'
import MsgLinesForm from './MsgLinesForm'
import DragCmp from '../common/DragCmp'
import TableWithBtn from '../common/TableWithBtn'
import MsgListener from './MsgListener'

const TabPane = Tabs.TabPane

const MsgLinesCmp = ({ showTab, disabled, PID, tableProps, formProps, closeTab }) => {
  const closeBtn = <Button type='default' icon='close' onClick={closeTab} />
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DragCmp height={showTab ? '50%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
        <TableWithBtn {...tableProps} />
      </DragCmp>
      {showTab && (
        <div style={{ flexGrow: '1', width: '100%', height: '5px' }}>
          <Tabs tabBarExtraContent={closeBtn}>
            <TabPane tab='消息监听' key='1'>
              <MsgListener disabled={disabled} PID={PID} />
            </TabPane>
          </Tabs>
        </div>
      )}
      <MsgLinesForm {...formProps} />
    </div>
  )
}
export default MsgLinesCmp
