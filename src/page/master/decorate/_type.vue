<template>
  <div id="master-decorate" v-loading.body="isLoading">
    <router-link
      class="borderBottom"
      :to="{ path: '/master/' + item.tid }"
      v-for="(item, index) in guides"
      :key="index"
    >
      <similar :articles="item"></similar>
    </router-link>
    <div class="decorate-more">
      <div class="more-bd fourColor0" @click="getList">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script>
import { getDecorateList } from '@/api/api.js'
import similar from '@/components/similar.vue'
export default {
	data() {
		return {
			guides: [], // 数据
			loadingText: '',
			page: 1,
			isLoading: true,
			type: this.$route.params.type
		}
	},
	components: {
		similar
	},
	methods: {
		async getList() {
			this.isLoading = true
			this.loadingText = '加载中...'
			const {
				data: { data: data, success_code: success_code }
			} = await getDecorateList({
				params: {
					type: this.type
				}
			})
			this.isLoading = false
			if (success_code === 200) {
				if (this._getType(data) === 'object') {
					const { guides: guides } = data
					if (this._getType(guides) === 'array') {
						if (guides.length > 0) {
							if (this.page === 1) {
								this.guides = [...guides]
							} else if (this.page > 1) {
								this.guides = [...this.guides, ...guides]
							}
							this.page = this.page + 1
							this.loadingText = '加载更多'
						} else {
							this.loadingText = '加载完毕'
						}
					}
				}
			}
		}
	},
	mounted() {
		this.getList()
	}
}
</script>

<style lang="less" scoped>
#master-decorate {
  a {
    display: block;
    background-color: #fff;
    padding: 0 12.5px;
  }
  .decorate-more {
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
