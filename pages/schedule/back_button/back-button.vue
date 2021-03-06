<template>
	<view>
		<block class="" v-for="(i, index) in 2" :key="index">
			<view
				:class="(index === 0 ? show : -show) > 0 ? 'back' : ''"
				class="position-fixed toBack leave"
			>
				<view
					@tap="toBack"
					:style="'background:#F5F3F6;color:' + $colorList.side"
					class="button flex j-center a-center depth-4 active-shadow"
				>
					<text
						:class="index === 0 ? '' : 'text-reverse'"
						class="cuIcon-back button-text"
					/>
				</view>
			</view>
		</block>
		<view v-if="isFreshman" :class="show === 0 ? 'back' : ''" class="position-fixed toBack leave">
			<view
				@tap="toOffice"
				:style="officeIcon"
				class="button flex j-center a-center depth-4 active-shadow bg-img"
			/>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	inject: ['Bus'],
	computed: {
		show() {
			// return (this.$store.state.schedule.week - this.$currentWeek) || (this.$store.state.schedule.day - this.$currentDay) ;
			return this.$store.state.schedule.week - this.$currentWeek;
		},
		officeIcon() {
			return `background-image:url('https://cdn.nlark.com/yuque/0/2020/jpeg/517627/1604407939923-13428294-4388-43c0-9e26-85a34c5560fb.jpeg')`;
		},
		// 是否是大一
		isFreshman() {
			return this.$store.getters.courseData[0].some(c =>
				c.some(course => course.name.includes('高等数学'))
			);
		}
	},
	methods: {
		toBack() {
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'week',
				value: this.$currentWeek
			});
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'day',
				value: this.$currentDay
			});
			this.Bus.$emit('reMountWeekContent');
			this.$isShake ? uni.vibrateShort() : '';
		},
		toOffice() {
			this.$Router.push({
				name: 'office'
			});
		}
	}
};
</script>

<style scoped lang="scss">
.button {
	height: 55px;
	line-height: 55px;
	width: 55px;
	border-radius: 50%;
	.button-text {
		font-size: 22px;
	}
}
.toBack {
	right: 90px;
	bottom: 35px;
	z-index: 100;
}
.text-reverse {
	transform: rotate(-180deg);
}
</style>
