<template>
	<div id="zhongce">
		<div
			class="zhongce-top borderBottom clearfix"
			v-if="$route.meta.zhongceTop"
		>
			<router-link
				:to="{ path: '/zhongce/list' }"
				class="first_tab_nav"
				>众测商品</router-link
			>
			<router-link :to="{ path: '/zhongce/similar' }">测评文章</router-link>
		</div>

		<router-view v-if="!$route.meta.keepAlive"></router-view>

		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
	</div>
</template>

<script>
export default {}
</script>
<style lang="less" scoped>
#zhongce {
	.zhongce-top {
		width: 100%;
		background-color: #fff;
		// margin-bottom: 9.375px;
		font-size: 12px;
		font-family: PingFangSC-Light;
		display: flex;
		align-items: center;
		position: relative;
		a {
			flex: 1;
			position: relative;
			height: 42.7031px;
			line-height: 44.7916px;
			font-size: 14.5833px;
			color: #666;
			text-align: center;
			border-bottom: 2px solid #fff;
			&:hover {
				text-decoration: none;
			}
			&.router-link-exact-active.router-link-active {
				color: #ff8100;
				border-bottom: 2px solid #f3af34;
			}
		}
		.first_tab_nav {
			&::after {
				position: absolute;
				right: 0;
				top: 16.6666px;
				content: "";
				width: 1px;
				height: 15.6094px;
				background-color: #e0e0e0;
			}
		}
	}
}
</style>
