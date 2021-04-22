<template>
	<div id="list">
		<router-link
			:to="{ path: '/zhongce/' + item.test_id }"
			v-for="(item, index) in mtests"
			:key="index"
		>
			<zhongce :mtests="item"></zhongce>
		</router-link>
		<div class="list__more">
			<div class="list__more--bd fourColor0" @click="getList">
				{{ loadingText }}
			</div>
		</div>
	</div>
</template>

<script>
import { getZhongceList } from '@/api/api.js'
import zhongce from '@/components/zhongce.vue'
export default {
	data() {
		return {
			page: 1,
			isasss: true,
			mtests: [],
			loadingText: '',
			loading: null
		}
	},
	components: {
		zhongce
	},
	methods: {
		async getList() {
			this.loading = this.$loading({
				target: document.getElementById('list')
			})
			this.loadingText = '加载中...'
			const { data: data } = await getZhongceList({
				params: {
					page: this.page
				}
			})
			if (data?.success_code === 200) {
				const mtests = data?.data?.mtests
				if (this._getType(mtests) === 'array') {
					if (mtests.length > 0) {
						if (this.page === 1) {
							this.mtests = [...mtests]
						} else if (this.page > 1) {
							this.mtests = [...this.mtests, ...mtests]
						}
						this.page = this.page + 1
						this.loadingText = '加载更多'
					} else {
						this.loadingText = '加载完毕'
					}
				}
			}
			if (this.loading) {
				this.loading.close()
				this.loading = null
			}
		}
	},
	mounted() {
		this.getList()
		var arr = '555:ssss 66:ooo'
		var arre = arr.split('\n').map((_) => _.split(':'))
		const obj = {}
		for (const x of arre) {
			const [key, value] = x
			obj[key] = value
		}
		console.log(obj)
	}
}
</script>

<style lang="less" scoped>
#list {
	a {
		margin-bottom: 10.417px;
		display: block;
		&:hover {
			text-decoration: none;
		}
	}
	.list__more {
		padding: 9.375px;
		box-sizing: border-box;
		&--bd {
			display: block;
			height: 41.6563px;
			line-height: 41.6563px;
			margin: 0 auto;
			font-size: 12.5px;
			text-align: center;
			color: gray;
			background-color: #fff;
		}
	}
}
</style>
