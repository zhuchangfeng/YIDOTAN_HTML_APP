export const mixinTest = {
	data() {
		return {
			testValue: '我是mixinTest1'
		}
	},
	created() {
		console.log(this.testValue)
	},
	methods: {
		mixinhh() {
			console.log('this is a test')
		}
	}
}
