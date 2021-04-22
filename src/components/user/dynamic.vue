<template>
	<div class="dynamic" ref="dynamic">
		<slot name="user-title"></slot>
		<div class="dynamic__box">
			<div class="dynamic__box--mark">
				<div class="mark-wrap" v-if="value.subtitle">
					<img src="/static/image/tags.png" :alt="value.subtitle" class="wrap-image" />
					{{value.subtitle}}
				</div>
			</div>
			<div class="dynamic__box--content">
				<pre ref="content" :class="[!isOpen&&isAll?'all':'']">{{value.case_content}}</pre>
				<span class="content-all" v-if="isAll" @click="allFn">{{isOpen?'收起':'全文'}}</span>
			</div>
			<div class="dynamic__box--image" v-if="value.is_Image">
				<div
					class="image-item lazy"
					:style="styleValue"
					v-for="(item,index) in value.publishImage"
					:key="index"
					v-lazy:background-image="item.normal_image"
					:remainder="value.remainder"
				></div>
			</div>
			<div class="dynamic__box--brand" v-if="value.brand_name">
				<i class="fa fa-tag" aria-hidden="true"></i>
				{{value.brand_name}}
			</div>
		</div>
	</div>
</template>

<script>
import { getStyle } from '@/Plugin/dom/dom.js'
export default {
	props: {
		value: {
			type: Object,
			validator: function(value) {
				const {
					short_post: {
						tags_info: { topic_tag: topic_tag },
						data_ext: {
							related_authenticated_brand: related_authenticated_brand
						}
					}
				} = value
				if (topic_tag) {
					const { subtitle } = topic_tag
					value.subtitle = subtitle
				}
				if (related_authenticated_brand) {
					const { name } = related_authenticated_brand
					value.brand_name = name
				}
				return value
			}
		}
	},
	data() {
		return {
			isAll: false,
			isOpen: false,
			styleValue: {
				width: '108.333px',
				height: '108.333px'
			}
		}
	},
	created() {
		this.$nextTick(() => {
			const { content } = this.$refs
			if (content.getClientRects().length > 0) {
				const { width } = content.getClientRects()[0]
				const max = 3
				if (![Infinity, NaN].includes(width / max)) {
					this.$set(
						this.styleValue,
						'width',
						(width / max - 2.5 > 0 ? width / max - 2.5 : 0) + 'px'
					)
					this.$set(
						this.styleValue,
						'height',
						(width / max - 2.5 > 0 ? width / max - 2.5 : 0) + 'px'
					)
				}
			}
			if (content.getClientRects().length > 0) {
				const { height } = content.getClientRects()[0]
				const lineHeight =
					getStyle(content, 'line-height') &&
					getStyle(content, 'line-height').replace('px', '')
				if (![Infinity, NaN].includes(height / lineHeight)) {
					height / lineHeight > 3 && (this.isAll = true)
				}
			}
		})
	},
	methods: {
		allFn(e) {
			if (this.isOpen) {
				this.$nextTick(() => {
					const { dynamic } = this.$refs
					dynamic.scrollIntoView()
				})
			}
			this.isOpen = !this.isOpen
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
		&--mark {
			margin-top: 10px;
			height: 19px;
			.mark-wrap {
				font-size: 12px;
				color: #666;
				background: #f5f5f5;
				padding: 1px 10px 1px 3px;
				border-radius: 12px;
				display: inline-block !important;
				max-width: 100%;
				box-sizing: border-box;
				.ellipsis(1);
				.wrap-image {
					display: inline-block;
					vertical-align: text-top;
					width: 14px !important;
					height: 14px;
				}
			}
		}
		&--content {
			color: #333;
			font-size: 15px;
			line-height: 25px;
			margin-top: 7px;
			pre {
				&.all {
					.ellipsis(3);
				}
			}
			.content-all {
				color: #536892;
				margin-top: 10px;
				font-size: 13px;
			}
		}
		&--image {
			display: flex;
			flex-wrap: wrap;
			margin-top: 7px;
			.image-item {
				display: block;
				border-radius: 2px;
				margin: 0 2.5px 2.5px 0;
				background-size: cover;
				background-position: 50%;
				&[remainder="1"] {
					&:nth-child(2n + 2) {
						margin-right: 10px;
					}
				}
			}
		}
		&--brand {
			color: #ff8000;
			font-size: 12px;
			line-height: 14px;
			text-align: left;
			margin-top: 8.333px;
			overflow: hidden;
			.ellipsis(1);
			i {
				font-size: 14px;
				margin-right: 10px;
				transform: rotate(90deg);
			}
		}
	}
}
</style>
