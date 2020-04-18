<template>
	<div id="list">
		<router-link :to="{ path: '/zhongce/'+item.test_id}" v-for="(item,index) in mtests" :key="index">
			<zhongce :mtests="item"></zhongce>
		</router-link>
		<div class="list-more">
			<div class="more-bd fourColor0" @click="getList">{{loadingText}}</div>
		</div>
	</div>
</template>

<script>
import { getZhongceList } from "@/api/api.js";
import { getStyle, isDom } from "@/Plugin/dom/dom.js";
import zhongce from "@/components/zhongce.vue";
export default {
	data() {
		return {
			page: 1,
			isasss: true,
			mtests: [],
			loadingText: "",
			loading: null
		};
	},
	components: {
		zhongce
	},
	methods: {
		async getList() {
			this.loading = this.$loading({
				target: document.getElementById("list")
			});
			this.isLoading = true;
			this.loadingText = "加载中...";
			const { data: data } = await getZhongceList({
				params: {
					page: this.page
				}
			});
			if (this.loading) {
				this.loading.close();
				this.loading = null;
			}
			if (data.success_code == 200) {
				if (this._getType(data) == "object") {
					if (data.data.hasOwnProperty("mtests")) {
						const { mtests } = data.data;
						if (this._getType(mtests) == "array") {
							if (mtests.length > 0) {
								if (this.page == 1) {
									this.mtests = [...mtests];
								} else if (this.page > 1) {
									this.mtests = [...this.mtests, ...mtests];
								}
								this.page = this.page + 1;
								this.loadingText = "加载更多";
							} else {
								this.loadingText = "加载完毕";
							}
						}
					}
				}
			}
		}
	},
	mounted() {
		this.getList();
	},
};
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
	.list-more {
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