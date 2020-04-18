<template>
	<div class="master-id" v-loading.body="isLoading">
		<div class="master-info">
			<div class="master-titile">{{info.posts&&info.posts[0].subject}}</div>
			<div class="master-author">
				<div class="author-l">
					<div class="author-avatar">
						<img v-lazy="posts.user_pic" alt="用户头像" />
						<img src="https://h5.yidoutang.com/v4/public/identity_1.png" alt class="author-identity" />
					</div>
					<div class="author-name">{{posts.author}}</div>
				</div>
				<div class="author-r">
					<div class="author-attention">+ 关注</div>
				</div>
				<!-- <div class="master-menu">
					<img src="https://h5.yidoutang.com/v4/public/icon/case-menu.png" alt />
				</div> -->
			</div>
		</div>
		<div class="master-content">
      <figure v-html="posts.message_div" v-lazy-container="{ selector: 'img' }"></figure>
    </div>
		<div class="master-latestComments">
			<div class="latestComments-title">最新评论</div>
			<div class="latestComments-list">
				<comment
					v-for="(item,index) in info.comment_preview&&info.comment_preview.comments"
					:key="index"
					:comment="item"
				></comment>
			</div>
			<div class="latestComments-bottom">查看全部评论 ></div>
		</div>
	</div>
</template>

<script>
import { getMasterDetail } from "@/api/api.js";
import comment from "@/components/comment";
export default {
	data() {
		return {
			info: {}, //数据
			isLoading: true, //是否在加载中
			posts: {}
		};
	},
	components: {
		comment
	},
	methods: {
		getDetail() {
			const { params } = this.$route;
			const _this = this;
			if (/^[0-9]*$/.test(params.id)) {
				getMasterDetail({
					params: {
						id: params.id
					}
				})
					.then(r => {
						if (this.isLoading) {
							this.isLoading = false;
						}
						const { data } = r;
						if ((data.success_code = 200)) {
							if (!this._isEmpty(r.data)) {
								const { data } = r.data;
								if (this._getType(data) == "object") {
									if (data.hasOwnProperty("comment_preview")) {
										const comments = data.comment_preview.comments;
										if (this._getType(comments) == "array") {
											comments.forEach(function(item) {
												if (_this._getType(item) == "object") {
													if (item.hasOwnProperty("created")) {
														item.created = _this._getTimeSatus(item.created);
													}
												}
											});
										}
									}
									if (data.hasOwnProperty("posts")) {
										const posts = data.posts;
										if (this._getType(posts) == "array") {
											const index = posts.findIndex(i => i.first == "1");
											if (index != -1) {
												this.posts = posts[index];
												if (this._getType(posts[index]) == "object") {
													if (
														this._getType(posts[index].message_div) == "string"
													) {
														let regexp1 = new RegExp(
															/(<img.*?src=")(.*?)(".*?\/?)>/,
															"g"
														);
														let regexp2 = new RegExp(
															/(<img.*?class=")(.*?)(".*?\/?)>/,
															"g"
														);
														let contentp = posts[index].message_div.replace(
															regexp1,
															function(match, p1, p2, p3) {
																return p1 + p2 + '" data-src="' + p2 + p3 +">";
															}
														);
														let contentc = contentp.replace(regexp2, function(
															match,
															c1,
															c2,
															c3
														) {
															return c1 + c2 + " lazy" + c3 +">";
														});
														this.$set(this.posts, "message_div", contentc);
													}
												}
											}
										}
									}
									this.info = { ...data };
								} else {
									this.$router.replace({
										path: "/404"
									});
								}
							}
						}
					})
					.catch(e => {
						console.log(e);
						if (this.isLoading) {
							this.isLoading = false;
						}
						if (e) {
							this.$router.replace({
								path: "/404"
							});
						}
					});
			} else {
				this.$router.replace({
					path: "/404"
				});
			}
		}
	},
	created() {
		this.getDetail();
	}
};
</script>

<style lang="less" scoped>
.master-id {
	padding-bottom: 150px;
	.master-info {
		background-color: #fff;
		.master-titile {
			font-size: 18.75px;
			padding: 25px 18.75px 18.75px;
		}
		.master-author {
			display: flex;
			justify-content: space-between;
			padding: 0 18.75px;
			align-items: center;
			.author-l {
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
					left: 26px;
					bottom: 0;
				}
				.author-name {
					font-size: 14.58px;
					color: #666;
				}
			}
			.author-r {
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
	.master-content {
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
	.master-latestComments {
		background-color: #fff;
		margin-top: 4.167px;
		padding: 18.75px 18.75px 0;
		.latestComments-title {
			font-size: 17.7px;
			color: #333;
			font-weight: 500;
			padding-bottom: 4px;
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
	// .master-menu {
	// 	position: fixed;
	// 	width: 42.7px;
	// 	height: 42.7px;
	// 	border-radius: 50%;
	// 	background-color: #ffda46;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// 	bottom: 31.25px;
	// 	right: 14.58px;
	// 	overflow: hidden;
	// 	z-index: 999;
	// 	img {
	// 		width: 20.82px;
	// 		height: 20.82px;
	// 	}
	// }
}
</style>