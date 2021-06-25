<<<<<<< HEAD
<template>
	<div id="similar" ref="similar">
		<router-link
			class="borderBottom"
			:to="{ path: '/master/' + item.data }"
			v-for="(item, index) in articles"
			:key="index"
		>
			<similar :articles="item.info"></similar>
		</router-link>
		<div class="similar__more">
			<div class="similar__more--bd fourColor0" @click="getList">
				{{ loadingText }}
			</div>
		</div>
	</div>
</template>

<script>
import similar from '@/components/similar'
import { getSimilarList } from '@/api/api.js'
export default {
	components: {
		similar
	},
	data() {
		return {
			page: 1,
			loading: null,
			articles: [],
			loadingText: ''
		}
	},
	methods: {
		async getList() {
			const {
				similar: { scrollTop: scrollTop }
			} = this.$refs
			this.loading = this.$loading({
				target: document.getElementById('similar')
			})
			this.loadingText = '加载中...'
			const { data: data } = await getSimilarList({
				params: {
					page: this.page
				}
			})
			if (this.loading) {
				this.loading.close()
				this.loading = null
			}
			if (data?.success_code === 200) {
				const articles = data?.data?.articles
				if (this._getType(articles) === 'array') {
					if (articles.length > 0) {
						if (this.page === 1) {
							this.articles = [...articles]
						} else if (this.page > 1) {
							this.articles = [...this.articles, ...articles]
							this.$nextTick(() => {
								if (scrollTop) {
									similar.scrollTop = scrollTop
								}
							})
						}
						this.page = this.page + 1
						this.loadingText = '加载更多'
					} else {
						this.loadingText = '加载完毕'
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
#similar {
	a {
		display: block;
		background-color: #fff;
		padding: 0 12.5px;
	}
	.similar__more {
		padding: 9.375px;
		&--bd {
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
=======
<template>
  <div id="similar">
    <router-link
      class="borderBottom"
      :to="{ path: '/master/'+item.data}"
      v-for="(item,index) in articles"
      :key="index"
    >
      <similar :articles="item.info"></similar>
    </router-link>
    <div class="similar-more">
      <div class="more-bd fourColor0" @click="getList">{{loadingText}}</div>
    </div>
  </div>
</template>

<script>
import similar from "@/components/similar";
import { getSimilarList } from "@/api/api.js";
export default {
  components: {
    similar
  },
  data() {
    return {
      page: 1,
      loading: null,
      articles: [],
      loadingText: ""
    };
  },
  methods: {
    async getList() {
      this.loading = this.$loading({
        target: document.getElementById("similar")
      });
      this.loadingText = "加载中...";
      const { data: data } = await getSimilarList({
        params: {
          page: this.page
        }
      });
      if (this.loading) {
        this.loading.close();
        this.loading = null;
      }
      if (data?.success_code == 200) {
        const articles = data?.data?.articles;
        if (this._getType(articles) == "array") {
          if (articles.length > 0) {
            if (this.page == 1) {
              this.articles = [...articles];
            } else if (this.page > 1) {
              this.articles = [...this.articles, ...articles];
            }
            this.page = this.page + 1;
            this.loadingText = "加载更多";
          } else {
            this.loadingText = "加载完毕";
          }
        }
      }
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
#similar {
  a {
    display: block;
    background-color: #fff;
    padding: 0 12.5px;
  }
  .similar-more {
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
>>>>>>> d9854a9668d7b8b2f650720eb7dd09112bdad40f
