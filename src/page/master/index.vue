<template>
	<div id="master" ref="master">
		<div class="master-title" v-if="$route.meta.masterTop">
			<div class="master-logo">
				<img v-lazy="'https://h5.yidoutang.com/v4/public/logo/logo-56.png'" class="lazy" alt />
			</div>
			<div class="master-words">
				<p>一兜糖家居APP</p>
				<p>装修家居生活社区</p>
			</div>
			<div class="master-download">
				<a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.yidoutang.app">下载</a>
			</div>
		</div>
		<div class="master-open" v-if="$route.meta.masterBottom">App 内打开</div>
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>

		<!-- 这里是不被缓存的视图组件-->
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
#master {
	.master-title {
		position: relative;
		z-index: 1;
		height: 52.08px;
		width: 100%;
		background-color: hsla(0, 0%, 100%, 0.96);
		padding: 0 14.5833px;
		display: flex;
		align-items: center;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		.master-logo {
			width: 37.48px;
			height: 37.48px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
			border-radius: 10.42px;
			padding: 5.2px;
		}
		.master-words {
			margin-left: 14.5833px;
			p:first-child {
				font-size: 15.625px;
				color: #4d4d4d;
				font-weight: 700;
			}
			p:last-child {
				color: rgb(193, 193, 193);
				font-size: 12px;
				margin-top: 3.13px;
			}
		}
		.master-download {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			a {
				padding: 0 10.42px;
				font-size: 12px;
				background-color: #ffda46;
				border-radius: 26.1px;
				overflow: hidden;
				line-height: 26.1px;
			}
		}
	}
	.master-open {
		border-radius: 26.0416px;
		width: 110.14px;
		line-height: 38.81px;
		background-color: #ffda46;
		font-size: 14px;
		text-align: center;
		position: fixed;
		bottom: 41.6667px;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 1;
	}
}
</style>
