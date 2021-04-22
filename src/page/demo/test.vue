<template>
  <div id="test">
    <div class="container">
      <div class="container-l">
        <ul>
          <li
            v-for="(item,index) in menuData"
            :key="index"
            :class="[defaultIndex==index?'active':'']"
            @click="changOne(index)"
          >
            <img src="/static/image/arrows.svg" alt srcset v-if="defaultIndex==index"/>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="container-r">
      </div>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			defaultIndex: 0,
			menuData: [
				{
					name: '个人中心'
				},
				{
					name: '我的信息'
				},
				{
					name: '我的订单'
				},
				{
					name: '我的卡券'
				},
				{
					name: '常用乘客'
				},
				{
					name: '重要通知'
				}
			]
		}
	},
	methods: {
		changOne(index) {
			if (index !== this.defaultIndex) {
				this.defaultIndex = index
			}
		}
	}
}
</script>

<style lang="less" scoped>
#test {
  .container {
    width: 300px;
    min-height: 150px;
    margin: 0 auto;
    .container-l {
      width: 50px;
      float: left;
      background-color: #fff;
      padding: 0 4px;
      box-sizing: border-box;
      ul {
          user-select: none;
        li {
          display: block;
          line-height: 12px;
          padding-left: 4px;
          border-bottom: 1px solid #cccc;
          &:last-child {
            border-bottom: 0;
          }
          &.active {
            color: rgb(21, 178, 206);
          }
          img {
            width: 4px;
            height: 4px;
            display: inline-block;
            vertical-align: text-bottom;
          }
        }
      }
    }
    .container-r {
      width: 245px;
      height: 250px;
      background-color: red;
      float: right;
    }
  }
}
</style>
