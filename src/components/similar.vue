<template>
	<div class="similar">
		<h2>{{articles.subject}}</h2>
		<div class="similar-bd">
			<div class="bd-img">
				<img alt="描述图片" class="lazy" v-lazy="articles.feature" />
			</div>
			<p>{{articles.summary|handleText}}</p>
		</div>
		<div class="similar-ft">
			<div class="ft-avatar">
				<div class="avatar-img">
					<img alt="用户头像" class="lazy" v-lazy="articles.user_pic" />
				</div>
				<div class="avatar-name">{{articles.author}}</div>
			</div>
			<div class="ft-data">
				<div class="data-item">
					<i class="fa fa-eye" aria-hidden="true"></i>
					<span>{{articles.views}}</span>
				</div>
				<div class="data-item" v-if="articles.sharings">
					<i class="fa fa-tag" aria-hidden="true"></i>
					<span>{{articles.sharings}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		articles: {
			type: Object,
			required: false
		}
	},
	filters: {
		//处理文字
		handleText(value) {
			const text = value.substring(0, 60) + "...";
			return text;
		}
	}
};
</script>

<style lang="less" scoped>
.similar {
	background-color: #fff;
	h2 {
		font-size: 13.8021px;
		padding: 11.458px 0;
		color: #212121;
	}
	.similar-bd {
		display: flex;
		align-content: center;
		color: #777;
		height: 75.516px;
		.bd-img {
			height: 100%;
			flex-basis: 114.578px;
			background-color: #f1f1f1;
			margin-right: 12.5px;
		}
		p {
			flex: 1;
			font-size: 12px;
		}
	}
	.similar-ft {
		padding: 10.4167px 0 13.0208px 0;
		display: flex;
		justify-content: space-between;
		.ft-avatar {
			font-size: 12px;
			display: flex;
			align-items: center;
			.avatar-img {
				margin-right: 12.5px;
				width: 21.875px;
				height: 21.875px;
				border-radius: 50%;
				overflow: hidden;
			}
			.avatar-name {
				line-height: 23.9583px;
				font-size: 12px;
				color: #666;
			}
		}
		.ft-data {
			display: flex;
			align-items: center;
			font-size: 12px;
			color: #cbcbcb;
			.data-item {
				margin-left: 5.208px;
				i {
					font-size: 12.5px;
				}
			}
		}
	}
}
</style>