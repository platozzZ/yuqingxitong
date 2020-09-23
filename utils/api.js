import request from '@/utils/request.js'

// 在您需要请求的地方直接使用该api
export function getLogin(data) {
    return request.request({
        url: '/ashx/Main/LoginPage.ashx',
        method: 'POST',
        data: data
    })
}
// 获取系统名称 /ashx/Main/LoginPage.ashx?type=GetSystemName

export function getSystem(data) {
    return request.request({
        url: '/ashx/Article/Article.ashx?type=GetSystemName',
        method: 'GET',
        data: data
    })
}

export function getAbs(data) {
    return request.request({
        url: '/ashx/YQTotal/YQTotal.ashx?type=GetYQTotal',
        method: 'GET',
        data: data
    })
}
export function getVol(data) {
    return request.request({
        url: '/ashx/Volume/Volume.ashx?type=GetVolume',
        method: 'POST',
        data: data
    })
}
export function getTrend(data) {
    return request.request({
        url: '/ashx/Trend/Trend.ashx?type=GetTrend',
        method: 'POST',
        data: data
    })
}
// 获取资讯列表 /ashx/Article/Article.ashx?type=GetArticle&UserID=1&PageNum=0
// /ashx/Article/Article.ashx?type=GetArticle&UserID=1&PageNum=2&title=领克ProjectName=Bad
export function getArticle(data) {
    return request.request({
        // url: '/ashx/Article/Article.ashx?type=GetArticle&ProjectName=' + n +'&UserID=' + e + '&PageNum=' + v ,
        url: '/ashx/Article/Article.ashx?type=GetArticle',
        method: 'POST',
        data: data
    })
}
// 获取资讯详情 /ashx/Article/Article.ashx?type=GetArticleDetial&Article_ID=b38876840
// /ashx/Article/Article.ashx?type=GetArticleDetial&Article_ID=b38876840&ProjectName=Good / Bad&UserID=1
export function getArticleDetail(data) {
    return request.request({
        url: '/ashx/Article/Article.ashx?type=GetArticleDetial',
        method: 'POST',
        data: data
    })
}

export function getTopic(data) {
    return request.request({
		// /ashx/Topic/Topic.ashx?type=GetTopic&ProjectName=TopicBadPGC&Period=week
		url: '/ashx/Topic/Topic.ashx?type=GetTopic',
        method: 'POST',
        data: data
    })
}

export function getWordCloud(data) {
    return request.request({
// /ashx/WordCloud/WordCloud.ashx?type=GetWordCloud&ProjectName=WordCloudBad&Period=week
		url: '/ashx/WordCloud/WordCloud.ashx?type=GetWordCloud',
        method: 'POST',
        data: data
    })
}

export function updatePassword(data){
	return request.request({
		url: '/ashx/Main/LoginPage.ashx?type=UpdatePassword',
		method: 'POST',
		data: data
	})
}

// 添加收藏 /ashx/Main/LoginPage.ashx?type=AddBookMark&UserID=1&ArticleID=45163
export function addBookMark(data){
	return request.request({
		url: '/ashx/Main/LoginPage.ashx?type=AddBookMark',
		method: 'POST',
		data: data
	})
}
// 移除收藏 /ashx/Main/LoginPage.ashx?type=DeleteBookMark&UserID=1&ArticleID=45163
export function deleteBookMark(data){
	return request.request({
		url: '/ashx/Main/LoginPage.ashx?type=DeleteBookMark',
		method: 'POST',
		data: data
	})
}
//获取收藏夹列表  /ashx/Main/LoginPage.ashx?type=GetBookMarkList&UserID=1&PageNum=0
// /ashx/Main/LoginPage.ashx?type=GetBookMarkList&UserID=1&PageNum=0
// /ashx/Main/LoginPage.ashx?type=GetBookMarkList&UserID=1&PageNum=0&Title=皓影

export function getBookList(data){
	return request.request({
		url: '/ashx/Main/LoginPage.ashx?type=GetBookMarkList',
		method: 'POST',
		data: data
	})
}

// 获取合作媒体列表
export function getMediaList(data){
	return request.request({
		url: '/ashx/Media/Media.ashx?type=GetMedia&ProjectName=MediaFriend',
		method: 'POST',
		data: data
	})
}

// 获取非合作媒体列表
export function getMediaNoList(data){
	return request.request({
		url: '/ashx/Media/Media.ashx?type=GetMedia&ProjectName=MediaNonFriend',
		method: 'POST',
		data: data
	})
}

// 获取企业数据 /ashx/Enterprise/Enterprise.ashx?type=GetEnterprise&ProjectName=Enterprise&Period=month
export function getEnterprise(data){
	return request.request({
		url: '/ashx/Enterprise/Enterprise.ashx?type=GetEnterprise&ProjectName=Enterprise',
		method: 'POST',
		data: data
	})
}

//资讯搜索 /ashx/Article/Article.ashx?type=SearchArticle&Breed=5G&Product=5G&Title=5G
// /ashx/Article/Article.ashx?type=GetArticle&UserID=1&PageNum=0&title=新款领克
export function searchArticle(e,n,v){
	return request.request({
		url: '/ashx/Article/Article.ashx?type=SearchArticle&UserID=' + e + '&PageNum=' + n + '&title=' + v,
		method: 'GET',
		// data: data
	})
}

//专题数据 /ashx/Special/Special.ashx?type=GetSpecial&ProjectName=TopicVolume
// /ashx/Special/Special.ashx?type=GetSpecial&ProjectName=TopicTrend&EventName=专项-第四代飞度配置表泄露
export function getSpecial(data){
	return request.request({
		url: '/ashx/Special/Special.ashx?type=GetSpecial',
		method: 'POST',
		data: data
	})
}

// 平台数据 /ashx/Plat/Plat.ashx?type=GetPlat&ProjectName=PlatForm&Proid=week
export function getPlat(data){
	return request.request({
		url: '/ashx/Plat/Plat.ashx?type=GetPlat&ProjectName=PlatForm&Proid=' + data,
		method: 'GET',
		// data: data
	})
}

