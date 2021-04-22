<template>
	<div class="master__id" v-loading.body="isLoading" ref="master">
		<div class="master__id--info">
			<div class="info-titile">{{ info.posts && info.posts[0].subject }}</div>
			<div class="info-author">
				<div class="author-left">
					<div class="author-avatar">
						<router-link :to="'/user/' + posts.authorid">
							<img v-lazy="posts.user_pic" alt="用户头像" />
							<img
								src="https://h5.yidoutang.com/v4/public/identity_1.png"
								alt
								class="author-identity"
							/>
						</router-link>
					</div>
					<div class="author-name">{{ posts.author }}</div>
				</div>
				<div class="author-right">
					<div class="author-attention">+ 关注</div>
				</div>
			</div>
		</div>
		<div class="master__id--content" ref="masterFigure">
			<component
				:is="item.name"
				:html="item.value"
				:brand="item.brand"
				:sharing="item.sharing"
				v-for="(item, index) in options"
				:key="index"
			></component>
		</div>
		<div
			class="master__id--latestComments"
			v-if="info.comment_preview && info.comment_preview.comments.length > 0"
		>
			<div class="latestComments-title">最新评论</div>
			<div class="latestComments-list">
				<comment
					v-for="(item, index) in info.comment_preview &&
					info.comment_preview.comments"
					:key="index"
					:comment="item"
				></comment>
			</div>
			<div class="latestComments-bottom">查看全部评论 ></div>
		</div>
		<div class="master__id--latestComments" v-if="related.length > 0">
			<div class="latestComments-title">相关内容</div>
			<router-link
				:to="{ path: '/master/' + item.id }"
				v-for="(item, index) in related"
				:key="'master' + index"
				class="latestComments-link"
			>
				<master-item :related="item"></master-item>
			</router-link>
		</div>
	</div>
</template>

<script>
import { getMasterDetail } from '@/api/api.js'
import comment from '@/components/comment'
import master from '@/components/master'
import { getStyle, createElement } from '@/Plugin/dom/dom.js'
import htmlDefault from '@/components/htmlDefault'
import brand from '@/components/brand'
import sharing from '@/components/sharing'
import cheerio from 'cheerio'
export default {
	data() {
		return {
			info: {}, // 数据
			isLoading: true, // 是否在加载中
			posts: {},
			related: [], // 相关内容
			options: []
		}
	},
	components: {
		comment,
		masterItem: master,
		htmlDefault,
		brand,
		sharing
	},
	methods: {
		async getDetail() {
			const { params } = this.$route
			const _this = this
			if (/^[0-9]*$/.test(params.id)) {
				try {
					const {
						data: { success_code: success_code, data: data }
					} = await getMasterDetail({
						params: {
							id: params.id
						}
					})
					if (this.isLoading) {
						this.isLoading = false
					}
					if (success_code === 200) {
						if (this._getType(data) === 'object') {
							const { comment_preview, posts } = data
							if (this._getType(comment_preview) === 'object') {
								const { comments: comments } = comment_preview
								if (this._getType(comments) === 'array') {
									comments.forEach((item) => {
										if (this._getType(item) === 'object') {
											if (Object.prototype.hasOwnProperty.call(item, 'created')) {
												item.created = this._getTimeSatus(item.created)
											}
										}
									})
								}
							}
							if (posts) {
								if (this._getType(posts) === 'array') {
									const index = posts.findIndex((i) => i.first === '1')
									if (index !== -1) {
										this.posts = posts[index]
										this.related = posts[index].related
										if (this._getType(posts[index]) === 'object') {
											const checkImage = {}
											const {
												images,
												message_div,
												related_sharings_brands
											} = posts[index]
											const { scrollWidth } = this.$refs.masterFigure
											const padding = getStyle(
												this.$refs.masterFigure,
												'padding-left'
											).replace('px', '')
											if (Array.isArray(images)) {
												images.forEach((item) => {
													checkImage[item.aid] = item.info
												})
											}
											if (this._getType(message_div) === 'string') {
												const $ = cheerio.load(message_div, {
													decodeEntities: false
												})
												if ($('img').length > 0) {
													$('img').each(function() {
														const src = $(this).attr('src')
														$(this).attr('data-src', src)
														$(this).addClass('lazy')
														const className = $(this).attr('class')
														if (
															src.indexOf('.gif') !== -1 &&
															className.indexOf('data_') === -1
														) {
															$(this).css({
																width: '32px',
																margin: '0 2px',
																'vertical-align': 'middle'
															})
														} else {
															if (className) {
																const id = className.replace(/[^0-9]/gi, '')
																if (checkImage[id]) {
																	const { height, width } = checkImage[id]
																	const div =
																		"<div class='pic' style='height:" +
																		(height / width) *
																			(scrollWidth - padding * 2) +
																		"px'>" +
																		'</div>'
																	$(this).wrap(div)
																}
															}
														}
														$(this).removeAttr('src')
													})
												}
												const relatedObj = {}
												if (this.options.length > 0) {
													this.options = []
												}
												if (Array.isArray(related_sharings_brands)) {
													related_sharings_brands.forEach((item) => {
														const { sharing, brand } = item
														if (sharing && brand) {
															const {
																sharing: { sharing_id: sharing_id }
															} = item
															relatedObj[sharing_id] = item
														} else {
															const { data } = brand
															relatedObj[data] = brand
														}
													})
												}
												if ($('body').length > 0) {
													const children = $('body').children()
													let html = ''
													children.each(function() {
														const hrefA = $(this).find('a')
														if (hrefA.length > 0) {
															const hrefAttr = hrefA.attr('href')
															const {
																options: { base: base }
															} = _this.$router
															if (hrefAttr) {
																if (hrefAttr.indexOf('guide') !== -1) {
																	const id = hrefAttr.replace(/[^0-9]/gi, '')
																	$(hrefA).attr({
																		href: base + 'master/' + id,
																		target: '_self'
																	})
																}
																if (hrefAttr.indexOf('case') !== -1) {
																	const id = hrefAttr.replace(/[^0-9]/gi, '')
																	$(hrefA).attr({
																		href: base + 'new/' + id,
																		target: '_self'
																	})
																}
																if (hrefAttr.indexOf('/u/') !== -1) {
																	const id = hrefAttr.replace(/[^0-9]/gi, '')
																	$(hrefA).attr({
																		href: base + 'user/' + id,
																		target: '_self'
																	})
																}
															}
														}

														const className = $(this).attr('class')
														if (className) {
															if (className.indexOf('brand') !== -1) {
																const id = className.replace(/[^0-9]/gi, '')
																if (html) {
																	_this.options.push({
																		name: 'htmlDefault',
																		value: html
																	})
																	html = ''
																}
																$(this).remove()
																if (relatedObj[id]) {
																	_this.options.push({
																		name: 'brand',
																		brand: relatedObj[id]
																	})
																}
															} else if (className.indexOf('sharing') !== -1) {
																const id = className.replace(/[^0-9]/gi, '')
																if (html) {
																	_this.options.push({
																		name: 'htmlDefault',
																		value: html
																	})
																	html = ''
																}
																$(this).remove()
																if (relatedObj[id]) {
																	_this.options.push({
																		name: 'sharing',
																		sharing: relatedObj[id]
																	})
																}
															} else {
																html += createElement(this, $(this).html())
															}
														} else {
															html += createElement(this, $(this).html())
														}
													})
													if (html) {
														this.options.push({
															name: 'htmlDefault',
															value: html
														})
													}
													console.log(this.options)
												}
											}
										}
									}
								}
							}
							this.info = { ...data }
						} else {
							this.$router.replace({
								path: '/404'
							})
						}
					}
				} catch (e) {
					console.log(e)
					if (this.isLoading) {
						this.isLoading = false
					}
					if (e) {
						this.$router.replace({
							path: '/404'
						})
					}
				}
			} else {
				this.$router.replace({
					path: '/404'
				})
			}
		}
	},
	beforeRouteUpdate(to, from, next) {
		next()
		if (to.fullPath !== from.fullPath) {
			this.getDetail()
		}
	},
	created() {
		this.getDetail()
	}
}
</script>
<style lang="less" scoped>
.master__id {
	width: 100%;
	height: 100%;
	overflow: auto;
	&--info {
		background-color: #fff;
		.info-titile {
			font-size: 18.75px;
			padding: 25px 18.75px 18.75px;
		}
		.info-author {
			display: flex;
			justify-content: space-between;
			padding: 0 18.75px;
			align-items: center;
			.author-left {
				position: relative;
				display: flex;
				align-items: center;
				.author-avatar {
					width: 43.66px;
					height: 43.66px;
					border-radius: 50%;
					overflow: hidden;
					border: 1px solid #d9dce9;
					margin-right: 9.375px;
				}
				.author-identity {
					width: 18.75px;
					height: 18.75px;
					position: absolute;
					left: 24.125px;
					bottom: 0;
				}
				.author-name {
					font-size: 14.58px;
					color: #666;
				}
			}
			.author-right {
				.author-attention {
					border-radius: 3.125px;
					color: #333;
					padding: 3.55px 9.75px;
					font-size: 13px;
					background: #ffda46;
				}
			}
		}
	}
	&--content {
		padding: 10.4167px 20.8334px;
		background-color: #fff;
		font-size: 16px;
		line-height: 26px;
		color: #333;
		margin-bottom: 4.16672px;
		word-break: break-word;
		p {
			word-break: break-word;
		}
	}
	&--latestComments {
		background-color: #fff;
		margin-top: 4.167px;
		padding: 18.75px 18.75px 0;
		.latestComments-title {
			font-size: 17.7px;
			color: #333;
			font-weight: 500;
			padding-bottom: 4px;
		}
		.latestComments-link {
			display: block;
			&:last-child {
				& .master__item {
					border-bottom: 0;
				}
			}
		}
		.latestComments-bottom {
			height: 51.0313px;
			line-height: 51.0417px;
			text-align: center;
			font-size: 13px;
			text-decoration: none;
			color: #666;
		}
	}
}
</style>
<style>
.master__id--content .pic {
	display: block;
	position: relative;
	background-color: #eee;
	overflow: hidden;
	margin: 5px 0;
}
.master__id--content .pic img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.master__id--content em {
	font-style: normal;
	color: #c00000;
}
.master__id--content a {
	color: #f4b034;
}
.master__id--content img {
	display: initial;
	width: initial;
	height: initial;
}
.master__id--content img[class^="data_"] {
	display: block;
	width: 100%;
}
</style>
