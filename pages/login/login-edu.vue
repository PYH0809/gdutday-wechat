<template>
	<view class="bg-white h-100">
		<cu-custom :isBack="true"><block slot="content">登录</block></cu-custom>
		<view class="flex-column j-center a-center w-1 " style="height: 200px;">
			<image style="height: 100px;width: 100px;" src="/static/logo.png" />
			<view class="hg text-lg">教务系统登录</view>
			<!-- <view class="text-lg">统一身份认证系统异常暂用教务系统</view>
			<view class="text-lg">教务系统无法自动刷新,刷新自行重新登录</view> -->
		</view>
		<!-- <myform></myform>-->
		<view class="flex-row j-center a-center">
			<form class="" style="width: 638rpx;">
				<myInput
					:maxlength="10"
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="text"
					v-model="ID"
					placeholder="学生卡号"
					tip="学号"
				/>
				<myInput
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="password"
					v-model="password"
					placeholder="教务系统密码"
					tip="教务系统密码"
					:isShowPass="true"
				/>
				<myInput
					:maxlength="4"
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					style="display:inline-block;"
					width="350rpx"
					type="text"
					v-model="verifyCode"
					placeholder="不显示点击查看遇到问题"
					tip="验证码"
				/>
				<image
					@tap="refreshYzm"
					:src="yzm"
					class="yzmImage"
					style="width: 288rpx;height: 100rpx;vertical-align: bottom;"
				/>
				<ErrorTip :showTip="showTip">{{ tip }}</ErrorTip>
				<!-- <view class="text-center"></view> -->
				<view :class="onceShake ? 'animation-shake' : ''" class="mt-3">
					<myButton
						:rotate="rotate"
						@buttonTap="tap"
						:text="'登录'"
						:bgColor="$colorList.theme"
					/>
				</view>
			</form>
		</view>
		<view class="text-gray text-center hg-60">登录即默认您同意用户服务条款</view>
		<view class="footer">
			<text @tap="privacy">用户服务条款</text>
			<text>|</text>
			<text @tap="toAbout">关于我们</text>
			<text>|</text>
			<text @tap="toProblem">登录遇到问题</text>
		</view>
	</view>
</template>

<script>
import polyfill from '@/js_sdk/base64/base64.min.js';
import CryptoJS from '@/js_sdk/crypto-js/crypto-js.min.js';
import myInput from '@/components/watch-input.vue';
import myButton from '@/components/watch-button.vue';
import ErrorTip from '@/components/form-error-tip.vue';
import { APIs } from '@/staticData/staticData.js';
export default {
	// components:{myform},
	components: { myInput, myButton, ErrorTip },
	data() {
		return {
			ID: '',
			verifyCode: '',
			password: '',
			rotate: false,
			onceShake: false,
			showTip: false,
			tip: '',
			yzm: '',
			session: ''
		};
	},
	mounted() {
		this.getImage();
		this.ID = this.$education.ID;
		this.password = this.$education.password;
        this.educationSystemErrorTip();
	},
	created() {},
	methods: {
        educationSystemErrorTip(){
            let now = new Date();
            let hour = now.getHours();
            if (hour >= 9 && hour <= 19) {
                return;
            }
            uni.showModal({
            	showCancel: false,
            	title: '提示',
            	content: '9-19点以外的时间,教务系统可能限制非校园网的访问,非校园网Wi-Fi验证码无法刷出即为限制访问。可在每日9-19点期间刷新或者登录。',
            	success: () => {}
            });
        },
		tap() {
			if (
				this.ID.length != 10 ||
				this.password.length < 6 ||
				this.verifyCode.length < 4
			) {
				this.onceShake = true;
				this.showTip = true;
				this.tip = '学号为10位 , 密码为教务系统密码,并填写验证码';
				setTimeout(() => {
					this.onceShake = false;
				}, 600);
				return;
			}
			this.showTip = false;
			this.rotate = true;
			this.request();
		},
		privacy() {
			this.$Router.push({ name: 'privacy' });
		},
		request() {
            let key = CryptoJS.enc.Utf8.parse(this.verifyCode+this.verifyCode+this.verifyCode+this.verifyCode);
            let srcs = CryptoJS.enc.Utf8.parse(this.password);
            let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            let password = encrypted.ciphertext.toString();
            let that = this;
            let session = this.session
            // this.$httpWithSession.setHttpWithSession()
            // console.log(this.$httpWithSession)
            this.$commonFun
            	.rePromise({
            		PromiseFunction: this.$http.post.bind(this.$http),
            		parms: ['https://jxfw.gdut.edu.cn/new/login', 
                            {                                
                                account:this.ID,
                                pwd:password,
                                verifycode:this.verifyCode,
                                                               
                            },
                            {
                                header: {
                                    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
                                    'Cookie':'JSESSIONID='+ session,
                                },
                            },
                            ],
            		times: 3
            	}).then(res=>{
                    this.rotate = false;
                    if (+res.data.code == 0) {                        
                        this.$store.commit({
                            type: 'changeStateofGlobal',
                            stateName: 'education',
                            value: { ID: this.ID, password: this.password },
                            toStorage: true,
                            toStringify: true
                        });                                                              
                        this.$commonFun.countTimes();
                        let promise1 = this.$commonFun.getGrade(session).then(res=>{
                                this.$store.commit('changeStateofGrade', {
                                    stateName: 'grade',
                                    value: res,
                                    toStorage: true,
                                    toStringify: true
                                });
                            });
                        let promise2 = this.$commonFun.getSchedule(session).then(res=>{
                                this.$store.commit({
                                    type: 'changeStateofSchedule',
                                    stateName: 'classData',
                                    value: res,
                                    toStorage: true,
                                    toStringify: true
                                });
                            })
                        let promise3 = this.$commonFun.getExam(session).then(res=>{
                                this.$store.commit({
                                    type: 'changeStateofSchedule',
                                    stateName: 'examNewData',
                                    value: res,
                                    toStorage: true,
                                    toStringify: true
                                });
                            })
                        let promise4 = this.$commonFun.getCampus(session).then(res=>{
                            this.$store.commit({
                                type: 'changeStateofSchedule',
                                stateName: 'campus',
                                value: res,
                                toStorage: true
                            });
                        })
                        let _this = this;
                        Promise.all([promise1,promise2,promise3,promise4]).then(res=>{
                            console.log("登录成功")
                            uni.showModal({
                                showCancel: false,
                                title: '您已经登录成功！',
                                content:
                                    '由于统一认证平台限制,暂时无法自动更新课表。若有需求,请前往『账户与数据』重新登录即可',
                                complete() {
                                    _this.$Router.replaceAll({ name: 'schedule' });
                                }
                            });
                        })
                    }else {
                        this.showTip = true;
                        this.tip = res.data.message;
                        this.refreshYzm();
                        return;
                    }
                }).catch(err=>{
                    this.rotate = false;
                    this.showTip = true;
                    this.tip = '网络连接错误 , 请稍后再试';
                    this.refreshYzm();
                    return;
                })
		},
		refreshYzm() {
			this.getImage();
			this.verifyCode = '';
		},
		toAbout() {
			this.$Router.push({ name: 'about' });
		},
		toProblem() {
			this.$Router.push({ name: 'problem' });
		},
		async getImage() {
			let time = new Date().getTime();
			let url = 'https://jxfw.gdut.edu.cn/yzm?d=' + time.toString();
			uni.request({
				method: 'GET',
				url: url,
				data: {},
				responseType: 'arraybuffer',
				header: {
					Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
					Connection: 'keep-alive',
					'content-type': 'image/jpeg'
				},
				success: res => {
					let cookie = res.header['Set-Cookie'];
					if (cookie) {
						let session = cookie.substring(
							cookie.indexOf('=') + 1,
							cookie.indexOf(';')
						);
						let imgs =
							'data:image/jpeg;base64,' +
							polyfill.btoa(
								new Uint8Array(res.data).reduce(
									(data, byte) => data + String.fromCharCode(byte),
									''
								)
							);
						this.yzm = imgs;
						this.session = session;
					} else {
						this.tip = '无法获取验证码，请联系开发者';
						this.showTip = true;
					}
				}
			});
		}
	},
	watch: {}
};
</script>
<style scoped>
.footer {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	color: rgba(0, 0, 0, 0.7);
	text-align: center;
	height: 40upx;
	line-height: 40upx;
}
.footer text {
	font-size: 14px;
	margin-left: 15upx;
	margin-right: 15upx;
}
</style>
