<template>
	<div id="app" :style="{ 'padding-bottom': Tabbar, 'padding-top': TitileBar }">
		<!-- 这里是会被缓存的视图组件-->
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>

		<!-- 这里是不被缓存的视图组件-->
		<router-view v-if="!$route.meta.keepAlive"></router-view>

		<keep-alive>
			<Tabbar v-if="$route.meta.Tbshow"></Tabbar>
		</keep-alive>

		<keep-alive>
			<TitileBar
				v-if="$route.meta.TopTitlehide"
				:titleValue="$route.meta.TopName"
			></TitileBar>
		</keep-alive>
	</div>
</template>
<script>
import Tabbar from '@/components/Tabbar/Tabbar.vue'
import TitileBar from '@/components/TitleBar/TitleBar.vue'
export default {
	name: 'App',
	components: {
		Tabbar,
		TitileBar
	},
	computed: {
		Tabbar: {
			get() {
				return this.$route.meta.Tbshow ? '' : '0px'
			}
		},
		TitileBar: {
			get() {
				return this.$route.meta.TopTitlehide ? '' : '0px'
			}
		}
	}
}
</script>
<style lang="less">
#app {
	padding-bottom: 52px;
	box-sizing: border-box;
	padding-top: 52px;
	background-color: #f8f8f8;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>
