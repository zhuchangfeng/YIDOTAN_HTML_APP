<script type="text/jsx">
export default {
	name: 'Home',
	data() {
		return {
			name: '555',
			age: '18',
			list: ['s', 's', 's', 'fff'],
			value: ''
		}
	},
	methods: {
		getClick() {
			console.log('5555')
		},
		getValue(item, index) {
			return () => {
				console.log(item, index)
			}
		}
	},
	render(h) {
		function isAge() {
			let isAge = null
			if (this.age >= 18) {
				isAge = '满周18岁'
			} else {
				isAge = '未成年'
			}
			return <p onClick={this.getClick}>{isAge}</p>
		}

		return (
			<div class='sss'>
				{this.name}
				{isAge.apply(this)}
				<div class='gsgsg'>
					{this.list.map((item, index) => {
						return <p onClick={this.getValue(item, index)}>{item}</p>
					})}
				</div>
				<div class='input'>

				</div>
			</div>
		)
	}
}
</script>

<style lang="less" scoped>
.sss{
	.gsgsg{
		color: #00ff00;
	}
}
</style>
