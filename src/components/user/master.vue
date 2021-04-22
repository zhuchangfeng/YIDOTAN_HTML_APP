<template>
	<div class="master">
		<slot name="user-title"></slot>
		<div class="master__container">
			<div class="master__container--left">
				<div class="title">{{value.title}}</div>
				<div class="summary">{{value.summary}}</div>
			</div>
			<div class="master__container--right">
				<img v-lazy="value.cover" alt="产品图" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UserMaster',
	props: {
		value: {
			type: Object
		}
	}
}
</script>

<style lang="less" scoped>
@import url("~@/style/fuction.less");
.master {
	padding: 18.75px 20.833px;
	border-bottom: 8.32813px solid #f8f8f8;
	background-color: #fff;
	&__container {
		display: flex;
		align-items: center;
		&--left {
			flex: 1;
			.title {
				font-size: 17.7083px;
				color: #333;
				font-weight: 500;
				line-height: 30.2084px;
				.ellipsis(2);
			}
			.summary {
				color: #666;
				line-height: 25px;
				font-size: 14.5833px;
				.ellipsis(2);
			}
		}
		&--right {
			flex-basis: 125px;
			margin-left: 10.4167px;
			height: 101.031px;
			border-radius: 3.12504px;
			overflow: hidden;
			img {
				object-fit: cover;
			}
		}
	}
}
</style>
