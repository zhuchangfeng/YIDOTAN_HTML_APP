<template>
	<div id="HelloWorld">
		<span>{{$t("brands.nike")}}</span>
		<span>{{$t("test")}}</span>
		<button @click="changLang">切换语言</button>
		<div class="bubble-tip"></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {}
	},
	computed: {
		// 获取状态仓库的batch
		...mapGetters('Felix', {
			test: 'getTest'
		}),
		...mapGetters('Jack', {
			jack: 'getTest'
		})
	},
	methods: {
		changLang() {
			const locale = this.$i18n.locale === 'zh-CN' ? 'en-US' : 'zh-CN'
			this.$i18n.locale = locale
		}
	},
	mounted() {
		console.log(this.test)
		console.log(this.jack)
		var obj = { a: 1, b: 3, c: 4 }
		function foo(obj) {
			return Object.keys(obj).reduce((self, key) => {
				if (obj[key] > 2) {
					self[key] = obj[key]
				}
				return self
			}, {})
		}

		console.log(foo(obj))
	}
}
</script>

<style lang="less">
.bubble-tip {
	width: 100px;
	height: 30px;
	line-height: 30px;
	margin-left: 10px;
	border: 1px solid #c5c5c5;
	border-radius: 4px;
	position: relative;
	background-color: #fff;
	&::before {
		content: "";
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 10px 10px 0;
		border-color: transparent #ffffff transparent transparent;
		position: absolute;
		top: 5px;
		left: -10px;
		z-index: 2;
	}
	&::after {
		content: "";
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 10px 10px 0;
		border-color: transparent #c5c5c5 transparent transparent;
		position: absolute;
		top: 5px;
		left: -11px;
		z-index: 1;
	}
}
</style>
