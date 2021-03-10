<template>
	<view>
		<modal ref="modal" :maskForce="true">
			<comfirm
				@success="success"
				@fail="fail"
				title="输入验证码以更新"
				:confirmText="confirmText"
				:comfirmColor="!loading ? '' : 'background-color:rgba(184,184,184,1);'"
			>
				<view class="text-center">
					<image
						@tap="refreshYzm"
						:src="yzm"
						class="text-center"
						style="width: 288rpx;height: 150rpx"
					/>
				</view>
				<myInput
					:maxlength="4"
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="text"
					v-model="verifyCode"
					placeholder="如验证码不显示验请点击查看遇到问题"
					tip="验证码"
				></myInput>
				<ErrorTip :showTip="showTip">{{ tip }}</ErrorTip>
			</comfirm>
		</modal>
	</view>
</template>

<script>
import polyfill from '@/js_sdk/base64/base64.min.js';
import { APIs } from '@/staticData/staticData.js';
import myInput from '@/components/watch-input.vue';
import ErrorTip from '@/components/form-error-tip.vue';
import CryptoJS from '@/js_sdk/crypto-js/crypto-js.min.js';
export default {
	components: { myInput, ErrorTip },
	inject: ['Bus'],
	props: {
		page: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			confirmText: '更新',
			loading: false,
			ID: '',
			password: '',
			showTip: false,
			tip: '',
			yzm: '',
			session: '',
			verifyCode: ''
		};
	},
	onLoad() {},
	methods: {
		showModal() {
			this.getImage();
			(this.ID = this.$education.ID),
				(this.password = this.$education.password),
				this.$refs.modal.showModal();
		},
		hideModal() {
			this.showTip = false;
			this.tip = '';
			this.verifyCode = '';
			this.$emit('hideModal');
			this.$refs.modal.hideModal();
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
				}
			});
		},
		refreshYzm() {
			this.getImage();
			this.verifyCode = '';
		},
		async request() {
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
			                if (_this.page == 'exam') {
                                _this.Bus.$emit('changeExamNewData');
                            }
                            if (_this.page == 'grade') {
                                console.log('grade');
                                _this.Bus.$emit('changeGradeConfig');
                            }
                            _this.hideModal();
                            uni.showToast({
                                title: '更新成功',
                                icon: 'success'
                            });                            
                            _this.loading = false;
                            _this.confirmText = '更新';
			            })
			        }else {
			            this.showTip = true;
			            this.tip = res.data.message;
			            this.refreshYzm();                        
                        this.loading = false;
                        this.confirmText = '更新';
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
		success() {
			if (this.verifyCode.length < 4) {
				this.showTip = true;
				this.tip = '填写4位验证码';
				return;
			}
			if (this.loading == false) {
				this.loading = true;
				this.confirmText = '更新中..';
				this.request();
			}
		},
		fail() {
			this.hideModal();
			this.$emit('fail')
		}
	}
};
</script>

<style></style>
