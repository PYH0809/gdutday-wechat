<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true">
			<block slot="content">研发中心工作室介绍</block>
		</cu-custom>
		<empty-tip v-if="article === ''" loading></empty-tip>
		<view><uParse :content="article" /></view>
	</view>
</template>

<script>
import marked from 'marked';
import uParse from '@/components/gaoyia-parse/parse.vue';
import { APIs } from '@/staticData/staticData.js';
import { introduction } from './office-introduction.js';
// const api = 'http://advert.domogo.top:5280/RDC/get/advert'
export default {
	components: {
		uParse
	},
	async created() {
		const markdown = introduction;
		// let markdown = ;
		// try {
		// const { data } = await this.$http.get(api).catch(()=>{
		// 	markdown = introduction
		// });
		// markdown = data;
		// } catch (e) {
		// 	if (+e.statusCode == 404) {
		// 		markdown = '# 没有数据';
		// 	}
		// }
		this.article = marked(markdown);
	},
	data() {
		return {
			article: ''
		};
	},
	methods: {}
};
</script>

<style></style>
