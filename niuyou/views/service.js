var Service = {
  host:'http://ny-api.jcc1.cn',
  checkMobile: '/checkMobile', // 手机号验证
  isVerifyCode: '/isVerifyCode',//是否需要验证码,并获取验证码
  verifyCode: '/verifyCode',//获取图形验证码
  sendVerifyCode: '/sendVerifyCode',// 发送手机验证码
  regMobile: '/regMobile',// 手机号注册
  login: '/login',// 登录
  logout: '/logout',// 退出
  checkSSO: '/checkSSO',//判断是否登录
  sendPwdCode:'/sendPwdCode',// 忘记密码的验证码
  checkPwdCode:'/checkPwdCode',// 验证码校验
  resetPwd:'/resetPwd',// 重置密码并登录
  getInfo:'/c/personalInfo/getInfo',// 获得用户基本信息

  index:'/c/index', //首页
  provinces:'/address/provinces',// 省市区接口：获取省份
  citys:'/address/citys',// 省市区接口：获取城市
  areas:'/address/areas',// 省市区接口：获取地区
  rankingList:'/c/ranking/list',// 排行榜
  rankingDetail:'/c/ranking/detail',//排行榜详情页
  taskList:'/c/task/list', // 任务列表
  myReceiveTaskList:'/c/task/myReceiveList', // 我的领取的任务列表
  getTaskDetail:'/c/task/getTaskDetail', // 任务详情
  receiveOrder:'/c/taskOrder/receiveOrder', // 申请任务
  uploadOrderPhoto:'/c/taskOrder/uploadOrderPhoto', //上传接单图片凭证
  sureOrder:'/c/taskOrder/sureOrder', //提交任务
  ongoingOrderList:'/c/taskOrder/ongoingOrderList',// 进行中的任务
  finishNotSettleOrderList:'/c/taskOrder/finishNotSettleOrderList',// 完成未结算任务
  finishSettleOrderList:'/c/taskOrder/finishSettleOrderList',// 完成结算任务
  noPassOrderList:'/c/taskOrder/noPassOrderList',// 审核不通过任务
  invalidOrderList:'/c/taskOrder/invalidOrderList',// 失效的任务

  saveBasicInfo:'/c/personalInfo/saveBasicInfo', // 保存个人基本信息
  saveCity:'/c/personalInfo/saveCity', //设置城市
  saveCardnoPhotoUrl:'/c/personalInfo/saveCardnoPhotoUrl', //设置手持证件照片路径
  savePeopleNumPhotoUrl:'/c/personalInfo/savePeopleNumPhotoUrl', // 设置联系人数量照片路径
  uploadPersonalPhoto:'/c/personalInfo/uploadPersonalPhoto',// 上传生活照
  getPersonalPhoto:'/c/personalInfo/getPersonalPhoto',// 获取生活照
  submitVerify:'/c/personalInfo/submitVerify',// 提交认证

  feedback:'/system/feedback/add',// 意见反馈
  getToken:'/get_token',// 上传
};

module.exports = Service;
