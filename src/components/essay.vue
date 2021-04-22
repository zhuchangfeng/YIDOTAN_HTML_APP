<template>
	<div class="essay borderBottom" @click="handClick">
		<h2 class="essay__title Oline">{{value.title}}</h2>
		<div class="essay__bd">
			<div class="essay__bd--img">
				<img alt class="lazy" v-lazy="value.cover" />
			</div>
			<p>{{value.summary}}</p>
		</div>
		<div class="essay__ft">
			<div class="essay__ft--left">
				<div class="avatar">
					<div class="avatar-img">
						<router-link :to="'/user/'+value.authorid">
							<img alt class="lazy" v-lazy="value.user_pic" />
							<img
								v-lazy="'https://h5.yidoutang.com/v4/public/identity_3.png'"
								alt
								class="avatar-identity lazy"
							/>
						</router-link>
					</div>
					<div class="avatar-name">{{value.author}}</div>
					<div class="avatar-hr borderRight"></div>
				</div>
				<div class="view">
					<span class="view-icon">
						<i class="fa fa-eye" aria-hidden="true"></i>
					</span>
					<span class="view-num">{{value.click_num}}</span>
				</div>
				<!-- <div class="tag">
          <span class="tag-icon">v7</span>
          <span class="tag-name">sdsss</span>
				</div>-->
			</div>
			<div class="essay__ft--right">
				<span class="tag" :type="value.subtype" v-if="!_isEmpty(value.tagname)">{{value.tagname}}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			required: true
		}
	},
	methods: {
		handClick() {
			const obj = {
				subtype: this.value.subtype,
				id: this.value.id
			}
			if (!this._isEmpty(obj.subtype) && !this._isEmpty(obj.id)) {
				this.$emit('handGain', obj)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.essay {
	padding:  11.46px 12.5px;
	&.borderBottom {
		position: relative;
		&::after {
			position: absolute;
			box-sizing: border-box;
			content: "";
			display: block;
			width: 200%;
			height: 0;
			left: 0;
			bottom: -1px;
			transform: scale(0.5) translate(-50%, -50%);
			border-bottom: 1px solid #ccc;
			z-index: 1;
		}
	}
	&__title {
		font-size: 14px;
		margin-bottom: 11.46px;
		font-weight: 400;
		color: #212121;
	}
	&__bd {
		display: flex;
		&--img {
			width: 114.6px;
			height: 75.5px;
			margin-right: 12.5px;
			background-color: #f1f1f1;
		}
		p {
			flex: 1;
			font-size: 12px;
			color: #777;
		}
	}
	&__ft {
		margin-top: 11.46px;
		display: flex;
		&--left {
			flex: 1;
			display: flex;
			align-items: center;
			.avatar {
				display: flex;
				align-items: center;
				height: 21.875px;
				position: relative;
				&-img {
					width: 21.875px;
					height: 100%;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 6.25px;
					img {
						vertical-align: top;
					}
				}
				&-identity {
					width: 10.4063px;
					height: 10.4063px;
					position: absolute;
					bottom: -4px;
					left: 14px;
				}
				&-name {
					font-size: 12px;
					margin-right: 6.25px;
					color: #666;
				}
				&-hr {
					width: 1px;
					height: 64%;
					&.borderRight {
						position: relative;
						&::after {
							display: block;
							position: absolute;
							box-sizing: border-box;
							content: "";
							width: 0;
							height: 200%;
							top: 0;
							right: 0;
							transform: scale(0.5) translate(-50%, -50%);
							border-right: 1px solid #999;
							z-index: 1;
						}
					}
				}
			}
			.view {
				font-size: 12px;
				color: gray;
				&-icon {
					margin-left: 6.25px;
				}
				&-num {
				}
			}
			.tag {
				font-size: 12px;
				color: gray;
				&-icon {
					margin-left: 6.25px;
				}
				&-name {
				}
			}
		}
		&--right {
			text-align: right;
			.tag {
				&[type="8"] {
					border: 1px solid #ff922a;
					color: #ff922a;
				}
				&[type="0"] {
					border: 1px solid #ff8098;
					color: #ff8098;
				}
				line-height: 34px;
				display: inline-block;
				color: #ff922a;
				border: 1px solid #ff922a;
				border-radius: 10px;
				padding: 0 8px;
				font-size: 18.75px;
				transform: scale(0.5);
				transform-origin: center right;
			}
		}
	}
}
</style>
