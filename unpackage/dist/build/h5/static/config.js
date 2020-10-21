let BASE_URL = ""
if (process.env.NODE_ENV === 'development') {
	// 开发环境
	console.log('开发环境');
	console.log('开发环境url:',getUrlRelativePath(window.location.href));
	// BASE_URL = 'http://training.adpr365.com'
	BASE_URL = 'http://three.adpr365.com'
} else {
	// 生产环境
	console.log('生产环境');
	let url = getUrlRelativePath(window.location.href)
	console.log('生产环境url:',url);
	BASE_URL = url
}
function getUrlRelativePath(url){
	return url.split("/#")[0]
}
export default BASE_URL