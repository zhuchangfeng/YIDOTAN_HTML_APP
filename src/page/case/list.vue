<script type="text/jsx">
import { getCaseTags, getCaseList } from '@/api/api.js'
import similar from '@/components/similar'
export default {
	name: 'Home',
	render(h) {
		const findTag = (id) =>
			this.tags?.[this.tags.findIndex((i) => i.key === id)]?.sonTags
		return (
			<div id='case-id'>
				<div class='choice borderBottom1'>
					<div class='choice-top'>
						{this.tags.map((item, index) => {
							return (
								<div class='choice-type'>
									<div
										class='choice-button fourColor3'
										{...{
											class: [this.selectArr[item.key] !== '0' ? 'hover' : ''],
											on: {
												click: () => this.selectKey(item.key)
											}
										}}
									>
										{item.name}
										<i class='fa fa-sort-desc' aria-hidden='true'></i>
									</div>
									{item.key === this.keyName && (
										<div class='choice-box borderBottom'>
											<div class='choice-groups'>
												<div class='tags-box'>
													{item.sonTags.map((t, g) => {
														return (
															t.value !== 0 && <div
																class='tags-item fourColor3'
																{...{
																	class: [
																		this.selectArr[item.key] === t.value && this.selectArr[item.key] !== '0'
																			? 'hover'
																			: ''
																	],
																	on: {
																		click: () =>
																			this.selectOne(item.key, t.value)
																	}
																}}
															>
																{t.title}
															</div>
														)
													})}
												</div>
											</div>
										</div>
									)}
								</div>
							)
						})}

						<div
							class='choice-order fourColor3'
							{...{
								class: [this.orderObject.isopen ? 'active' : ''],
								on: {
									click: () => {
										this.keyName = null
										this.orderObject.isopen = !this.orderObject.isopen
									}
								}
							}}
						>
							<i class='fa fa-ellipsis-h' aria-hidden='true'></i>
						</div>

						<div
							class='order-box borderBottom'
							{...{
								style: {
									display: this.orderObject.isopen ? 'block' : 'none'
								}
							}}
						>
							<div class='order-div borderBottom'>
								<span>{this.order.name}</span>
								{this.order.sonTags.map((o, s) => {
									return (
										<div
											class='order-item'
											{...{
												class: [
													o.value === this.orderObject[this.order.key]
														? 'fourColor3 hover'
														: ''
												],
												on: {
													click: () =>
														this.orderSelect(this.order.key, o.value)
												}
											}}
										>
											{o.title}
										</div>
									)
								})}
							</div>
						</div>
					</div>
					{Object.values(this.selectArr).some(v => v !== '0') && (
						<div class='choice-select borderTop'>
							<div class='select-box'>
								{Object.keys(this.selectArr).map(value => {
									return (
										this.selectArr[value] !== '0' && <div
											class='select-item'
											{...{ on: { click: () => this.cancelArr(value) }}}
										>
											{findTag(value) &&
												findTag(value)[findTag(value).findIndex((s) => s.value === this.selectArr[value])]?.title}
											<i class='fa fa-times' aria-hidden='true'></i>
										</div>
									)
								})}
							</div>
						</div>
					)}
				</div>
				{this.cases.map((item, index) => {
					return (
						<router-link
							to={{ path: '/new/' + item.group_id }}
							class='essay borderBottom'
						>
							<similar articles={item}></similar>
						</router-link>
					)
				})}
				<div class='picList-more'>
					<div
						class='more-bd fourColor0'
						{...{
							on: { click: () => this.getList({ add: true, async: true }) }
						}}
					>
						{this.loadingText}
					</div>
				</div>
			</div>
		)
	},
	data() {
		return {
			tags: [],
			cases: [],
			selectArr: {
				size: this.$route.params.size, // 户型
				area: this.$route.params.area, // 面积
				budget: this.$route.params.budget, // 预算
				style: this.$route.params.style, // 风格
				type: this.$route.params.type // 类型
			},
			order: {
				group: false,
				key: 'order',
				name: '排序',
				sonTags: [
					{ value: '0', title: '推荐' },
					{ value: '1', title: '最新' },
					{ value: '2', title: '最热' }
				]
			},
			orderObject: {
				order: this.$route.params.order, // 排序
				isopen: false
			},
			keyName: null,
			params: this.$route.params,
			page: 1,
			loadingText: '',
			isLoading: true, // 是否在加载中
			isMore: true // 是否可以加载操作
		}
	},
	methods: {
		// 点击某个分类
		selectKey(key) {
			this.keyName = key === this.keyName ? null : key
			if (this.orderObject.isopen) {
				this.$set(this.orderObject, 'isopen', false)
			}
		},
		async getTages() {
			const { data } = await getCaseTags()
			if (data?.success_code === 200) {
				const tags = data?.data?.tags
				if (this._getType(tags) === 'array') {
					this.tags = tags
				}
			}
		},
		async getList(obj = { add: false }) {
			const { async, page, add } = obj
			if (typeof async !== 'undefined') {
				if (async && !this.isMore) return
				this.isMore = false
			}
			this.loadingText = '加载中...'
			const { data } = await getCaseList({
				params: {
					...this.params,
					page: page || this.page
				}
			})
			if (this.isLoading) {
				this.isLoading = false
			}
			if (data?.success_code === 200) {
				const cases = data?.data?.cases
				if (this._getType(cases) === 'array') {
					if (cases.length > 0) {
						this.page = page ? page + 1 : this.page + 1
						if (add) {
							this.cases = [...this.cases, ...cases]
							if (typeof async !== 'undefined') {
								if (async && !this.isMore) this.isMore = true
							}
						} else {
							this.cases = [...cases]
						}
						this.loadingText = '加载更多'
					} else {
						this.loadingText = '加载完毕'
					}
				}
			}
		},
		// 排序选择
		orderSelect(key, value) {
			if (this.orderObject[key] !== value) {
				this.$set(this.orderObject, key, value)
				this.$set(this.params, key, value)
				this.handlePath()
				this.getTages()
				this.getList({ page: 1 })
			}
			this.$set(this.orderObject, 'isopen', false)
		},
		// 选择某一项
		selectOne(key, value) {
			const select = {
				size: this.params.size, // 户型
				area: this.params.area, // 面积
				budget: this.params.budget, // 预算
				style: this.params.style, // 风格
				type: this.params.type // 类型
			}
			if (select[key] !== value) {
				select[key] = value
				this.selectArr = select
				this.$set(this.params, key, value)
				this.handlePath()
				this.getTages()
				this.getList({ page: 1 })
			}
			this.keyName = null
		},
		// 处理跳转路径
		handlePath() {
			let path = '/case/list'
			Object.keys(this.params).forEach((item) => {
				path += '/' + this.params[item]
			})
			if (this.$route.path === path) return
			this.$router.replace({
				path: path
			})
		},
		// 取消选中
		cancelArr(key) {
			this.$set(this.selectArr, key, '0')
			this.$set(this.params, key, '0')
			this.handlePath()
			this.getTages()
			this.getList({ page: 1 })
		}
	},
	mounted() {
		this.getTages()
		this.getList()
	}
}
</script>
<style lang="less" scoped>
#case-id {
	.choice {
		margin-bottom: 6.25px;
		position: relative;
		.choice-top {
			display: flex;
			align-items: center;
			height: 31.25px;
			padding: 9.375px 48.958px 9.375px 9.375px;
			box-sizing: content-box;
			background-color: #fff;
			position: relative;
			.choice-type {
				font-size: 12px;
				width: 25%;
				padding-right: 7.813px;
				height: 31.25px;
				box-sizing: content-box;
				.choice-button {
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #666;
				}
				i {
					margin-left: 5px;
					vertical-align: middle;
				}
				.choice-box {
					position: absolute;
					width: 100%;
					background-color: #fff;
					top: 50.5px;
					left: 0;
					padding: 9.375px 15.625px;
					box-sizing: border-box;
					z-index: 2;
					.choice-groups {
						.group-title {
							color: #ffa533;
						}
						.tags-box {
							margin-bottom: 5.208px;
							display: flex;
							flex-wrap: wrap;
							.tags-item {
								line-height: 20.828px;
								margin-top: 7.292px;
								margin-right: 7.292px;
								padding: 0 8.333px;
								text-align: center;
								color: #666;
								font-size: 12px;
							}
						}
					}
				}
			}
			.choice-order {
				height: 31.25px;
				line-height: 31.25px;
				color: #888;
				width: 37.5px;
				position: absolute;
				right: 9.375px;
				text-align: center;
				font-size: 20px;
				&.active {
					color: #ffa533;
				}
				i {
					vertical-align: middle;
				}
			}
			.order-box {
				position: absolute;
				width: 100%;
				background-color: #fff;
				top: 50.5px;
				left: 0;
				z-index: 2;
				padding-left: 9.375px;
				box-sizing: border-box;
				.order-div {
					font-size: 12.6px;
					padding: 9.375px 0 9.375px 9.375px;
					display: flex;
					align-items: center;
					input {
						margin-right: 4.167px;
					}
					.order-item {
						height: 31.25px;
						line-height: 31.25px;
						margin-left: 9.375px;
						padding: 0 15.625px;
						color: #666;
						background-color: #f4f4f4;
						font-size: 12px;
						border: 0;
						border-radius: 4.16672px;
						&.hover {
							color: #ffa533;
							background-color: #fff;
						}
					}
				}
			}
		}
		.choice-select {
			width: 100%;
			background-color: #fff;
			padding: 4.6875px 15.625px 9.375px 15.625px;
			box-sizing: border-box;
			.select-box {
				display: flex;
				align-items: center;
				font-size: 12px;
				flex-wrap: wrap;
				.select-item {
					margin-top: 4.6875px;
					height: 27.078px;
					line-height: 27.078px;
					margin-right: 10.417px;
					padding: 0 10.417px;
					color: #fff;
					background-color: #f3af34;
					border-radius: 27.0833px;
				}
			}
		}
	}
	.essay {
		display: block;
		padding: 0 12.5px;
		background-color: #fff;
	}
	.picList-more {
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
</style>
