<template>
	<div id="index" v-loading.body="isLoading" ref="index">
		<div class="index__title">
			<div class="index__title--logo">
				<img
					v-lazy="'https://h5.yidoutang.com/v4/public/logo/logo-56.png'"
					class="lazy"
					alt
				/>
			</div>
			<div class="index__title--words">
				<p>一兜糖家居APP</p>
				<p>装修家居生活社区</p>
			</div>
			<div class="index__title--download">
				<a
href="https://a.app.qq.com/o/simple.jsp?pkgname=com.yidoutang.app"
					>下载</a
				>
			</div>
		</div>

		<div class="index__banner borderBottom">
			<router-link
				:to="item.link"
				v-for="(item, index) in bannerData"
				:key="index"
				:data-type="item.type"
			>
				<div class="index__banner--item">
					<div class="item-img">
						<img :alt="item.title" v-lazy="item.icon" />
					</div>
					<p>{{ item.title }}</p>
				</div>
			</router-link>
		</div>

		<div class="index__col borderBottom">
			<div class="index__col--title">
				<div class="col-bl"></div>
				今日屋主
			</div>
			<div class="index__col--star">
				<img v-lazy="master.pic" alt class="lazy" />
				<div class="col-avatar">
					<router-link :to="'/user/' + master.user_id">
						<img v-lazy="master.user_pic" alt class="avatar-img lazy" />
						<img
							v-lazy="'https://h5.yidoutang.com/v4/public/identity_3.png'"
							alt
							class="avatar-identity lazy"
						/>
					</router-link>
				</div>
				<div class="col-info">
					<div class="info-title">{{ master.title }}</div>
					<div class="info-name">{{ master.user_name }}</div>
				</div>
			</div>
		</div>

		<div class="index__col borderBottom pb0" ref="recommend">
			<div class="index__col--title">
				<div class="col-bl"></div>
				编辑精选
			</div>
			<essay
				v-for="(item, index) in recommend"
				:key="index"
				:value="item"
				@handGain="handClick"
			></essay>
		</div>
		<div class="index__more" @click="getHome()">
			{{ loadingText }}
		</div>
		<div class="index__open">App 内打开</div>
	</div>
</template>

<script>
import essay from '@/components/essay.vue'
import { getInfo } from '../api/api'
export default {
	data() {
		return {
			bannerData: [],
			recommend: [],
			master: {},
			isLoading: true,
			loadingText: '',
			page: 1
		}
	},
	components: {
		essay
	},
	methods: {
		checkType() {
			const self = this
			const arr = self.bannerData.reduce((item, index) => {
				const { title } = index
				switch (title) {
					case '全屋记':
						index.link = '/case/list/0/0/0/0/0/0'
						break
					case '文章攻略':
						index.link = '/master/decorate/91,92'
						break
					case '新手指南': {
						const { data } = index
						index.link = '/master/' + data
						break
					}
					case '众测':
						index.link = '/zhongce/list'
						break
					default:
						index.link = '/'
						break
				}
				if (index.type !== '0') {
					if (self._.findIndex(item, (o) => o.type === index.type) === -1) {
						item.push(index)
					} else {
						item[self._.findIndex(item, (o) => o.type === index.type)] = index
					}
				}
				return item
			}, [])
			self.bannerData = arr
		},
		getHome() {
			this.loadingText = '加载中...'
			getInfo({
				params: {
					page: this.page
				}
			}).then((r) => {
				const res = r?.data
				let scrollTop = 0
				if (document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop
				} else if (document.body) {
					scrollTop = document.body.scrollTop
				}
				if (this.isLoading) {
					this.isLoading = false
				}
				this.loadingText = '加载更多'
				if (res?.success_code === 200) {
					const array = ['recommend']
					const data = res?.data
					const master = data?.master
					for (const key of array) {
						if (!this._isEmpty(data?.[key])) {
							if (this.page > 1) {
								this.recommend = [...this.recommend, ...data['recommend']]
								this.$nextTick(() => {
									if (scrollTop) {
										window.scroll(0, scrollTop)
									}
								})
							} else if (this.page === 1) {
								this[key] = data[key]
							}
						}
					}
					if (this.page === 1) {
						this.bannerData = data?.nav
						if (!this._isEmpty(this.bannerData)) {
							this.checkType()
						}
					}
					if (this._getType(master) === 'array') {
						if (master.length > 0) {
							this.master = master[0]
						}
					}
					this.page = this.page + 1
				}
			})
		},
		handClick(obj) {
			if (!this._isEmpty(obj?.id)) {
				switch (obj.subtype) {
					case '8':
						this.$router.push({
							path: '/new/' + obj.id
						})
						break
					case '0':
						this.$router.push({
							path: '/master/' + obj.id
						})
						break
					default:
						break
				}
			}
		}
	},
	created() {
		this.getHome()
		// Hi I am Tony
		// 等待了5秒...
		// I am eating lunch
		// I am eating dinner
		// 等待了10秒...
		// I am eating junk food
		class LazyManClass {
			constructor(name) {
				this.task = []
				this.name = name
				console.log(`Hi I am ${this.name}`)
				setTimeout(() => {
					this.next()
				}, 0)
			}
			eat(val) {
				var self = this
				this.task.push(() => {
					console.log(` I am eating${val}`)
					self.next()
				})
				return this
			}
			sleepFirst(time) {
				var self = this
				this.task.unshift(() => {
					setTimeout(() => {
						console.log(`等待了${time}秒...`)
						self.next()
					}, time * 1000)
				})
				return this
			}
			sleep(time) {
				var self = this
				this.task.push(() => {
					setTimeout(() => {
						console.log(`等待了${time}秒...`)
						self.next()
					}, time * 1000)
				})
				return this
			}
			next() {
				var fn = this.task.shift()
				typeof fn === 'function' && fn()
			}
		}
		new LazyManClass('Felix')
			.eat('lunch')
			.eat('dinner')
			.sleepFirst(5)
			.sleep(10)
			.eat('junk food')
	}
}
function SuperType() {
	this.property = true
}
SuperType.prototype.getSuperValue = function() {
	return this.property
}
function SubType() {
	this.subproperty = false
}
SubType.prototype = new SuperType()
console.log(SubType.prototype)
SubType.prototype.getSubType = function() {
	return this.subproperty
}
</script>

<style lang="less" scoped>
@import url("../style/fuction.less");
#index {
	width: 100%;
	height: 100%;
	overflow: auto;
	.index__title {
		position: relative;
		z-index: 1;
		height: 75px;
		width: 100%;
		background-color: hsla(0, 0%, 100%, 0.96);
		padding: 0 14.5833px;
		display: flex;
		align-items: center;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		&--logo {
			width: 37.48px;
			height: 37.48px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
			border-radius: 10.42px;
			padding: 5.2px;
		}
		&--words {
			margin-left: 14.5833px;
			p:first-child {
				font-size: 15.625px;
				color: #4d4d4d;
				font-weight: 700;
			}
			p:last-child {
				color: rgb(193, 193, 193);
				font-size: 12px;
				margin-top: 3.13px;
			}
		}
		&--download {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			a {
				color: #fff;
				padding: 0 10.42px;
				font-size: 12px;
				background-color: #f8b434;
				border-radius: 26.1px;
				overflow: hidden;
				line-height: 26.1px;
			}
		}
	}
	.index__banner {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		background-color: #fff;
		text-align: center;
		margin-bottom: 10.4px;
		a {
			flex-basis: 20%;
			min-height: 84.38px;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		&--item {
			.item-img {
				width: 28.125px;
				height: 28.125px;
				margin: 0 auto 7.5px auto;
			}
			p {
				font-size: 12px;
				color: #666;
			}
		}
	}
	.index__col {
		background-color: #fff;
		margin-bottom: 10.4px;
		padding-bottom: 15.6px;
		&--title {
			padding: 12.5px 23.96px;
			font-size: 13px;
			position: relative;
			color: #666;
			.col-bl {
				width: 4.15px;
				height: 15.6px;
				border-radius: 5.2px;
				position: absolute;
				left: 12.5px;
				background-color: #ffda46;
			}
		}
		&--star {
			height: 104.156px;
			margin: 0 10.4167px;
			position: relative;
			&::after {
				content: "";
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(30, 30, 30, 0.2);
			}
			.col-avatar {
				position: absolute;
				z-index: 1;
				left: 23.4375px;
				top: 26.0416px;
				.avatar-img {
					width: 54.08px;
					height: 54.08px;
					border-radius: 50%;
					overflow: hidden;
					border: 1px solid #fff;
					display: inline-block;
				}
				.avatar-identity {
					width: 15.6094px;
					height: 15.6094px;
					display: inline-block;
					position: absolute;
					bottom: 0;
					left: 35px;
				}
			}
			.col-info {
				font-size: 15.625px;
				position: absolute;
				color: #fff;
				top: 0;
				bottom: 0;
				margin: auto 0;
				width: 208.328px;
				right: 55px;
				height: 41.6563px;
				z-index: 1;
				.info-title {
					.ellipsis();
				}
			}
			.info-name {
				font-size: 12px;
			}
		}
	}
	.index__open {
		border-radius: 26.0416px;
		width: 110.14px;
		line-height: 38.81px;
		background-color: #f8b434;
		font-size: 14px;
		text-align: center;
		position: fixed;
		bottom: 41.6667px;
		left: 0;
		right: 0;
		margin: 0 auto;
		color: #fff;
		z-index: 1;
	}
	.index__more {
		margin: 9.375px;
		height: 41.65px;
		line-height: 41.65px;
		font-size: 13px;
		color: gray;
		background-color: #fff;
		border: 1px solid #eaeaea;
		border-radius: 5.2px;
		text-align: center;
	}
}
</style>
