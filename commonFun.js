//抽离出来的函数
import Vue from "vue";
//通用函数,异步设置缓存,没有就设置缓存值
export function getStorage(key, success = () => {}, fail = () => {}, def) {
	if (typeof key !== "string") throw new Error("请输入字符");
	uni.getStorage({
		key: key,
		success: success,
		fail: () => {
			if (typeof def !== "undefined") {
				uni.setStorage({
					key: key,
					data: def
				});
			}
			fail();
		}
	});
}

//!!通用函数 同步获取缓存,如果没有设置默认值并返回缓存值
export function getStorageSync(key, def, toJSONparse = false) {
	//uni.getStorageSync(key)无时不报错 拿到空白字符串;
	key = key + "";
	const storageKeys = uni.getStorageInfoSync().keys;
	let result = storageKeys.some(item => item == key) ?
		uni.getStorageSync(key) :
		(() => {
			if (def === undefined) return "";
			if (typeof def == "object") def = JSON.stringify(def);
			uni.setStorageSync(key, def);
			return def;
		})();
	try {
		result =
			toJSONparse && typeof result == "string" ? JSON.parse(result) : result;
	} catch (e) {}
	return result;
}

//开学日期
let termStart = getStorageSync('schoolOpening', "2020.3.2");
//输入距离开学日期的天数,输出日期
export function getDate(intervalDay) {
	const start = termStart.split("."),
		inputTime = new Date(
			intervalDay * 86400000 +
			new Date(start[0], start[1] - 1, +start[2]).getTime()
		);
	return inputTime.getMonth() + 1 + "." + inputTime.getDate();
}
//获取现在的周数(相对于开学日期)
export function getWeek() {
	const start = termStart.split("."),
		diff =
		new Date().getTime() -
		new Date(start[0], start[1] - 1, +start[2]).getTime();
	//从第0开始
	const week = Math.floor(diff / 604800000);
	return week;
}
export function getCurrentWeek() {
	const week = getWeek();
	if (week < 0) return 0;
	else if (week > 19) return 19;
	else return week;
}
const week = getCurrentWeek();

//记录每周刷新课表次数
export function countTimes() {
	uni.getStorage({
		key: "countTimes",
		success: res => {
			let count = JSON.parse(res.data);
			//从0开始
			count[week]++;
			uni.setStorageSync("countTimes", JSON.stringify(count));
		}
	});
}
//局部重载方法 不过可以通过key++来替代
export function reMount(par, that, fn) {
	//局部重载方法
	//par 是控制重载组件的v-if的布尔参数
	par = false;
	that.$nextTick(function() {
		(par = true), fn();
	});
}
//节流函数
export function throttle(fn, {
	interval = 500
} = {}) {
	if (typeof fn != "function") return new Error("类型错误");
	const _self = fn;
	let timer,
		firstTime = true; //是否第一次调用
	return function(...args) {
		const _me = this;
		if (firstTime) {
			fn.apply(_me, args);
			return (firstTime = false);
		}
		if (timer) {
			return false;
		}
		timer = setTimeout(() => {
			clearTimeout(timer);
			timer = null;
			_self.apply(_me, args);
		}, interval);
	};
}
//通用的简单的state改变函数,并封装储存功能
export function ChangeAndStorageState(state, Playload) {
	if (Playload.stateName == undefined || Playload.stateName == "")
		throw new Error("请输入名称");
	let {
		stateName,
		value,
		storageName = stateName,
		toStorage = false,
		toStringify = false
	} = Playload;
	if (typeof value == "function") state[stateName] = value(state[stateName]);
	else state[stateName] = value;
	if (toStorage)
		uni.setStorageSync(
			storageName,
			toStringify ? JSON.stringify(value) : value
		);
}
//计算 形如11:20与11:00 字符串的分钟差(单位/min)
export function computedTimeString(front, back, character = "-") {
	front = front.split(":");
	front = front[0] * 60 + 1 * front[1];
	back = back.split(":");
	back = back[0] * 60 + 1 * back[1];
	switch (character) {
		case "-":
			return front - back;
			break;
		case "+":
			return front + back;
			break;
	}
}
//指定promise上限次数 直至成功或达到promise次数上限为止
export function rePromise({
	PromiseFunction,
	parms = [],
	times = 0,
	delay = 0
} = {}) {
	return new Promise(function(resolve, reject) {
		let countTimes = 0,
			error = [];
		(function nextPromise() {
			PromiseFunction(...parms)
				.then(res => {
					resolve(res);
				})
				.catch(res => {
					error.push(res);
					countTimes++ < times
						?
						setTimeout(nextPromise, delay) :
						reject(error[error.length - 1], error);
				});
		})();
	});
}
//去除rgba的透明度
export function removeOpacity(str) {
	str = str.split(",");
	str = str[0] + "," + str[1] + "," + str[2] + ")";
	return str;
}
//深度拷贝
export function deepCopy(obj) {
	if (typeof obj == "object") {
		let result = obj.constructor == Array ? [] : {};
		Object.keys(obj).forEach(item => (result[item] = deepCopy(obj[item])));
		return result;
	} else return obj;
}
//rgba转换为十六进制颜色
export function hexify(color) {
	var values = color
		.replace(/rgba?\(/, "")
		.replace(/\)/, "")
		.replace(/[\s+]/g, "")
		.split(",");
	var a = parseFloat(values[3] || 1),
		r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
		g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
		b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
	return (
		"#" +
		("0" + r.toString(16)).slice(-2) +
		("0" + g.toString(16)).slice(-2) +
		("0" + b.toString(16)).slice(-2)
	);
}
//查询dom参数
export function queryDom(Id, that, fun) {
	uni
		.createSelectorQuery()
		.in(that)
		.select("#" + Id)
		.boundingClientRect(fun)
		.exec();
}
//无限地查询dom参数 防止dom未渲染成功查询参数为空 直至查询参数不为空为止
export function reQueryDom(Id, that) {
	return new Promise((resolve, reject) => {
		rePromise({
				PromiseFunction: () =>
					new Promise((resolve, reject) => {
						queryDom(Id, that, res => {
							const {
								height,
								width,
								top,
								bottom
							} = res;
							if (height || width || top || bottom) {
								resolve(res);
							} else {
								reject("错误");
							}
						});
					}),
				parms: [],
				times: 100,
				delay: 100
			})
			.then(res => resolve(res))
			.catch(() => reject());
	});
}
//!!使带有success的异步函数变为promise并返回res 方便await使用
export function becomePromise(api, object = {}, failMessage) {
	// Object.keys(object)
	if (typeof api != "function") throw new Error("api is reqiured");
	return new Promise(function(resolve, reject) {
		object.success = res => resolve(res);
		object.fail = res => reject(!failMessage ? res : [res, failMessage]);
		api(object);
	});
}
//输入小数输出颜色值 用于成绩颜色分类
export function levelColors(data) {
	let colors = [
			"#f04864",
			"#1890ff",
			"#ffc0cb",
			"#ffc93b", ,
			"#2fc25b",
			"#2fc25b"
		],
		result = data * 10 - 6;
	if (data == 1) result = 4;
	else if (data == 0.6) result = 1;
	else if (data < 0.6) result = 0;
	else result = Math.ceil(result);
	return colors[result];
}
//未登录拦截 跳转至登录页面
export function interceptToLogin(
	router,
	content = "您还没有登录,是否跳转至登录页面"
) {
	uni.showModal({
		title: "提示",
		content: content,
		success: e =>
			e.confirm ?
			router.push({
				name: "login"
			}) :
			""
	});
}
//async 等待几秒后才执行
export function wait(time = 1000) {
	return new Promise(function(resolve, reject) {
		setTimeout(() => {
			resolve();
		}, time);
	});
}
const commonFun = {
	getStorage,
	getStorageSync,
	ChangeAndStorageState,
	becomePromise,
	rePromise,
	queryDom,
	reQueryDom,
	throttle,
	reMount,
	deepCopy,
	getCurrentWeek,
	getDate,
	computedTimeString,
	removeOpacity,
	countTimes,
	hexify,
	levelColors,
	interceptToLogin,
	wait
};
Vue.prototype.$commonFun = commonFun;
export default commonFun;
