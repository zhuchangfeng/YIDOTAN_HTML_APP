<template>
	<div id="new">
		<div class="new-title">
			<div class="new-logo">
				<img
					v-lazy="'https://h5.yidoutang.com/v4/public/logo/logo-56.png'"
					class="lazy"
					alt
				/>
			</div>
			<div class="new-words">
				<p>一兜糖家居APP</p>
				<p>装修家居生活社区</p>
			</div>
			<div class="new-download">
				<a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.yidoutang.app">下载</a
				>
			</div>
		</div>
		<div class="new-open" @click="message">App 内打开</div>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	methods: {
		message() {
			this.$msgbox({
				title: '需要确认',
				message: '您是否愿意以55美元去换取一个吻？确认一下是否愿意呢？',
				confirmButtonText: '购买',
				showCancelButton: true,
				cancelButtonText: '取消',
				rowButton: true
			}).then((r) => {
				this.$message({
					message: r
				})
			})
		}
	}
}
</script>

<style lang="less" scoped>
#new {
	.new-title {
		height: 52.08px;
		position: relative;
		width: 100%;
		background-color: hsla(0, 0%, 100%, 0.96);
		padding: 0 14.5833px;
		display: flex;
		align-items: center;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		.new-logo {
			width: 37.48px;
			height: 37.48px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
			border-radius: 10.42px;
			padding: 5.2px;
		}
		.new-words {
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
		.new-download {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			a {
				padding: 0 10.42px;
				font-size: 12px;
				background-color: #f8b434;
				border-radius: 26.1px;
				overflow: hidden;
				line-height: 26.1px;
			}
		}
	}
	.new-open {
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
		z-index: 1;
		user-select: none;
		cursor: pointer;
	}
}
</style>
