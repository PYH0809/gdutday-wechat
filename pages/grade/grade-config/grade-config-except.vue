<template>
	<view class="bg-white flex-column" style="min-height: 100vh;">
		<cu-custom isBack>
			<template v-slot:content>
				排除课程
			</template>
		</cu-custom>
		<block v-if="grade.length === 0"><empty-tip /></block>
		<view class="mx-5 mt-2">
			<view class="flex-row j-sb text-lg">
				<text>科目</text>
				<text>是否排除</text>
			</view>
			<block v-for="(item, index) in grade" :key="index">
				<view
					class=" flex-row w-1 a-center animation-fade animation-3"
					:style="'animation-delay:' + Math.log10(index + 1) * 150 + 'ms'"
					style="height: 60px;"
				>
					<view class="flex-row a-center flex-1">
						<view
							class="flex-column h-1 j-around flex-1"
							style="height: 60px;"
						>
							<text class="text-df text-cut">{{ item.examName }}</text>
							<view :style="'color:' + item.color">
								{{ item.examPole }}
							</view>
						</view>
					</view>
					<switch
						:checked="exceptGrade.includes(item.examName)"
						@change="optionChange($event, index)"
						:color="exceptGrade.includes(item.examName) ? $colorList.theme : '#8799A3'"
					/>
					<!-- <view class="mr-5" style="width: 96rpx;">
								<view class="text-right text-df" :style="'color:' + item.color">{{ item.examPole }}</view>
								<view class="text-right text-sm" style="color: #C3C3C3;">{{ item.credit + '学分' }}</view>
							</view> -->
				</view>
			</block>
		</view>
		<!-- <swiper-item><view class="swiper-item"> -->
		<!-- <block v-if="addClassDataLength === 0">
				<empty-tip />
			</block> -->
		<!-- </view></swiper-item> -->
		<tip ref="tip" />
	</view>
</template>

<script>
function delArrVal(arr, val) {
	//查找数组中的某个值并全部删除    第一个参数是查找的数组 第二个参数是删除的值
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			i--;
		}
	}
	return arr;
}
export default {
	data() {
		return {};
	},
	computed: {
		grade() {
			return [...this.$store.getters.gradeAddColor].reverse();
		},
		exceptGrade() {
			return this.$store.state.grade.exceptGrade;
		},
		// filterGrade() {
		// const result = [...this.grade].reverse()
		// return result;
		// },
	},
	methods: {
		optionChange(e, i) {
			const value = [...this.exceptGrade];
			const name = this.grade[i].examName;
			if (e.detail.value) {
				value.push(name);
			} else {
				delArrVal(value, name);
			}
			this.$isShake ? uni.vibrateShort() : '';
			this.$store.commit({
				type: 'changeStateofGrade',
				stateName: 'exceptGrade',
				value: value,
				toStorage: true,
				toStringify: true
			});
		}
	}
};
</script>

<style></style>
