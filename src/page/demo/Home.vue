<template>
  <div id="home">
    <span>This is a Home Page</span>
    <Home1 :test="444" name="55" age="545"></Home1>
    <Home2></Home2>
    <Profile :propsExtend="555555"></Profile>
    <button @click="mixinhh">我是测试</button>
    <div class="test"></div>
    <van-cell is-link @click="showPopup">展示弹出层</van-cell>
    <van-popup v-model="show" position="top" :style="{ height: '20%' }"></van-popup>
  </div>
</template>

<script>
import { importComponents } from '@/Plugin/Plugins'
import { mixinTest } from '@/mixins/mixinTest'
import { Dialog } from 'vant'
export default {
	mixins: [mixinTest],
	data() {
		return {
			show: false
		}
	},
	methods: {
		test: function() {
			console.log('object')
		},
		showPopup() {
			this.show = true
		}
	},
	components: {
		...importComponents('Home'),
		[Dialog.Component.name]: Dialog.Component
	},
	mounted() {
		console.log(importComponents('Home'))
		console.log(this.$children)
	}
}
</script>

<style lang="less">
#home {
  span {
    font-size: 20px;
  }
  .test {
    width: 250px; //250px/350px
    height: 200px;
    background-color: #00ff00;
  }
}
</style>
