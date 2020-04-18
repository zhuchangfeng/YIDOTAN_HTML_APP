<template>
	<div class="new-id" v-loading.body="isLoading">
		<div class="new-content">
			<div class="new-bg">
				<img v-lazy="info.cover" class="lazy" alt="背景图" />
			</div>
		</div>

		<div class="new-info">
			<div class="new-titile">{{info.title}}</div>
			<div class="new-author">
				<div class="author-l">
					<div class="author-avatar">
						<img v-lazy="info.user_pic" alt="用户头像" />
						<img src="https://h5.yidoutang.com/v4/public/identity_2.png" alt class="author-identity" />
					</div>
					<div class="author-name">{{info.user_name}}</div>
				</div>
				<div class="author-r">
					<div class="author-attention" @click="attention">+ 关注</div>
				</div>
			</div>
		</div>

		<div class="house-info">
			<div class="house-content">
				<div class="house-title">房屋信息</div>

				<div class="house-row">
					<div class="house-item">
						<span class="house-key">户型：</span>
						<span class="house-value">{{info.size}}</span>
					</div>
					<div class="house-item">
						<span class="house-key">面积：</span>
						<span class="house-value">{{info.area}}</span>
					</div>
				</div>

				<div class="house-row">
					<div class="house-item">
						<span class="house-key">风格：</span>
						<span class="house-value">{{info.style}}</span>
					</div>
					<div class="house-item">
						<span class="house-key">预算：</span>
						<span class="house-value">{{info.budget}}</span>
					</div>
				</div>

				<div class="house-row">
					<div class="house-item">
						<span class="house-key">地区：</span>
						<span class="house-value">{{info.city}}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="house-artBd">
			<div class="house-artPart">
				<div class="house-title">屋主介绍</div>
				<div class="house-mark" v-if="author_info.profession">
					<span class="mark-key">职业</span>
					<span class="mark-value">{{author_info.profession}}</span>
				</div>
				<div class="house-mark" v-if="author_info.age">
					<span class="mark-key">年龄</span>
					<span class="mark-value">{{author_info.age}}</span>
				</div>
				<div class="house-mark" v-if="author_info.self_intro">
					<span class="mark-key">个人简介</span>
					<span class="mark-value">{{author_info.self_intro}}</span>
				</div>
				<div class="house-mark" v-if="author_info.city">
					<span class="mark-key">城市</span>
					<span class="mark-value">{{author_info.city}}</span>
				</div>
			</div>
			<div class="house-artPart">
				<div class="house-title">前言</div>
				<div v-text="info.content"></div>
			</div>

			<div class="house-artPart" v-for="(item,index) in spaces" :key="index" :id="index" :ref="index">
				<div class="house-title">{{index}}</div>
				<div v-for="(item2,index2) in item" :key="index2">
					<div class="partImg" v-if="item2.match&&item2.match.image">
						<img v-lazy="item2.match.image" class="lazy" />
					</div>
					<div>{{item2.content}}</div>
				</div>
			</div>
		</div>

		<div class="house-bottom">
			<div class="bottom-info">
				<p>©本文著作权归作者所有，禁止以非一兜糖家居产品形式转载或发布</p>
			</div>
			<div class="house-statistics">
				<div class="statistics-item">
					<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
					<span>{{info.zan_num}}</span>
				</div>
				<div class="statistics-item">
					<i class="fa fa-commenting-o" aria-hidden="true"></i>
					<span>{{info.comment_num}}</span>
				</div>
				<div class="statistics-item">
					<i class="fa fa-star-o" aria-hidden="true"></i>
					<span>{{info.like_num}}</span>
				</div>
			</div>
		</div>

		<div class="house-latestComments">
			<div class="latestComments-title">最新评论</div>
			<div class="latestComments-list">
				<comment v-for="(item,index) in comments" :key="index" :comment="item"></comment>
			</div>
			<div class="latestComments-bottom">查看全部评论 ></div>
		</div>

		<div class="house-latestComments">
			<div class="latestComments-title">相关内容</div>
			<div class="latestComments-list">
				<router-link :to="{path:'/new/'+item.id}" v-for="(item,index) in related" :key="index">
					<related :related="item"></related>
				</router-link>
			</div>
		</div>
		<div class="new-menu" @click="isClose=true">
			<img src="https://h5.yidoutang.com/v4/public/icon/case-menu.png" alt />
		</div>
		<transition name="op">
			<div class="menu-bg" @click.stop="isClose=false" v-show="isClose"></div>
		</transition>
		<transition name="popup-right">
			<div class="menu-content" v-show="isClose">
				<div class="content-top">
					<div class="top-title">
						<div class="title-bl"></div>目录
					</div>
				</div>
				<div class="content-center">
					<router-link
						:to="{ path:'/new/'+$route.params.id+'/#'+item}"
						v-for="(item,index) in menu"
						:key="index"
						@click.native.stop="goDom(item)"
						:class="item==hoverId?'hover':''"
					>
						<div class="menu-item">
							<div class="item-caselocal">
								<i class="fa fa-map-marker" aria-hidden="true"></i>
								<div class="line borderBottom"></div>
							</div>
							<span>{{item}}</span>
						</div>
					</router-link>
				</div>
				<div class="content-close" @click.stop="isClose=false">
					<i class="fa fa-angle-right" aria-hidden="true"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { getNewDetail } from "@/api/api.js";
import comment from "@/components/comment.vue";
import related from "@/components/related.vue";
import { isEmpty } from "@/Plugin/utils/index.js";
export default {
	data() {
		return {
			info: {}, //数据
			isLoading: true, //是否在加载中
			spaces: {},
			comments: [],
			author_info: {}, //作者信息
			menu: [], //菜单
			isClose: false, //菜单是否打开
			related: [], //相关内容
			hoverId: null,
			timer: null
		};
	},
	components: {
		comment,
		related
	},
	methods: {
		getDetail() {
			const { params } = this.$route;
			const _this = this;
			if (/^[0-9]*$/.test(params.id)) {
				getNewDetail({
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
									//comment_preview 字段
									if (data.hasOwnProperty("comment_preview")) {
										const comments = data.comment_preview.comments;
										if (this._getType(comments) == "array") {
											this.comments = [...comments];
											comments.forEach(function(item) {
												if (_this._getType(item) == "object") {
													if (item.hasOwnProperty("created")) {
														item.created = _this._getTimeSatus(item.created);
													}
												}
											});
										}
									}
									//spaces 字段
									if (data.hasOwnProperty("spaces")) {
										const spaces = data.spaces;
										if (this._getType(spaces) == "object") {
											this.spaces = { ...spaces };
										}
										this.getHash();
									}
									// author_info字段
									if (data.hasOwnProperty("author_info")) {
										const author_info = data.author_info;
										if (this._getType(author_info) == "object") {
											this.author_info = { ...author_info };
										}
									}
									// info字段
									if (data.hasOwnProperty("info")) {
										const info = data.info;
										if (this._getType(info) == "object") {
											this.info = { ...info };
										}
									}
									// menu字段
									if (data.hasOwnProperty("menu")) {
										const menu = data.menu;
										if (this._getType(menu) == "array") {
											this.menu = [...menu];
										}
									}
									// related字段
									if (data.hasOwnProperty("related")) {
										const related = data.related;
										if (this._getType(related) == "array") {
											if (related.length > 0) {
												this.related = [...related];
											}
										}
									}
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
		},
		goDom(dom) {
			this.$nextTick(() => {
				if (this._getType(this.$refs[dom]) == "array") {
					if (this.$refs[dom].length > 0) {
						const { top } = this.$refs[dom][0].getBoundingClientRect();
						const scrollTop = document.getElementById("app").scrollTop;
						document.getElementById("app").scrollTop = scrollTop + top;
						if (this.isClose) {
							this.isClose = false;
						}
						this.hoverId = dom;
					}
				}
			});
		},
		IntersectionObserverFun() {
			let that = this;
			if (window.IntersectionObserver) {
				var observer = new IntersectionObserver(
					function(entries) {
						entries.forEach(entry => {
							if (
								parseInt(entry.target.getBoundingClientRect().top) <= 0 &&
								parseInt(entry.target.getBoundingClientRect().bottom) >= 0
							) {
								that.hoverId = entry.target.id;
							}
						});
					},
					{
						threshold: [0],
						root: document.getElementsByClassName("new-id")[0]
					}
				);
				for (const iterator of that.menu) {
					that.$nextTick(() => {
						if (this._getType(this.$refs[iterator]) == "array") {
							if (this.$refs[iterator].length > 0) {
								observer.observe(this.$refs[iterator][0]);
							}
						}
					});
				}
			}
		},
		getHash() {
			const { hash } = this.$route;
			if (!isEmpty(hash)) {
				let decodeHash = decodeURIComponent(hash).replace("#", "");
				this.$nextTick(() => {
					if (this._getType(this.$refs[decodeHash]) == "array") {
						if (this.$refs[decodeHash].length > 0) {
							this.timer = setTimeout(() => {
								this.$refs[decodeHash][0].scrollIntoView();
							});
						}
					}
				});
			}
		},

		attention() {
			this.$msgbox({
				message: "是否关注ta",
				confirmButtonText: "关注",
				showCancelButton: true,
				cancelButtonText: "取消",
				rowButton: true
			}).then(r => {
				this.$message({
					message: r
				});
			});
		}
	},
	watch: {
		$route: function(newRouter, oldRouter) {
			const {
				params: { id: newId }
			} = newRouter;
			const {
				params: { id: oldId }
			} = oldRouter;
			if (newId != oldId) {
				this.$router.go(0);
			}
		}
	},
	created() {
		this.getDetail();
	},
	mounted() {
		window.addEventListener(
			"scroll",
			this._.throttle(this.IntersectionObserverFun, 500),
			true
		);
	},
	destroyed() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		window.removeEventListener("scroll", this.IntersectionObserverFun);
	}
};
</script>

<style lang="less" scoped>
.new-id {
	.new-content {
		.new-bg {
			padding-bottom: 56.26%;
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
	}

	.new-info {
		background-color: #fff;
		.new-titile {
			font-size: 18.75px;
			padding: 25px 18.75px 18.75px;
		}
		.new-author {
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
	.house-info {
		padding: 40.625px 18.75px 25px 18.75px;
		background-color: #fff;
		.house-content {
			padding: 20.8333px;
			border: 1px solid #d2d2d2;
			border-radius: 6px;
			position: relative;
			font-size: 13px;
			.house-title {
				padding: 0 7.292px;
				color: #333;
				background-color: #fff;
				position: absolute;
				top: -8.333px;
				left: 13.542px;
			}
			.house-row {
				display: flex;
				margin-bottom: 15.625px;
				&:last-child {
					margin-bottom: 0;
				}
				.house-item {
					flex: 1;
					.house-key {
						color: #d2d2d2;
					}
					.house-value {
						color: #333;
					}
				}
			}
		}
	}
	.house-artBd {
		padding: 10.417px 20.833px;
		font-size: 13.8021px;
		line-height: 23.9583px;
		letter-spacing: 0.3px;
		background-color: #fff;
		.house-artPart {
			padding: 10.417px 0;
			font-size: 13.5417px;
			color: #333;
			word-break: break-word;
			&:first-child {
				.house-title {
					padding-top: 0;
				}
			}
			.house-title {
				color: #333;
				font-size: 16.6666px;
				padding-bottom: 23.958px;
			}
			.partImg {
				margin: 10.417px 0;
			}
			.house-mark {
				padding-left: 83.3333px;
				.mark-key {
					color: #959595;
					float: left;
					margin-left: -83.3333px;
				}
				.mark-value {
				}
			}
		}
	}
	.house-bottom {
		padding: 10.417px 20.833px;
		margin-bottom: 4.167px;
		background-color: #fff;
		.bottom-info {
			overflow-x: auto;
			p {
				transform: scale(0.892593);
				width: 100%;
				font-size: 12px;
				transform-origin: left;
				color: #999;
				white-space: nowrap;
			}
		}
		.house-statistics {
			display: flex;
			margin-top: 18.75px;
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
	.house-latestComments {
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
	.new-menu {
		position: fixed;
		width: 42.7px;
		height: 42.7px;
		border-radius: 50%;
		background-color: #ffda46;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 31.25px;
		right: 14.58px;
		overflow: hidden;
		z-index: 998;
		img {
			width: 20.82px;
			height: 20.82px;
		}
	}
	.menu-bg {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 998;
	}
	.menu-content {
		position: fixed;
		bottom: 0;
		background-color: #fff;
		width: 166.656px;
		height: 586.953px;
		padding: 5.20828px 0 5.20828px 13.5417px;
		z-index: 998;
		right: 0;
		border-top-left-radius: 9.375px;
		box-sizing: content-box;
		.content-top {
			font-size: 16px;
			height: 10%;
			.top-title {
				position: relative;
				font-size: 13px;
				color: #666;
				padding: 12.5px 23.9583px;
			}
			.title-bl {
				position: absolute;
				width: 4.15625px;
				background-color: #ffda46;
				height: 15.6094px;
				left: 12.5px;
				top: 50%;
				margin-top: -7.81254px;
				border-radius: 5.20828px;
			}
		}
		.content-center {
			height: 90%;
			overflow: auto;
			.hover {
				.menu-item {
					color: #ffda46;
					.item-caselocal {
						i {
							color: #ffda46;
							border: 2px solid #ffda46;
						}
						.borderBottom {
							&::after {
								border-bottom: 1px solid #ffda46;
							}
						}
					}
				}
			}
			.menu-item {
				height: 52.0781px;
				.item-caselocal {
					position: relative;
					height: 16.6563px;
					i {
						font-size: 14px;
						position: absolute;
						top: 0;
						bottom: 0;
						margin: auto 0;
						width: 16px;
						height: 16px;
						line-height: 16px;
						color: #bbb;
						text-align: center;
						border: 2px solid #bbb;
						border-radius: 50%;
						overflow: hidden;
						box-sizing: content-box;
						transform: scale(0.7);
					}
					.line {
						position: absolute;
						width: calc(100% - 16px);
						right: 0;
						top: 8.07815px;
					}
				}
				span {
					font-size: 13.5px;
					padding-left: 23.9583px;
					padding-top: 5px;
					vertical-align: top;
					display: inline-block;
				}
			}
		}
		.content-close {
			position: absolute;
			right: 180.17px;
			bottom: 31.25px;
			width: 27.0781px;
			height: 54.1563px;
			line-height: 54.1563px;
			text-align: center;
			color: #8e8e8e;
			background-color: hsla(0, 0%, 100%, 0.8);
			border-top-left-radius: 9.375px;
			border-bottom-left-radius: 9.375px;
			i {
				font-size: 28px;
			}
		}
	}
}
</style>