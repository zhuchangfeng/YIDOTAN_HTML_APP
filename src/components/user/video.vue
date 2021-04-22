<template>
	<div class="dynamic">
		<slot name="user-title"></slot>
		<div class="dynamic__box">
			<div class="dynamic__box--content">
				<pre>sssss</pre>
				<span class="content-all">全文</span>
			</div>
			<div class="dynamic__box--video">
				<div
					class="video-image"
					style="width: 124.905px; height: 222px; background-image: url(&quot;https://aimg.yidoutang.com/prod/content/202006/26/8a56bc/cf07d56da403434b080a5b0f550a3a78.mp4.p0.jpg!appmid&quot;);"
				>
					<div class="video-time"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Object
		}
	}
}
</script>

<style lang="less" scoped>
@import url("~@/style/fuction.less");
.dynamic {
	padding: 18.75px 20.833px;
	border-bottom: 8.32813px solid #f8f8f8;
	background-color: #fff;
	&__box {
		padding: 14.583px 0;
		&--content {
			color: #333;
			font-size: 15px;
			line-height: 25px;
			margin-top: 7px;
			pre {
				.ellipsis(3);
			}
			.content-all {
				color: #536892;
				margin-top: 10px;
				font-size: 13px;
			}
		}
		&--video {
			display: flex;
			flex-wrap: wrap;
			.video-image {
				display: block;
				border-radius: 2px;
				margin: 0 2.5px 2.5px 0;
				background-size: cover;
				background-position: 50%;
				position: relative;
			}
		}
	}
}
</style>
