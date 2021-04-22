<template>
	<div class="master master__item">
		<div class="master__user">
			<img
				v-lazy="related.user_info.avatar"
				:alt="related.user_info.user_name"
				class="master__user--identity"
			/>
			<div class="master__user--name">{{related.user_info.user_name}}</div>
		</div>
		<div class="master__container">
			<div class="master__container--left">
				<div class="title">{{related.subject}}</div>
				<div class="summary">{{related.summary}}</div>
			</div>
			<div class="master__container--right">
				<img v-lazy="related.cover" alt="产品图" class="lazy" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MasterItem',
	props: {
		related: {
			type: Object
		}
	}
}
</script>

<style lang="less" scoped>
@import url("../style/fuction.less");
.master {
	padding: 18.75px 0;
	&&__item {
		border-bottom: 1px solid #e6e6e6;
	}
	&__user {
		display: flex;
		padding-bottom: 12.5px;
		align-items: center;
		&--identity {
			width: 22.906px;
			height: 22.906px;
			border-radius: 11.4584px;
		}
		&--name {
			color: #333;
			margin-left: 8.333px;
		}
	}
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
