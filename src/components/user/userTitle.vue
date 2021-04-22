<template>
	<div class="dynamic__user">
		<div class="dynamic__user--avatar">
			<img v-lazy="user.user_pic" class="avatar-image lazy" />
			<img
				v-lazy="'https://h5.yidoutang.com/v4/public/identity_3.png'"
				alt
				class="avatar-identity lazy"
			/>
		</div>
		<div class="dynamic__user--info">
			<div class="info-name">
				{{user.author}}
				<div class="badge-logo" v-if="user.badge_logo">
					<img v-lazy="user.badge_logo" alt="badge" class="lazy" />
				</div>
			</div>
			<div class="time-status">
				<span class="time">{{user.date_diff}}</span>
				{{user.do_title}}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UserTitle',
	props: {
		user: {
			type: Object
		}
	}
}
</script>

<style lang="less" scoped>
.dynamic__user {
	display: flex;
	align-items: center;
	&--avatar {
		width: 37.5px;
		height: 37.5px;
		margin-right: 8.333px;
		position: relative;
		.avatar-image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
		.avatar-identity {
			width: 15.6094px;
			height: 15.6094px;
			display: inline-block;
			position: absolute;
			bottom: 0;
			left: 20px;
		}
	}
	&--info {
		flex: 1;
		.info-name {
			font-size: 14.5833px;
			.badge-logo {
				width: 15.609px;
				height: 15.609px;
				display: inline-block;
				vertical-align: middle;
			}
		}
		.time-status {
			font-size: 12px;
			color: #999;
		}
	}
}
</style>
