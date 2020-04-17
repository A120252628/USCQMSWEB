/*
 * @Author: hjh
 * @Date: 2019-08-09 16:50:41
 * @LastEditTime: 2020-04-14 14:30:26
 * @Descripttion: 参数集合
 */
export const reqParamMap = [
  { label: '对象标识', value: 'itemNo' },
  { label: '父对象标识', value: 'itemA' },
  { label: '关联关系标识', value: 'relationShipNo' },
  { label: '分类节点对象标识', value: 'classNodeItemNo' },
  { label: '分类业务对象标识', value: 'classBusinessItemNo' },
  { label: '分类对象标识', value: 'classItemNo' },
  { label: '属性页标识', value: 'itemPropertyPageNo' },
  { label: '表格标识', value: 'itemGridNo' },
  { label: '分类节点属性页标识', value: 'classNodeItemPropertyNo' },
  { label: '选中数据(多选)', value: 'hData' },
  { label: '选中数据(单选)', value: 'hSingleData' },
  { label: '父对象选中数据', value: 'itemAData' },
  { label: '输入值', value: 'data' },
  { label: '当前页码', value: 'page' },
  { label: '表格数据', value: 'rData' },
  { label: '分类节点数据', value: 'classNodeData' },
  { label: '父id', value: 'pid' },
  { label: '映射字段', value: 'mapFields' }
]

export const wtypeMap = [
  { name: '确认框', value: 'comfirm' },
  { name: '对象属性页', value: 'itemPropertyPage' },
  { name: '节点对象属性页', value: 'classNodeItemPropertyNo' },
  { name: '对象关联页', value: 'itemRelationPage' },
  { name: '查询对象视图', value: 'queryItemView' },
  { name: '分类对象视图', value: 'classItemView' },
  { name: '批量新增', value: 'batchAdd' },
  { name: '下载', value: 'downLoad' },
  // { name: '打印', value: 'print' },
  { name: '报表', value: 'report' }
]

export const editorMap = [
  { value: 'TextBox', name: '文本框' },
  { value: 'TextArea', name: '文本域' },
  { value: 'RichText', name: '富文本' },
  { value: 'DateTime', name: '时间选择器' },
  { value: 'CheckBox', name: '复选框' },
  { value: 'ValueList', name: '值列表' },
  { value: 'MapValueList', name: '映射值列表' },
  { value: 'DBValueList', name: 'DB值列表' },
  { value: 'RadioEditor', name: '单选编辑器' },
  { value: 'CheckEditor', name: '多选编辑器' },
  { value: 'ItemSelector', name: '引用对象编辑器' },
  { value: 'UserSelector', name: '单用户选择器' },
  { value: 'UsersSelector', name: '多用户选择器' },
  { value: 'DeptSelector', name: '部门选择器' },
  { value: 'FileSelector', name: '文件选择器' },
  { value: 'OnSelector', name: '编码生成器' },
  { value: 'Password', name: '密码框' },
  { value: 'Slider', name: '进度条' },
  { value: 'Rate', name: '评分/等级' },
  { value: 'ItemNoSelector', name: '对象标识选择器' }
]

export const ftypeMap = [
  { type: 'VARCHAR', name: '字符串' },
  { type: 'INT', name: '整型' },
  { type: 'DATETIME', name: '时间类型' },
  { type: 'DOUBLE', name: '双精度浮点型' },
  { type: 'FLOAT', name: '单精度浮点型' },
  { type: 'BOOLEAN', name: '布尔型' },
  { type: 'NUMERIC', name: '数值类型' },
  { type: 'LONGTEXT', name: '富文本类型' },
  { type: 'BLOB', name: '二进制' }
]

export const formatMap = [
  { value: 'YYYY-MM', name: '年-月' },
  { value: 'YYYY-MM-DD', name: '年-月-日' },
  { value: 'YYYY-MM-DD HH', name: '年-月-日 时' },
  { value: 'YYYY-MM-DD HH:mm', name: '年-月-日 时:分' },
  { value: 'YYYY-MM-DD HH:mm:ss', name: '年-月-日 时:分:秒' }
]

export const facetypeMap = [
  { value: -1, name: '导航组' },
  { value: 0, name: '定制页面' },
  { value: 1, name: '普通页面' },
  { value: 2, name: '上下关联页面' },
  { value: 3, name: '三级关联页面' },
  { value: 4, name: '分类关联页面' },
  { value: 5, name: '自动分类页面' },
  { value: 6, name: '报表页面' },
  { value: 21, name: '质检录入页面' }
]

export const stateMap = {
  C: '未同步',
  S: '签审状态',
  F: '已同步',
  U: '升版中',
  H: '历史状态',
  HS: '已作废'
}

export const relationTypeMap = [
  { name: '关联属性页', value: 'relationproperty' },
  { name: '关联关系页', value: 'relationpage' },
  { name: '关联查询页', value: 'relationqueryview' },
  { name: '关联分类视图', value: 'relationclassview' },
  { name: '变更历史', value: 'changeHistory' },
  { name: '输入', value: 'input' },
  { name: '输出', value: 'output' },
  { name: '动态关联页', value: 'dynamicRelationPage' }
]

export const mqMtype = ['SQL脚本', '存储过程', '存储过程', 'JS脚本']
