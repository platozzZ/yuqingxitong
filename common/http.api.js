// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let login = '/ashx/Main/LoginPage.ashx'
let system = '/ashx/Article/Article.ashx?type=GetSystemName'
let abs = '/ashx/YQTotal/YQTotal.ashx?type=GetYQTotal'
let vol = '/ashx/Volume/Volume.ashx?type=GetVolume'
let trend = '/ashx/Trend/Trend.ashx?type=GetTrend'
// // 获取资讯列表
// export function getArticle(data) {
let article = '/ashx/Article/Article.ashx?type=GetArticle'
// export function getArticleDetail(data) {
let articledetail = '/ashx/Article/Article.ashx?type=GetArticleDetial'

// export function getTopic(data) {
let topic = '/ashx/Topic/Topic.ashx?type=GetTopic'
// export function getWordCloud(data) {
let wordcloud = '/ashx/WordCloud/WordCloud.ashx?type=GetWordCloud'
// export function updatePassword(data){
let updatepwd = '/ashx/Main/LoginPage.ashx?type=UpdatePassword'
// // 添加收藏 
// export function addBookMark(data){
let addmark = '/ashx/Main/LoginPage.ashx?type=AddBookMark'

// // 移除收藏 /ashx/Main/LoginPage.ashx?type=DeleteBookMark&UserID=1&ArticleID=45163
// export function deleteBookMark(data){
let deletemark = '/ashx/Main/LoginPage.ashx?type=DeleteBookMark'
// //获取收藏夹列表 
// export function getBookList(data){
let booklist = '/ashx/Main/LoginPage.ashx?type=GetBookMarkList'

// // 获取合作媒体列表 
// export function getMediaList(data){
let medialist = '/ashx/Media/Media.ashx?type=GetsMediaFriend&IsH=1'

// // 获取非合作媒体列表 
// export function getMediaNoList(data){
let medianolist = '/ashx/Media/Media.ashx?type=GetsMediaFriend&IsH=0'

// // 获取企业数据
// export function getEnterprise(data){
let enterprise = '/ashx/Enterprise/Enterprise.ashx?type=GetEnterprise&ProjectName=Enterprise'

// //资讯搜索
// export function searchArticle(e,n,v){
// let search = '/ashx/Article/Article.ashx?type=SearchArticle&UserID=' + e + '&PageNum=' + n + '&title=' + v,
// 		method: 'GET',

//专题数据
// export function getSpecial(data){
let special = '/ashx/Special/Special.ashx'

// export function getSpecialCount(){
let specialcount = '/ashx/Special/Special.ashx?type=GetSpecialItemCount'
// 		method: 'GET',
     
// export function getSpecialList(data){
let speciallist = '/ashx/Special/Special.ashx?type=GetSpecialItem'

// // 平台数据
// export function getPlat(data){
let plat = '/ashx/Plat/Plat.ashx?type=GetPlat&ProjectName=PlatForm'

// // 媒体健康度
// export function getHealthMedia(data){
let healthmedia = '/ashx/Health/Health.ashx?type=GetHealthyMedia'

// // 论坛健康度
// export function getHealthBbs(data){
let healthbbs = '/ashx/Health/Health.ashx?type=GetHealthyBBS'


// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	let getLogin = (params = {}) => vm.$u.post(login, params) // 登录
	let getSystem = (params = {}) => vm.$u.post(system, params)// 获取系统名称
	let getAbs = (params = {}) => vm.$u.post(abs, params)// 获取概要数据
	let getVol = (params = {}) => vm.$u.post(vol, params)// 获取声量数据
	let getTrend = (params = {}) => vm.$u.post(trend, params)// 获取走势数据
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {getVol};
}

export default {
	install
}
