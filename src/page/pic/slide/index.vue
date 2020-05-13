<template>
	<div id="slide">
		<div class="slide-title">
			<div class="slide-logo">
				<img v-lazy="'https://h5.yidoutang.com/v4/public/logo/logo-56.png'" class="lazy" alt />
			</div>
			<div class="slide-words">
				<p>一兜糖家居APP</p>
				<p>装修家居生活社区</p>
			</div>
			<div class="slide-download">
				<a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.yidoutang.app">下载</a>
			</div>
		</div>
		<div class="slide-user">
			<router-view></router-view>
		</div>
		<div class="slide-open">App 内打开</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
#slide {
	.slide-title {
		position: relative;
		z-index: 1;
		height: 52.08px;
		width: 100%;
		background-color: hsla(0, 0%, 100%, 0.96);
		padding: 0 14.5833px;
		display: flex;
		align-items: center;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		.slide-logo {
			width: 37.48px;
			height: 37.48px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
			border-radius: 10.42px;
			padding: 5.2px;
		}
		.slide-words {
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
		.slide-download {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			a {
				color: #fff;
				padding: 0 10.42px;
				font-size: 12px;
				background-color: #f8b434;
				border-radius: 26.1px;
				overflow: hidden;
				line-height: 26.1px;
			}
		}
	}
	.slide-open {
		border-radius: 26.0416px;
		width: 110.14px;
		line-height: 38.81px;
		background-color: #f8b434;
		font-size: 14px;
		text-align: center;
		position: fixed;
		bottom: 41.6667px;
		left: 0;
		right: 0;
		margin: 0 auto;
		color: #fff;
		z-index: 1;
	}
}
</style>