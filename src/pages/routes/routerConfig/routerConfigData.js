/**
 * @desc 页面配置文件--前台定制界面完成后在此配置
 * @namespace 菜单请求对象标识
 * @menuName tab的页签名
 * @icon tab页签图标
 * @component 加载组件
 * @type {*[]}
 * @date 2019-05-21
 * @author zxy
 */
const routerConfigData = [
  {
    namespace: 'dataStats',
    menuName: '数据面板',
    icon: 'fund',
    component: require('../../routes/dataStats/DataStats').default
  },
  {
    namespace: 'tableConfig',
    menuName: '业务对象',
    icon: 'edit',
    component: require('../../routes/tableConfig/TableConfig').default
  },
  {
    namespace: 'nav',
    menuName: '导航菜单',
    icon: 'edit',
    component: require('../../routes/nav/nav').default
  },
  {
    namespace: 'relationship',
    menuName: '关联关系',
    icon: 'edit',
    component: require('../../routes/relationship/relationship').default
  },
  {
    namespace: 'autoClass',
    menuName: '自动分类视图',
    icon: 'edit',
    component: require('../../routes/autoClass/AutoClass').default
  },
  {
    namespace: 'globalTable',
    menuName: '全局表格',
    icon: 'table',
    component: require('../../routes/globalTable/globalTable').default
  },
  {
    namespace: 'mqAffair',
    menuName: '消息事务',
    icon: 'table',
    component: require('../../routes/msgLines/mqAffair').default
  },
  {
    namespace: 'msgLines',
    menuName: '消息总线',
    icon: 'table',
    component: require('../../routes/msgLines/msgLines').default
  },
  {
    namespace: 'oaFile',
    menuName: '文件管理',
    icon: 'edit',
    component: require('../../routes/sys/file/File').default
  },
  {
    namespace: 'actModel',
    menuName: '模型管理',
    icon: 'project',
    component: require('../../routes/activiti/modelManage/ActModel').default
  },
  {
    namespace: 'actProcdef',
    menuName: '流程管理',
    icon: 'sync',
    component: require('../../routes/activiti/modelManage/ActProcdef').default
  },
  {
    namespace: 'actRunProcess',
    menuName: '运行中的流程',
    icon: 'setting',
    component: require('../../routes/activiti/ProcessManage/ActRunProcess').default
  },
  {
    namespace: 'actTaskToDo',
    menuName: '工作流待办任务',
    icon: 'setting',
    component: require('../../routes/activiti/personalTask/ActTaskToDo').default
  },
  {
    namespace: 'actEndProcess',
    menuName: '已结束任务',
    icon: 'setting',
    component: require('../../routes/activiti/ProcessManage/ActEndProcess').default
  },
  {
    namespace: 'actTaskDone',
    menuName: '已办理任务',
    icon: 'setting',
    component: require('../../routes/activiti/personalTask/ActTaskDone').default
  },
  {
    namespace: 'actMyProcess',
    menuName: '我的申请',
    icon: 'setting',
    component: require('../../routes/activiti/personalTask/ActMyProcess').default
  },
  {
    namespace: 'startProcess',
    menuName: '发起流程',
    icon: 'setting',
    component: require('../../routes/activiti/ProcessManage/StartProcess').default
  },
  {
    namespace: 'assignRole',
    menuName: '分配角色',
    icon: 'user-add',
    component: require('../../routes/sys/AssignRole').default
  },
  {
    namespace: 'queryView',
    menuName: '关系视图',
    icon: 'fund',
    component: require('../../routes/queryView/queryView').default
  },
  {
    namespace: 'codeStandard',
    menuName: '编码规范',
    icon: 'setting',
    component: require('../../routes/sys/systemPlatform/CodeStandard').default
  },
  {
    namespace: 'systemLog',
    menuName: '系统日志',
    icon: 'fund',
    component: require('../../routes/sys/SystemLog').default
  },
  {
    namespace: 'admissionTest',
    menuName: '入场检验',
    icon: 'fund',
    component: require('../../routes/admissionTest/admissionTest').default
  },
  {
    namespace: 'demo',
    menuName: '待办任务',
    icon: 'fund',
    component: require('../../routes/demo/Demo').default
  },
  {
    namespace: 'SupplierRate',
    menuName: '供应商交货合格率',
    icon: 'fund',
    component: require('../../routes/dataStats/SupplierRate').default
  },
  {
    namespace: 'IQCBad',
    menuName: 'IQC不良分布',
    icon: 'fund',
    component: require('../../routes/dataStats/IQCBad').default
  },
  {
    namespace: 'IQCReport',
    menuName: 'IQC检验报表',
    icon: 'fund',
    component: require('../../routes/dataStats/IQCReport').default
  },
  {
    namespace: 'IncomingBad',
    menuName: 'IQC检验报表',
    icon: 'fund',
    component: require('../../routes/dataStats/IncomingBad').default
  },
  {
    namespace: 'ComplaintsStatistics',
    menuName: '客户投诉统计',
    icon: 'fund',
    component: require('../../routes/dataStats/ComplaintsStatistics').default
  },
  {
    namespace: 'QcCostStatistics',
    menuName: '质量成本统计',
    icon: 'fund',
    component: require('../../routes/dataStats/QcCostStatistics').default
  }
]
export default routerConfigData
