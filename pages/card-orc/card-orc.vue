<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">校园卡识别</block></cu-custom>
		<view class="mt-5 flex-row w-1 j-center">
			<view style="width: 650rpx; height: 413rpx">
				<image v-if="path" :src="path" mode="scaleToFill" class="w-1 h-1" />
				<camera
					v-else
					class="w-1 h-1"
					device-position="back"
					flash="off"
					resolution="low"
				/>
			</view>
		</view>
		<!-- :class="this.status === loading ? 'disabledBtn' : 'Btn'" -->
		<view
			class="mt-5 mx-5 h-40 ripple rounded-1 text-white text-center depth-2"
			@tap.stop="orc"
			:style="loading ? 'background-color:' + $colorList.white : $themeBackground"
		>
			{{ loading ? '识别中...' : path ? '重新识别' : '识别' }}
		</view>
		<tip ref="tip" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			context: null,
			loading: false,
			path: ''
		};
	},
	mounted() {
		this.context = uni.createCameraContext();
	},
	methods: {
		async orc() {
			if (this.loading) return;
			if (this.path) {
				this.path = '';
				return;
			}
			const { tempImagePath: path } = await this.$commonFun.becomePromise(
				this.context.takePhoto,
				{
					quality: 'low'
				}
			);
			// const {
			// 	tempFilePaths: [path]
			// } = await this.$commonFun.becomePromise(uni.chooseImage, { count: 1 }, 'chooseImage');
			this.path = path;
			try {
				this.loading = true;
				const base64 = (await this.$commonFun.becomePromise(
					uni.getFileSystemManager().readFile,
					{
						filePath: path, //选择图片返回的相对路径
						encoding: 'base64' //编码格式
					}
				)).data;
				// const {
				// 	result: { items }
				// } = await this.$commonFun.becomePromise(wx.cloud.callFunction, {
				// 	name: 'openapi',
				// 	data: {
				// 		action: 'ocrPrintedText',
				// 		img: base64
				// 	}

				const {
					data: { words_result }
				} = await this.$http.post(this.$APIs.orc, {
					image: base64
				});
				// });console.log(result);
				this.$refs.tip.show('识别成功');
				let msg = {
					college: '',
					name: '',
					ID: ''
				};
				console.log(words_result);
				const IDReg = /\d{10}$/;
				const collegeReg = /(院|系)(:|：)/;
				const nameReg = /名(:|：)/;
				words_result.forEach(({ words }) => {
					if (!msg.ID.length) {
						if (IDReg.test(words)) {
							msg.ID = words.match(IDReg)[0];
						}
					}
					if (!msg.college.length) {
						if (collegeReg.test(words)) {
							const f = words.indexOf(':') > -1 ? ':' : '：';
							const s = words.split(f);
							msg.college = s[s.length - 1];
						}
					}
					if (!msg.name.length) {
						if (nameReg.test(words)) {
							const f = words.indexOf(':') > -1 ? ':' : '：';
							const s = words.split(f);
							msg.name = s[s.length - 1];
						}
					}
				});
				console.log(msg);
			} catch (e) {
				console.log(e);
				this.$refs.tip.show('识别失败');
			} finally {
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="scss">
// .disabledBtn {
// 	color: #fff;
// 	background-color: #a0cfff;
// 	border-color: #a0cfff;
// }

// .Btn {
// 	color: #fff;
// 	background-color: #409eff;
// 	border-color: #409eff;
// }

.h-25 {
	height: 25px;
	line-height: 25px;
}

.h-40 {
	height: 40px;
	line-height: 40px;
}
</style>
