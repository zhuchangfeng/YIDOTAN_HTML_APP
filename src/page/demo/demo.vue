<template>
  <div id="dome">
    <span>{{value|mobileFilter}}</span>
    <span>{{kpi.name}}</span>
    <span>{{kpi.age}}</span>
    <button @click="deleteKpi">删除属性</button>
  </div>
</template>

<script>
export default {
	data() {
		return {
			value: '15816792255',
			kpi: {
				name: '555',
				age: '+6666'
			}
		}
	},
	methods: {
		mediaPause(e) {
			console.log('object')
			console.log(e)
		},
		deleteKpi() {
			this.$delete(this.kpi, 'name')
		}
	},
	filters: {
		mobileFilter: function(value) {
			var len = value.length
			var x = value.substring(3, len - 4)
			var values = value.replace(x, '****')
			return values
		}
	}
}
</script>

<style lang="less" scoped>
#dome{

}
</style>
