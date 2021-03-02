const baseFunctionsUrl = "https://xing.cerbur.top/functions";
const baseDownloadUrl = "https://gdutday.gitee.io/gdut-lib";
const baseDataUrl = "https://gdutday.gitee.io/data";
const baseNewsUrl = "https://news.cerbur.top"
export const APIs = {
	classAndExam: "/crawler/classAndExam",
	educationInit: "/crawler/education/init",
	curriculum: "/crawler/curriculum",
	exam: "/crawler/exam",
	campus: "/crawler/campus",
	grade: "/crawler/grade",
	login: "/user/login",
	checkMsg: "/check/msg", // 检测文字是否合乎法规的接口
	// download: "/document/download",
	orc: baseFunctionsUrl + "/orc",
	getPayImg: baseFunctionsUrl + "/getPayImg",
	getNetInfo: baseFunctionsUrl + "/getNetInfo",
	getLink: baseFunctionsUrl + '/getLink',
	douban: {
		comments: baseFunctionsUrl + '/douban/comments'
	},
	test: baseFunctionsUrl + "/test",
	open: baseDataUrl + "/open",
	update: baseDataUrl + "/update",
	version: baseDataUrl + "/version",
	tip: baseDataUrl + "/tip",
	task: baseDataUrl + "/task",
	problem: baseDataUrl + "/problem",
	location: baseDataUrl + "/locations",
	details: baseDataUrl + "/details/",
	getSchoolOpening: baseDataUrl + "/openSchool",
	locationLength: baseDataUrl + "/length",
	getNewsList: baseNewsUrl + "/news/type",
	getNewsDetail: baseNewsUrl + "/news/id",
	// getSchoolOpening: baseFunctionsUrl + "/getSchoolOpening",
	getRecommendBook: 'https://ifl.zhaobenshu.com/Logs/stvisitkey_ifa_GetList.ashx?a=[Lib={{gdut}}][StArea={{StWeek}}][UniSess={{}}][SessLib={{gdut}}][SessFun={{wap}}][SessPrd={{book}}][SessType={{3}}]&z3=&z4=0&z5=',
	download: baseDownloadUrl,
	giteeDownloadRoot: 'https://gitee.com/api/v5/repos/gdutday/gdut-lib/git/trees/master',
};
const baseLibrary = "https://ifq.zhaobenshu.com";
export function doubianBook(Isbn) {
	return `https://api.douban.com/v2/book/isbn/${Isbn}?apikey=0df993c66c0c636e29ecbb5344252a4a`
}
export function doubianBookContext(id) {
	return `https://api.douban.com/v2/book/${id}/annotations?apikey=0df993c66c0c636e29ecbb5344252a4a`
}
export function findBookPramer(key, page = 1) {
	return `${baseLibrary}/Find/find_ifa_FindFullPage.ashx?a=[Lib={{gdut}}][SublibSn={{0}}][Keys={{${encodeURI(
        key
    )}}}][_PageNo={{${page}}}][UniSess={{}}][SessLib={{gdut}}][SessFun={{wap}}][SessPrd={{book}}][SessType={{3}}]`;
}
export function bookPlacePrammer(key) {
	return `https://ifq.zhaobenshu.com/Find/find_ifa_GetOpacColl.ashx?a=[Lib={{gdut}}][CtrlNo={{${key}}}]&u=[SessLib={{gdut}}][SessFun={{wap}}][SessPrd={{book}}]&z4=1&z5=?`;
}
export function bookDetailPramer(CtrlRd) {
	return `https://ifq.zhaobenshu.com/Find/find_ifa_Accs_GetDetail.ashx?a=[Lib={{gdut}}][CtrlRd={{${CtrlRd}}}][UniSess={{}}][SessLib={{gdut}}][SessFun={{wap}}][SessPrd={{book}}][SessType={{3}}]&z3=&z4=1&z5=`;
}
export function jingdongBookComments(id) {
	return `https://club.jd.com/comment/productPageComments.action?productId=${id}&score=0&sortType=5&page=0&pageSize=10`;
}
