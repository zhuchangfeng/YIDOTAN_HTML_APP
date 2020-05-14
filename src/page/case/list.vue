<script type="text/jsx">
import { getCaseTags, getCaseList } from "@/api/api.js";
import similar from "@/components/similar";
export default {
	name: "home",
	data() {
		return {
			tags: [],
			cases: [],
			selectArr: {
				size: this.$route.params.size, //户型
				area: this.$route.params.area, //面积
				budget: this.$route.params.budget, //预算
				style: this.$route.params.style, //风格
				type: this.$route.params.type //类型
			},
			order: {
				group: false,
				key: "order",
				name: "排序",
				sonTags: [
					{ value: "0", title: "推荐" },
					{ value: "1", title: "最新" },
					{ value: "2", title: "最热" }
				]
			},
			orderObject: {
				order: this.$route.params.order, //排序
				isopen: false
			},
			keyName: null,
			params: this.$route.params,
			page: 1
		};
	},
	methods: {
		//点击某个分类
		selectKey(key) {
			this.keyName = key == this.keyName ? null : key;
			if (this.orderObject.isopen) {
				this.$set(this.orderObject, "isopen", false);
			}
		},
		async getTages() {
			const { data } = await getCaseTags();
			if (data?.success_code == 200) {
				const tags = data?.data?.tags;
				if (this._getType(tags) == "array") {
					this.tags = tags;
				}
			}
		},
		async getList() {
			const { data } = await getCaseList({
				params: {
					...this.params,
					page: this.page
				}
			});
			if (data?.success_code == 200) {
				const cases = data?.data?.cases;
				if (this._getType(cases) == "array") {
					if (cases.length > 0) {
						this.cases = [...this.cases, ...cases];
					}
				}
			}
		},
		// 排序选择
		orderSelect(key, value) {
			if (this.orderObject[key] !== value) {
				this.$set(this.orderObject, key, value);
				this.$set(this.params, key, value);
				this.handlePath();
			}
			this.$set(this.orderObject, "isopen", false);
		},
		// 选择某一项
		selectOne(key, value) {
			let select = {
				size: this.params.size, //户型
				area: this.params.area, //面积
				budget: this.params.budget, //预算
				style: this.params.style, //风格
				type: this.params.type //类型
			};
			if (select[key] !== value) {
				select[key] = value;
				this.selectArr = select;
				this.$set(this.params, key, value);
				this.handlePath();
			}
			this.keyName = null;
		},
		// 处理跳转路径
		handlePath() {
			let path = "/case/list";
			Object.keys(this.params).forEach(item => {
				path += "/" + this.params[item];
			});
			this.$router.replace({
				path: path
			});
		}
	},
	mounted() {
		this.getTages();
		this.getList();
	},
	render(h) {
		return (
			<div id="case-id">
				<div class="choice borderBottom1">
					<div class="choice-top">
						{this.tags.map((item, index) => {
							return (
								<div class="choice-type">
									<div
										class="choice-button fourColor3"
										{...{
											class: [this.selectArr[item.key] ? "hover" : ""],
											on: {
												click: () => this.selectKey(item.key)
											}
										}}
									>
										{item.name}
										<i class="fa fa-sort-desc" aria-hidden="true"></i>
									</div>
									{item.key == this.keyName && (
										<div class="choice-box borderBottom">
											<div class="choice-groups">
												<div class="tags-box">
													{item.sonTags.map((t, g) => {
														return (
															<div
																class="tags-item fourColor3"
																{...{
																	class: [
																		this.selectArr[item.key] == t.value
																			? "hover"
																			: ""
																	],
																	on: {
																		click: () =>
																			this.selectOne(item.key, t.value)
																	}
																}}
															>
																{t.title}
															</div>
														);
													})}
												</div>
											</div>
										</div>
									)}
								</div>
							);
						})}

						<div
							class="choice-order fourColor3"
							{...{
								class: [this.orderObject.isopen ? "active" : ""],
								on: {
									click: () => {
										this.keyName = null;
										this.orderObject.isopen = !this.orderObject.isopen;
									}
								}
							}}
						>
							<i class="fa fa-ellipsis-h" aria-hidden="true"></i>
						</div>

						<div
							class="order-box borderBottom"
							{...{
								style: {
									display: this.orderObject.isopen ? "block" : "none"
								}
							}}
						>
							<div class="order-div borderBottom">
								<span>{this.order.name}</span>
								{this.order.sonTags.map((o, s) => {
									return (
										<div
											class="order-item"
											{...{
												class: [
													o.value == this.orderObject[this.order.key]
														? "fourColor3 hover"
														: ""
												],
												on: {
													click: () => this.orderSelect(this.order.key, o.value)
												}
											}}
										>
											{o.title}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				{this.cases.map((item, index) => {
					return (
						<router-link
							to={{ path: "/new/" + item.group_id }}
							class="essay borderBottom"
						>
							<similar articles={item}></similar>
						</router-link>
					);
				})}
			</div>
		);
	}
};
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
}
</style>
