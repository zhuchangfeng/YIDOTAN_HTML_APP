<template>
	<div class="slide-user" v-loading.body="isLoading">
		<div class="swiper-container">
			<div class="swiper-wrapper">
				<div
					class="swiper-slide"
					v-for="(item, index) in banner"
					:key="'slide' + index"
					:style="{
						backgroundColor: 'rgb(225 225 225)',
						height: item.full_h + 'px',
						width: item.full_w + 'px',
					}"
				>
					<img :data-src="item.normal_image" class="swiper-lazy" />
					<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>

					<transition
						name="op"
						v-for="(tag, key) in item.data.tag_spots"
						:key="'tage' + key"
					>
						<div
							:class="['swiper-tag', tag.right ? 'swiper-tag-right' : '']"
							:style="tag.style"
							v-show="showTages"
							ref="tag"
						>
							<div class="swiper-tag-dot">
								<div class="tag-dot-inner"></div>
							</div>
							<div class="swiper-tag-line"></div>
							<div class="swiper-tag-content">{{ tag.keyword }}</div>
						</div>
					</transition>
				</div>
			</div>
			<div class="swiper-count" v-if="banner.length > 0">
				{{ index + 1 }} / {{ banner.length }}
			</div>
		</div>

		<div class="user-info">
			<div class="user-wrap" ref="userWrap">
				<div class="user-left">
					<div class="user-avatar">
						<img v-lazy="user.user_pic" :alt="user.user_name" />
					</div>
					<div class="user-name">{{ user.user_name }}</div>
				</div>
				<div class="user-right">
					<div class="user-attention">+ 关注</div>
				</div>
			</div>

			<div class="user-content">
				<div class="content-box">
					<pre
						v-html="common.content"
						ref="content"
						:class="[!isOpen && isAll ? 'all' : '']"
					></pre>
					<span class="content-all" v-if="isAll" @click="allFn">{{
						isOpen ? "收起" : "全文"
					}}</span>
				</div>

				<div class="user-statistics">
					<div class="statistics-item">
						<i aria-hidden="true" class="fa fa-thumbs-o-up"></i>
						<span>{{ common.zan_num }}</span>
					</div>
					<div class="statistics-item">
						<i aria-hidden="true" class="fa fa-commenting-o"></i>
						<span>{{ common.comment_num }}</span>
					</div>
					<div class="statistics-item">
						<i aria-hidden="true" class="fa fa-star-o"></i>
						<span>{{ common.like_num }}</span>
					</div>
				</div>
			</div>

			<div class="user-latestComments">
				<div class="latestComments-title">最新评论</div>
				<comment
					v-for="(item, index) in comments"
					:key="index"
					:comment="item"
				></comment>
			</div>

			<div class="user-scenes">
				<div class="scenes-title">相关推荐</div>
				<div id="scenes">
					<div
						class="scenes-padding"
						v-for="(item, index) in pics"
						:key="index"
						ref="scenes"
					>
						<router-link class="scenes-item" to>
							<div
								class="scenes-pic"
								:style="{ backgroundColor: getColor() }"
								:img_h="item.data.info.img_h"
								:img_w="item.data.info.img_w"
								ref="pic"
							>
								<img
									v-lazy="item.small_image"
									:alt="'背景图' + index"
									class="lazy"
								/>
								<i
									class="fa fa-tag"
									aria-hidden="true"
									v-if="item.tag_jump"
								></i>
							</div>
							<div class="scenes-bottom">
								<div class="scenes-content" v-if="item.case_content">
									{{ item.case_content }}
								</div>
								<div class="scenes-mask" v-if="item.subtitle">
									<div class="mask-wrap">
										<img
											class="wrap-img"
											src="/static/image/tags.png"
											alt="tags"
											srcset
										/>
										{{ item.subtitle }}
									</div>
								</div>
								<div class="scenes-avatar">
									<div
										class="avatar-img"
										:style="{ backgroundColor: getColor() }"
									>
										<img
											v-lazy="item.user_pic"
											:alt="item.user_name"
											class="lazy"
										/>
									</div>
									<div class="avatar-name">{{ item.user_name }}</div>
									<div class="avatar-collect">
										<i class="fa fa-star-o" aria-hidden="true"></i>
										{{ item.favtimes }}
									</div>
								</div>
							</div>
						</router-link>
					</div>
				</div>
				<div class="scenes-more">
					<div class="more-bd fourColor0" @click="getPics()">
						{{ loadingText }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getAlbumDetail, getSimilar } from '@/api/api.js'
import { randomColor, isEmpty } from '@/Plugin/utils/index.js'
import { setStyle, getStyle } from '@/Plugin/dom/dom.js'
import comment from '@/components/comment'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
	data() {
		return {
			pics: [], // 轮播图数据
			isLoading: true, // 是否在加载中
			params: {
				space: '',
				style: '',
				part: '',
				soft: '',
				order: '0',
				sharing: '0'
			}, // 分类
			common: {}, // 用户简介
			user: {}, // 用户信息
			index: 0, // 轮播图索引
			showTages: true, // 是否显示标签
			comments: [], // 评论
			banner: [], // 轮播图
			page: 1, // 页数
			updateLength: 0,
			isAll: false,
			isOpen: false,
			even: {
				// 偶数
				maxHeight: 0,
				lastDom: null
			},
			odd: {
				// 奇数
				maxHeight: 0,
				lastDom: null
			},
			loadingText: '', // 加载文字
			isMore: true // 是否可以加载操作
		}
	},
	components: {
		comment
	},
	watch: {
		pics() {
			this.$nextTick(() => {
				if (Object.keys(this.$refs).length > 0) {
					const result = this.$refs.pic.slice(-this.updateLength)
					const scenes = this.$refs.scenes.slice(-this.updateLength)
					// 默认列数
					const col = 2
					if (this._getType(result) === 'array') {
						result.forEach((item, index) => {
							const img_h = item.getAttribute('img_h')
							const img_w = item.getAttribute('img_w')
							const width = getStyle(item, 'width')
							if (typeof width === 'string') {
								const height = (img_h / img_w) * width.replace('px', '')
								if (img_h && img_w) {
									setStyle(item, 'height', height + 'px')
								}
							}
						})
					}
					if (this._getType(scenes) === 'array') {
						scenes.forEach((item, index) => {
							// 奇数
							if ((index + 1) % col) {
								setStyle(item, 'top', this.odd.maxHeight + 'px')
								setStyle(item, 'left', '0px')
								this.odd.lastDom = item
								this.odd.maxHeight += item.getClientRects()[0].height
							} else {
								// 偶数
								const preScenes = scenes[
									index - 1 === -1 ? 0 : index - 1
								].getClientRects()[0].width
								setStyle(item, 'left', preScenes + 'px')
								setStyle(item, 'top', this.even.maxHeight + 'px')
								this.even.lastDom = item
								this.even.maxHeight += item.getClientRects()[0].height
							}
						})
						// even:偶数  odd：基数
						if (this.even.maxHeight >= this.odd.maxHeight) {
							const lastDOMRectList = this.even.lastDom.getClientRects()[0]
							if (
								this.odd.maxHeight + lastDOMRectList.height <
								this.even.maxHeight
							) {
								setStyle(this.even.lastDom, 'left', '0px')
								setStyle(this.even.lastDom, 'top', this.odd.maxHeight + 'px')
								this.even.maxHeight =
									this.even.maxHeight - lastDOMRectList.height
								this.odd.maxHeight =
									this.odd.maxHeight + lastDOMRectList.height
							}
						} else {
							const lastDOMRectList = this.odd.lastDom.getClientRects()[0]
							if (
								this.even.maxHeight + lastDOMRectList.height <
								this.odd.maxHeight
							) {
								setStyle(
									this.odd.lastDom,
									'left',
									lastDOMRectList.width + 'px'
								)
								setStyle(this.odd.lastDom, 'top', this.even.maxHeight + 'px')
								this.odd.maxHeight =
									this.odd.maxHeight - lastDOMRectList.height
								this.even.maxHeight =
									this.even.maxHeight + lastDOMRectList.height
							}
						}
						const max = Math.max(this.even.maxHeight, this.odd.maxHeight)
						setStyle(document.getElementById('scenes'), 'height', max + 'px')
					}
				}
			})
		}
	},
	methods: {
		async getDetail() {
			const { params } = this.$route
			const { data } = await getAlbumDetail({ params: params })
			if (data?.success_code === 200) {
				const banner = data?.data?.pics
				const common = data?.data?.common
				const comments = data?.data?.comment_preview?.comments
				if (this._getType(banner) === 'array') {
					this.banner = [...banner]
					banner.forEach((element) => {
						const {
							data: {
								tag_spots: tag_spots,
								info: { img_h: img_h, img_w: img_w }
							}
						} = element
						const full_w = document.body.getClientRects()?.[0].width
						if (img_h && img_w && full_w) {
							element.full_w = full_w
							element.full_h = (img_h / img_w) * full_w
							if (this._getType(tag_spots) === 'array') {
								tag_spots.forEach((item, index) => {
									const { x, y } = item
									if (x && y) {
										this.$nextTick(() => {
											const tag_h = this.$refs.tag[index].getClientRects()?.[0]
												.height
											const tag_w = this.$refs.tag[index].getClientRects()?.[0]
												.width
											if (tag_h && tag_w) {
												item.style = {
													...((element.full_h / img_h) * y + tag_h >=
													element.full_h
														? { bottom: '0px' }
														: y > 0
															? { top: (element.full_h / img_h) * y + 'px' }
															: { top: '0px' }),
													...((element.full_w / img_w) * x >= element.full_w / 2
														? {
															right:
																	(element.full_w / img_w) * x >= element.full_w ? '0px' : element.full_w - (element.full_w / img_w) * x + 'px' }
														: {
															left: (element.full_w / img_w) * x + 'px' })
												}
											}
										})
										item.right =
											(element.full_w / img_w) * x >= element.full_w / 2
									}
								})
							}
						}
					})
					this.$nextTick(() => {
						const _this = this
						new Swiper('.swiper-container', {
							autoplay: false, // 等同于以下设置
							// observer: true, //修改swiper的子元素时
							observeParents: true, // 当Swiper的父元素变化时
							lazy: true,
							autoHeight: true, // 高度随内容变化
							// slidesPerView: "auto",
							// watchSlidesVisibility: true,
							// preventClicksPropagation: false,
							on: {
								transitionEnd: function() {
									const index = this.activeIndex
									if (_this.index !== index) {
										_this.index = index
									}
								},
								click: function() {
									_this.showTages = !_this.showTages
								}
							}
						})
						if (this.isLoading) {
							this.isLoading = false
						}
					})
				}
				if (this._getType(common) === 'object') {
					const { user } = common
					if (this._getType(user) === 'object') {
						this.user = { ...user }
					}
					this.common = { ...common }
					this.checkLine()
				}
				if (this._getType(comments) === 'array') {
					this.comments = [...comments]
				}
			}
		},
		getRedirectedFrom() {
			let { redirectedFrom } = this.$route
			const length = Object.keys(this.params).length
			let redirectArr = []
			if (redirectedFrom) {
				redirectArr = [...redirectedFrom.split('/')]
				sessionStorage.setItem('redirectedFrom', redirectedFrom)
			} else {
				redirectedFrom = sessionStorage.getItem('redirectedFrom')
				if (!isEmpty(redirectedFrom)) {
					redirectArr = [...redirectedFrom.split('/')]
				}
			}
			const arrLength = redirectArr.length
			if (arrLength >= length) {
				const paramsArr = redirectArr.slice(-length)
				Object.keys(this.params).forEach((item, index) => {
					this.params[item] = paramsArr[index]
				})
			}
		},
		deleteRedirectedFrom() {
			const redirectedFrom = sessionStorage.getItem('redirectedFrom')
			if (!isEmpty(redirectedFrom)) {
				sessionStorage.removeItem('redirectedFrom')
			}
		},
		getColor: randomColor,
		async getPics() {
			this.loadingText = '加载中...'
			if (!this.isMore) return
			this.isMore = false
			const { id } = this.$route.params
			const { data } = await getSimilar({
				params: {
					match_id: id,
					page: this.page
				}
			})
			if (data?.success_code === 200) {
				const pics = data?.data?.pics
				if (this._getType(pics) === 'array') {
					if (pics.length > 0) {
						this.updateLength = pics.length
						this.page++
						pics.forEach((item) => {
							const subtitle = item?.short_post?.tags_info?.topic_tag?.subtitle
							if (subtitle) {
								item.subtitle = subtitle
							}
						})
						this.pics = [...this.pics, ...pics]
						this.loadingText = '加载更多'
						if (!this.isMore) this.isMore = true
					} else {
						this.loadingText = '加载完毕'
					}
				}
			}
		},
		checkLine() {
			this.$nextTick(() => {
				const { content } = this.$refs
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
		allFn() {
			if (this.isOpen) {
				this.$nextTick(() => {
					const { userWrap } = this.$refs
					userWrap.scrollIntoView()
				})
			}
			this.isOpen = !this.isOpen
		}
	},
	created() {
		this.getRedirectedFrom()
		this.getDetail()
		this.getPics()
	},
	destroyed() {
		this.deleteRedirectedFrom()
	}
}
</script>
<style lang="less" scoped>
@import url("~@/style/fuction.less");
.slide-user {
	min-height: 100vh;
	.swiper-container {
		--swiper-theme-color: #ffffff;
		--swiper-preloader-color: #ffffff;
		position: relative;
		.swiper-lazy {
			opacity: 0;
			&.swiper-lazy-loaded {
				opacity: 1;
				transition: 0.2s ease-in opacity;
			}
		}
		.swiper-wrapper {
			position: relative;
			.swiper-tag {
				display: flex;
				align-items: center;
				position: absolute;
				font-size: 12px;
				&.swiper-tag-right {
					flex-direction: row-reverse;
				}
				.swiper-tag-dot {
					width: 15.609px;
					height: 15.609px;
					background-color: rgba(51, 51, 51, 0.8);
					border-radius: 50%;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					.tag-dot-inner {
						border: 1px solid #fff;
						width: 5.281px;
						height: 5.281px;
						border-radius: 50%;
						overflow: hidden;
						background-color: #ffda46;
					}
				}
				.swiper-tag-line {
					width: 8.328px;
					height: 1px;
					background: rgba(51, 51, 51);
				}
				.swiper-tag-content {
					color: #fff;
					background-color: rgba(51, 51, 51, 0.8);
					padding: 1.042px 4.167px;
					border-radius: 3.12504px;
					overflow: hidden;
				}
			}
		}
		.swiper-count {
			font-size: 12px;
			position: absolute;
			bottom: 10.417px;
			left: 20.833px;
			padding: 2.083px 8.333px;
			border-radius: 9.375px;
			background: rgba(0, 0, 0, 0.2);
			color: #fff;
			z-index: 1;
		}
	}
	.user-info {
		.user-wrap {
			padding: 25px 18.75px 18.75px;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			.user-left {
				display: flex;
				.user-avatar {
					height: 41.656px;
					width: 41.656px;
					background-color: #f1f1f1;
					overflow: hidden;
					border: 1px solid #f2f2f2;
					border-radius: 41.6667px;
				}
				.user-name {
					font-size: 14.5833px;
					color: #666;
					margin-left: 10.417px;
					align-self: center;
				}
			}
			.user-right {
				display: flex;
				.user-attention {
					align-self: center;
					color: #333;
					font-size: 12.5px;
					padding: 3.646px 9.896px;
					background: #ffda46;
					border-radius: 3.12504px;
				}
			}
		}
		.user-content {
			margin-bottom: 5.208px;
			background-color: #fff;
			.content {
				&-box {
					padding: 0 18.75px 25px;
					font-size: 14.5833px;
					color: #333;
					text-align: justify;
					line-height: 25px;
					pre {
						&.all {
							.ellipsis(3);
						}
					}
				}
				&-all {
					color: #536892;
					margin-top: 10px;
					font-size: 13px;
				}
			}

			.user-statistics {
				display: flex;
				padding: 0 0 25px 20.833px;
				.statistics-item {
					margin-right: 41.66px;
					color: #999;
					font-size: 13px;
					line-height: 16.66px;
					display: flex;
					align-items: center;
					i {
						margin-right: 4.1667px;
						font-size: 18px;
					}
				}
			}
		}
	}
	.user-latestComments {
		background-color: #fff;
		margin-top: 4.167px;
		padding: 18.75px 18.75px 0;
		.latestComments-title {
			font-size: 17.7px;
			color: #333;
			font-weight: 500;
			padding-bottom: 4px;
		}
	}
	.user-scenes {
		margin-top: 5.208px;
		.scenes-title {
			padding: 18.75px;
			font-size: 17.7083px;
			color: #333;
			font-weight: 500;
			background-color: #fff;
		}
		#scenes {
			position: relative;
			font-size: 12px;
			.scenes-padding {
				position: absolute;
				padding: 4.167px;
				width: 50%;
				.scenes-item {
					position: relative;
					display: block;
					background-color: #fff;
					.scenes-pic {
						border-top-left-radius: 4.16672px;
						border-top-right-radius: 4.16672px;
						border-bottom-right-radius: 0;
						border-bottom-left-radius: 0;
						overflow: hidden;
						.fa-tag {
							position: absolute;
							color: #fff;
							z-index: 1;
							top: 5.208px;
							right: 5.208px;
							font-size: 14px;
							transform: rotate(90deg);
							padding: 3.042px 4.167px;
							background-color: rgba(51, 51, 51, 0.6);
							border-radius: 3.12504px;
						}
					}
					.scenes-bottom {
						.scenes-content {
							padding: 5px 10px 0;
							font-size: 13px;
							line-height: 23px;
							color: #333;
							font-size: 13px;
							.ellipsis(2);
						}
						.scenes-mask {
							margin-top: 10px;
							height: 19px;
							padding: 0 5px;
							.mask-wrap {
								font-size: 12px;
								color: #666;
								background: #f5f5f5;
								padding: 1px 10px 1px 3px;
								border-radius: 12px;
								display: inline-block;
								max-width: 100%;
								box-sizing: border-box;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								.wrap-img {
									vertical-align: bottom;
									width: 14px;
									height: 14px;
									display: inline-block;
								}
							}
						}
						.scenes-avatar {
							display: flex;
							align-items: center;
							justify-content: space-between;
							height: 39.578px;
							padding: 0 8.333px;
							.avatar-img {
								height: 22.906px;
								width: 22.906px;
								background-color: #f1f1f1;
								overflow: hidden;
								border: 1px solid #f2f2f2;
								border-radius: 22.9167px;
							}
							.avatar-name {
								color: #666;
								flex: 1;
								margin-left: 8px;
							}
							.avatar-collect {
								color: #bbb;
								i {
									font-size: 16px;
								}
							}
						}
					}
				}
			}
		}
		.scenes-more {
			padding: 9.375px;
			.more-bd {
				display: block;
				height: 41.6563px;
				line-height: 41.6563px;
				margin: 0 auto;
				font-size: 12.5px;
				text-align: center;
				color: gray;
				background-color: #fff;
				box-sizing: border-box;
			}
		}
	}
}
</style>
