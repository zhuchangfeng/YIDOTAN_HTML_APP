<script type="text/jsx">
export default {
	props: {
		titleValue: {
			type: String,
			required: false,
			default: 'XXXXXX'
		}
	},
	methods: {
		callBack() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
		}
	},
	render(h) {
		return (
			<div class='TitleBar'>
				<div class='callBack' on-click={this.callBack}>
					<img src='/static/image/arrows.svg' alt='返回上一层' />
				</div>
				<span class='title'>{this.titleValue}</span>
			</div>
		)
	}
}
</script>

<style lang="less" scoped>
.TitleBar {
	width: 100%;
	display: flex;
	height: 52px;
	backdrop-filter: saturate(180%) blur(20px);
	background-color: rgba(255, 255, 255, 0.72);
	transition-property: background-color, backdrop-filter,
		-webkit-backdrop-filter;
	transition: background-color 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);
	box-shadow: -10px 10px 67px -12px rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 0;
	left: 0;
	align-items: center;
	padding: 0 10px;
	box-sizing: border-box;
	font-size: 14px;
	z-index: 9998;
	.callBack {
		height: 100%;
		display: flex;
		align-items: center;
		img {
			width: 20px;
			height: 20px;
		}
	}
	.title {
		flex: 1;
		text-align: center;
	}
}
</style>
