<script type="text/jsx">
import chooseComp from "./anchoredHeading.vue";
export default {
	name: "home",
	data() {
		return {
			name: "555",
			age: "15",
			list: ["s", "s", "s", "fff"],
			value: ""
		};
	},
	methods: {
		getClick() {
			console.log("5555");
		},
		getValue(item, index, e) {
			console.log(item, index, e);
		},
		changeValue(e) {
			const value = e?.target?.value;
			this.value = value;
		},
		test(age) {
			console.log(age);
		}
	},
	render(h) {
		const data={
			class:['b','c']
		}
		return (
			<div class="sss">
				{this.name}
				<p onClick={this.getClick}>{this.age >= 18 ? "满周18岁" : "未成年"}</p>
				<div class="gsgsg">
					{this.list.map((item, index) => {
						return <p on-click={e => this.getValue(item, index, e)}>{item}</p>;
					})}
				</div>
				<div class="input">
					<input
						type="search"
						maxlength="32"
						placeholder="搜索掘金"
						class="search-input"
						onInput={this.changeValue}
					/>
					<span>{this.value}</span>
				</div>
				{this.list.map((item, index) => {
					return (
						<chooseComp
							level={index + 1}
							on-show={this.test}
							class="aaa"
							{...data}
						>
						</chooseComp>
					);
				})}
			</div>
		);
	}
};
</script>
<style lang="less" scoped>
.sss {
	.gsgsg {
		color: #00ff00;
		font-size: 24px;
	}
}
</style>