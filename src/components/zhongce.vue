<template>
	<div class="zc borderBottom">
		<div class="zc__type type-1">{{mtests.tag}}</div>
		<div class="zc__image">
			<img v-lazy="mtests.image" alt class="lazy" />
		</div>
		<div class="zc__bottom">
			<div class="zc__bottom--title">{{mtests.title}}</div>
			<div class="zc__bottom--group">
				<div class="col">
					名额：
					<span>{{mtests.amounts}}</span>
				</div>
				<div class="col">
					免单价格：
					<span>{{mtests.price}}元</span>
				</div>
				<div class="col">
					状态：
					<span :class="mtests.option.class">{{mtests.option.text}}</span>
				</div>
				<div class="col">
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
	},
	watch: {
		mtests: {
			handler: function(val) {
				if (Object.prototype.hasOwnProperty.call(val, 'status')) {
					const { status } = val
					switch (status) {
						case 0:
							val.option = {
								class: 'ready',
								text: '即将开始'
							}
							break
						case 1:
							val.option = {
								class: 'ing',
								text: '已结束'
							}
							break
						case 2:
							val.option = {
								class: 'over',
								text: '即将开始'
							}
							break
						case 4:
							val.option = {
								class: 'over',
								text: '体验中'
							}
							break
						default:
							val.option = {
								class: 'over',
								text: '未知'
							}
							break
					}
				}
			},
			immediate: true, // 是否初始化执行
			deep: true// 对象内部的属性监听，也叫深度监听
		}
	}
}
</script>

<style lang="less" scoped>
.zc {
	min-height: 208.333px;
	position: relative;
	background-color: #f2f2f2;
	font-size: 12px;
	&__type {
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
	&__image {
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
			object-fit: cover;
		}
	}
	&__bottom {
		padding: 9.375px 15.625px 10.417px 15.625px;
		background-color: #fff;
		&--title {
			line-height: 20.8334px;
			font-size: 15.625px;
			margin-bottom: 5.20828px;
		}
		&--group {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.col {
				flex-basis: 50%;
				margin-top: 4.167px;
				font-size: 13px;
				color: #666;
				letter-spacing: normal;
				span {
					color: #333;
					&.over {
						color: #dadbde;
					}
					&.ing {
						color: #f25f43;
					}
					&.ready{
						color: #f8b434;
					}
				}
			}
		}
	}
}
</style>
