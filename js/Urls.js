
var locationPath = "http://weixin.coreware.cn";
var Urls = {
	// 更新
	update: locationPath + "/Public/static/update/update.json",
	// 登录
	login: locationPath + "/fxfront/member/login",
	// 注册
	register: locationPath + "/fxfront/member/register",
	// 忘记密码
	forgetPass: locationPath + "/fxfront/member/lostpassword",
	// 修改密码
	changePassword: locationPath + "/fxfront/member/changepaypassword",
	// 城市列表
	getHotregions: "/fxfront/interface/gethotregions",
	// 个人信息
	memberCenter: locationPath + "/fxfront/member/membercenter",
	// 修改个人昵称
	modifyNickname: locationPath + "/fxfront/member/modifynickname",
	// 修改头像
	uploadMemberPic: locationPath + "/fxfront/member/uploadmemberpic",
	// 修改个人性别
	modifySex: locationPath + "/fxfront/member/modifysex",
	// 修改地区
	modifyAddress: locationPath + "/fxfront/member/modifydistrict",
	// 首页
	home: locationPath + "/fxfront/interface/homepage",
	// 首页banner
	homeBanner: locationPath + "/fxfront/interface/marketad",
	// 一级分类
	getCategoryByTopFilter: locationPath + "/fxfront/interface/getcategorybytopfilter",
	// 二级分类
	getCategoryByChildFilter: locationPath + "/fxfront/interface/getcategorybychildfilter",
	// 分类查询商品
	getGoodsByCategoryDistrictBrand: locationPath + "/fxfront/interface/getGoodsByCategoryDistrictBrand",
	// 收货地址
	address: locationPath + "/fxfront/order/address",
	// 更新地址
	updataAddress: locationPath + "/fxfront/member/updateconsignee",
	// 删除收货地址
	delAddress: locationPath + "/fxfront/member/delconsignee",
	// 设置默认地址
	setDefaultAddress: locationPath + "/fxfront/member/setdefaultconsignee",
	// 添加地址
	addAddress: locationPath + "/fxfront/member/addconsignee",
	// 获取验证码
	getCode: locationPath + "/fxfront/member/getmoblieticket",
	// 校验验证码
	checkCode: locationPath + "/fxfront/member/checkticket",
	// 申请合伙人
	insertOrupdate: locationPath + "/fxfront/partner/insertOrupdate",
	// 判断是否为合伙人
	isPartner: locationPath + "/fxfront/partner/findByOpenId",
	// 分享记录列表
	getsharerecordsbymemberid: locationPath + "/fxfront/share/getsharerecordsbymemberid",
	// 删除分享订单
	deleteOrder: locationPath + "/fxfront/shoporder/deleteorder",
	// 商品详情页详情内容
	goodsContent: locationPath + "/fxfront/interface/goodscontent",
}
