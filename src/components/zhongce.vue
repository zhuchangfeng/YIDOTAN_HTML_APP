<template>
	<div class="zc borderBottom">
		<div class="zc-type type-1">{{mtests.tag}}</div>
		<div class="zc-image">
			<img v-lazy="mtests.image" alt class="lazy" />
		</div>
		<div class="zc-bottom">
			<div class="zc-title">{{mtests.title}}</div>
			<div class="zc-group">
				<div class="zc-col">
					名额：
					<span>{{mtests.amounts}}</span>
				</div>
				<div class="zc-col">
					免单价格：
					<span>{{mtests.price}}元</span>
				</div>
				<div class="zc-col">
					状态：
					<span v-if="mtests.status=='4'">进行中</span>
					<span v-else-if="mtests.status=='0'" class="zc-over">已结束</span>
				</div>
				<div class="zc-col">
					已申请：
					<span>{{mtests.applicant_num}}人</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		mtests: {
			type: Object
		}
	}
};
</script>

<style lang="less" scoped>
.zc {
	min-height: 208.333px;
	position: relative;
	background-color: #f2f2f2;
	font-size: 12px;
	.zc-type {
		position: absolute;
		left: 15.625px;
		top: 15.625px;
		height: 21.875px;
		line-height: 21.875px;
		padding: 0 7.29164px;
		text-align: center;
		background-color: #333;
		color: #ffffff;
		z-index: 100;
		border-radius: 3.12504px;
		&.type-1 {
			background-color: #f8b434;
		}
	}
	.zc-image {
		padding-bottom: 56.26%;
		width: 100%;
		overflow: hidden;
		position: relative;
		img {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
	}
	.zc-bottom {
		padding: 9.375px 15.625px 10.417px 15.625px;
		background-color: #fff;
		.zc-title {
			line-height: 20.8334px;
			font-size: 15.625px;
			margin-bottom: 5.20828px;
		}
		.zc-group {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.zc-col {
				flex-basis: 50%;
				margin-top: 4.167px;
				font-size: 13px;
				color: #666;
				letter-spacing: normal;
				span {
					color: #333;
					&.zc-over {
						color: #dadbde;
					}
				}
			}
		}
	}
}
</style>