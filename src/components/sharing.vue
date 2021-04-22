<template>
	<div class="sharing">
		<div class="sharing__body">
			<div class="sharing__body--left">
				<img v-lazy="sharing.sharing.image" class="cover lazy" />
			</div>
			<div class="sharing__body--right">
				<p class="title">{{ sharing.sharing.title }}</p>
				<div class="sharing__brand">
					<img v-lazy="sharing.brand.logo" class="sharing__brand--logo lazy" />
					<div class="sharing__brand--name">
						<span class="name">{{ sharing.brand.name }}</span>
						<img
							v-lazy="'/static/image/brand-auth-icon.png'"
							class="auth-icon lazy"
						/>
					</div>
				</div>
				<div class="price">
					<p>￥{{ sharing.sharing.price }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		sharing: {
			type: Object,
			required: true,
			validator: function(value) {
				return value.brand && value.sharing
			}
		}
	}
}
</script>

<style lang="less" scoped>
.sharing {
	box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	padding: 0 15.6px;
	margin: 10.4px 0;
	&__body {
		display: flex;
		padding: 17.8px 0;
		align-items: center;
		&--left {
			margin-right: 10px;
			position: relative;
			.cover {
				width: 60.4px;
				height: 60.4px;
				display: block;
				overflow: hidden;
				border-radius: 1.7px;
			}
		}
		&--right {
			flex: 1;
			max-width: calc(100% - 70.4px);
			.title {
				color: #333;
				font-weight: 500;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 16.6666px;
				line-height: 24px;
				margin-bottom: 6.25px;
			}
			.sharing__brand {
				flex: 1;
				align-items: center;
				margin-bottom: 6.25px;
				display: flex;
				&--logo {
					width: 20px;
					height: 20px;
					margin-right: 6px;
				}
				&--name {
					display: flex;
					align-items: center;
					flex: 1;
					font-size: 12px;
					.name {
						font-size: 12px;
						line-height: 12px;
						color: #333;
						display: inline-block;
						max-width: 20.98rem;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
				.auth-icon {
					width: 44px;
					height: 13px;
					margin-left: 4px;
				}
				&&--authed {
					.name {
						max-width: 204.16px !important;
					}
				}
			}
			.price {
				display: flex;
				justify-content: space-between;
				align-items: center;
				button {
					font-size: 12px;
					line-height: 12px;
					color: #ff8000;
					border: 1px solid #ff8000;
					padding: 3.65px 8.33px;
					border-radius: 0.98rem;
					background: #fff;
					&.unauth {
						color: #333;
						border-color: #999;
					}
				}
				p {
					font-size: 14px;
					color: #ff5900;
					align-self: center;
					line-height: 14px;
				}
			}
		}
	}
}
</style>
