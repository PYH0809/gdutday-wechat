<template>
	<view class="flex-column h-100 animation-fade">
		<custom />
		<schedule-content />
		<plugin-button />
		<back-button />
		<modal type="bottomModal" :once="true" ref="bottomModal">
			<plugin-add-course :class="bottomModalType == 'add' ? '' : 'display-none'" />
			<!-- <plugin-add-course v-if="bottomModalType == 'add'" /> -->
		</modal>
		<modal ref="modal" :once="true" :z="allModal.modal.z">
			<view :class="modalType == 'classDetail' ? '' : 'display-none'">
				<class-detail-modal />
			</view>
			<plugin-background v-if="modalType == 'background'" />
			<time-picker v-else-if="modalType == 'timePicker'" />
			<plugin-notice v-else-if="modalType == 'notice'" />
			<repeat v-else-if="modalType == 'repeat'" />
			<ask v-else-if="modalType == 'ask'" />
			<QR v-else-if="modalType == 'QR'" />
			<payWarning v-else-if="modalType == 'pay'" />
		</modal>
		<tip ref="tip" />
	</view>
</template>

<script>
import Vue from 'vue';
import { APIs } from '@/staticData/staticData.js';
import { getStorageSync, clearCountTimes, getCurrentWeek } from '@/commonFun.js';
import custom from '@/pages/schedule/custom/custom.vue';
import scheduleContent from '@/pages/schedule/schedule_content/schedule-content.vue';
import classDetailModal from '@/pages/schedule/schedule_content/schedule_components/schedule_week/week-class-detail-modal.vue';
import pluginButton from '@/pages/schedule/plugin_button/plugin-button.vue';
import backButton from '@/pages/schedule/back_button/back-button.vue';
import pluginBackground from '@/pages/schedule/plugin_button/plugin_item/plugin--skinfill-background.vue';
import pluginNotice from '@/pages/schedule/plugin_button/plugin_item/plugin-noticefill-notice.vue';
import pluginAddCourse from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course.vue';
import timePicker from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-item/plugin-add-course-item-components/plugin-time-picker.vue';
import repeat from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-item/plugin-add-course-item-components/plugin-repeat.vue';
import QR from '@/pages/extensions/libraryQR/QR.vue';
import payWarning from '@/pages/extensions/pay/pay-warning.vue';
import ask from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-class/plugin-add-course-class-components/plugin-add-course-class-ask.vue';
// import addItemButton from '@/pages/schedule/add-item-button.vue'
export default {
	components: {
		custom,
		scheduleContent,
		classDetailModal,
		pluginButton,
		backButton,
		pluginBackground,
		pluginNotice,
		pluginAddCourse,
		timePicker,
		repeat,
		QR,
		payWarning,
		ask
		// addCourse,
		// addItemButton,
	},
	// #ifdef MP
	created() {
		this.$on('changeShareParams', params => (this.shareParams = params));
		this.updateschoolOpening().catch(e => console.log(e));
	},
	onLoad(query) {
		uni.showShareMenu();
		this.update();
		this.checkOldUser();
		if (query.params !== undefined) {
			this.showModal({
				type: 'bottomModal',
				key: 'add'
			});
			this.$emit('addSchedule', JSON.parse(query.params));
		}
	},
	onShareAppMessage(res) {
		// 来自页面内转发按钮
		const isButton = res.from === 'button';
		return {
			title: isButton ? 'gdutday-转发课程' : '颜值超高的课表小程序-gdutday分享给你',
			path: `/pages/schedule/schedule${
				isButton ? '?params=' + JSON.stringify(this.shareParams) : ''
			}`
		};
	},
	onShareTimeline() {
		return {
			title: '颜值超高的课表小程序-gdutday分享给你'
		};
	},
	// #endif
	data() {
		return {
			shareParams: {},
			allModal: {
				modal: {
					is: 'classDetail',
					z: 9999
				},
				bottomModal: {
					is: '',
					z: 9999
				}
			}
		};
	},
	computed: {
		modalType() {
			return this.allModal.modal.is;
		},
		bottomModalType() {
			return this.allModal.bottomModal.is;
		}
	},
	provide() {
		return {
			Bus: this
		};
	},
	methods: {
		showModal({ key = '', type = 'modal' } = {}) {
			this.allModal[type].is = key;
			Object.keys(this.allModal).forEach((item, index) => {
				if (item != type && this.$refs[item].show) {
					this.allModal[type].z = this.allModal[item].z + 1;
				}
			});
			this.$nextTick(() => this.$refs[type].showModal());
		},
		hideModal(type = 'modal') {
			this.$refs[type].hideModal();
		},
		async update() {
			//版本更新提示
			// #ifdef MP-WEIXIN
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(async ({ hasUpdate }) => {
				if (!hasUpdate) {
					//没有新版本即已更新
					//版本更新内容提示
					const {
						data: { version }
					} = await this.$http.get(APIs.version);
					const beforeVersion = getStorageSync('version', '1.0.0');
					//如果版本号不匹配则说明未看过更新说明
					if (
						beforeVersion !== version &&
						(this.$account.ID !== '' || this.$education.ID !== '')
					) {
                        const {
                        	data: { detail }
                        } = await this.$http.get(APIs.versionDetail);
                        if (detail != '') {
                            let that = this;
                            console.log(detail);
                            uni.showModal({
                            	title: '更新说明',
                            	content: detail,
                            	confirmColor: this.$commonFun.hexify(this.$colorList.theme),
                            	confirmText: '查看详情',
                            	success(res) {
                            		if (res.confirm) {
                            			that.$Router.push({ name: 'mark' });
                            		}
                            	}
                            });
                        }
						uni.setStorageSync('version', version);
					}
				}
			});
			// #endif
		},
		// 检测开学日期
		async updateschoolOpening() {
			const {
				data: { schoolOpening }
			} = await this.$http.get(APIs.getSchoolOpening);
			var oldTime = uni.getStorageSync('schoolOpening');
			if (oldTime !== schoolOpening) {
				let content =
					'检测到本地开学日期与服务器最新开学时间不一致\n点击确定后更新开学日期并跳转至登录界面\n';
				let that = this;
				uni.showModal({
					showCancel: false,
					title: '提示',
					content: content,
					success: () => {
						uni.setStorageSync('schoolOpening', schoolOpening);
						clearCountTimes();
						this.$store.commit({
							type: 'changeStateofSchedule',
							stateName: 'week',
							value: getCurrentWeek()
						});
						Vue.prototype.$currentWeek = getCurrentWeek();
						this.$emit('changeSchoolOpening');
						that.$Router.push({ name: 'login' });
					}
				});
			}
		},
		checkOldUser() {
			var version = uni.getStorageSync('version');
			var id = this.$education.ID;
			if (id == '' && version != '1.0.0') {
				let that = this;
				uni.showModal({
					title: '提示',
					content:
						'检查到您是老用户,由于特殊原因gdutday转移使用教务系统登录,劳烦绑定教务系统登录,以保证正常使用',
					confirmColor: this.$commonFun.hexify(this.$colorList.theme),
					confirmText: '前往',
					success(res) {
						if (res.confirm) {
							that.$Router.push({ name: 'login' });
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
schedule-content {
	flex: 1;
}
</style>
