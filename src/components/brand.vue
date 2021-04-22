<template>
	<div class="brand inner-brand">
		<img v-lazy="brand.logo" class="brand__left lazy" />
		<div class="brand__center">
			<div class="brand__center--top auth-brand">
				<div class="brand-name">{{brand.name}}</div>
				<img v-lazy="'/static/image/brand-auth-icon.png'" class="auth-icon lazy" />
			</div>
			<div class="brand__center--bottom">
				<span class="description">{{brand.related_description}}</span>
			</div>
		</div>
		<img v-lazy="'/static/image/arrows.svg'" class="brand__right lazy" />
	</div>
</template>

<script>
export default {
	props: {
		brand: {
			type: Object,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
.brand {
	display: flex;
	box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1);
	padding: 13.5px 11px;
	box-sizing: border-box;
	align-items: center;
	&__left {
		width: 68.5px;
		height: 68.5px;
		border-radius: 2px;
		margin-right: 12px;
	}
	&__center {
		flex: 1;
		.auth-brand {
			.brand-name {
				max-width: 104.167px;
			}
		}
		&--bottom {
			.description {
				color: #666;
				font-size: 12.5px;
			}
		}
		&--top {
			display: flex;
			.brand-name {
				font-size: 17px;
				line-height: 25px;
				color: #333;
				display: inline-block;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.auth-icon {
				align-self: center;
				display: block;
				height: 14px;
				margin-left: 4px;
			}
		}
	}
	&__right {
		height: 13px;
		transform: rotate(180deg);
	}
}
</style>
