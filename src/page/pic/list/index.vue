<<<<<<< HEAD
<template>
	<div id="picList" v-loading.body="isLoading">
		<div class="choice borderBottom1">
			<div class="choice-top">
				<div class="choice-type" v-for="(item, index) in tags" :key="index">
					<div
						:class="[
							'choice-button',
							'fourColor3',
							selectArr[item.key] && selectArr[item.key] != '0' ? 'hover' : '',
						]"
						@click="selectKey(item.key)"
					>
						{{ item.name }}
						<i class="fa fa-sort-desc" aria-hidden="true"></i>
					</div>
					<div class="choice-box borderBottom" v-show="item.key == keyName">
						<div class="choice-groups" v-for="(v, k) in item.groups" :key="k">
							<div class="group-title">{{ v.name }}</div>
							<div class="tags-box">
								<div
									:class="[
										'tags-item',
										'fourColor3',
										selectArr[item.key] == t.value ? 'hover' : '',
									]"
									v-for="(t, g) in v.sonTags"
									:key="g"
									@click="selectOne(item.key, t.value)"
								>
									{{ t.value }}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					:class="[
						'choice-order',
						'fourColor3',
						orderObject.isopen ? 'active' : '',
					]"
					@click="
						keyName = null;
						orderObject.isopen = !orderObject.isopen;
					"
				>
					<i class="fa fa-ellipsis-h" aria-hidden="true"></i>
				</div>

				<div
					class="order-box borderBottom"
					v-if="order.sonTags.length > 0"
					v-show="orderObject.isopen"
				>
					<div class="order-div borderBottom">
						<span>{{ order.name }}</span>
						<div
							:class="[
								'order-item',
								o.value == orderObject[order.key] ? 'fourColor3 hover' : '',
							]"
							v-for="(o, s) in order.sonTags"
							:key="s"
							@click="orderSelect(order.key, o.value)"
						>
							{{ o.title }}
						</div>
					</div>
					<div class="order-div">
						<input
							type="checkbox"
							name="sharing"
							id="sharing"
							v-model="orderObject.sharing"
							@change="handleCheck"
						/>
						<label for="sharing">有购物单</label>
					</div>
				</div>
			</div>

			<div
				class="choice-select borderTop"
				v-if="Object.keys(selectArr).length > 0"
			>
				<div class="select-box">
					<div
						class="select-item"
						v-for="(item, index) in selectArr"
						:key="index"
						@click="cancelArr(index)"
					>
						{{ item }}
						<i class="fa fa-times" aria-hidden="true"></i>
					</div>
				</div>
			</div>
		</div>

		<div id="scenes">
			<div
				class="scenes-padding"
				v-for="(item, index) in pics"
				:key="index"
				ref="scenes"
			>
				<router-link
					class="scenes-item fourColor0"
					:to="{
						path:
							'/pic/slice/' +
							item.match_id +
							'/' +
							params.space +
							'/' +
							params.style +
							'/' +
							params.part +
							'/' +
							params.soft +
							'/' +
							params.order +
							'/' +
							params.sharing,
					}"
					exact
				>
					<div
						class="scenes-pic"
						:img_h="item.data.info.img_h"
						:img_w="item.data.info.img_w"
						ref="pic"
					>
						<img
							v-lazy="item.small_image"
							:alt="'背景图' + index"
							class="lazy"
						/>
						<i class="fa fa-tag" aria-hidden="true" v-if="item.tag_jump"></i>
					</div>
					<div class="scenes-bottom">
						<div class="scenes-title" v-if="item.case_title">
							{{ item.case_title | handleText }}
						</div>
						<div class="scenes-avatar">
							<div class="avatar-img">
								<img
									v-lazy="item.user_pic"
									:alt="item.user_name"
									class="lazy"
								/>
							</div>
							<div class="avatar-name">{{ item.user_name }}</div>
							<div class="avatar-collect" v-if="item.favtimes > 0">
								<i class="fa fa-star" aria-hidden="true"></i>
								{{ item.favtimes }}
							</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<div class="picList-more">
			<div
				class="more-bd fourColor0"
				@click="getList({ add: true, async: true })"
			>
				{{ loadingText }}
			</div>
		</div>
	</div>
</template>

<script>
import { getAlbum, getActivitetags } from '@/api/api.js'
import { getStyle, setStyle } from '@/Plugin/dom/dom.js'
export default {
	name: 'PicList',
	data() {
		return {
			isLoading: true, // 是否在加载中
			isMore: true, // 是否可以加载操作
			tags: [],
			pics: [],
			order: {
				group: false,
				key: 'order',
				name: '排序',
				sonTags: [
					{ value: '0', title: '推荐' },
					{ value: '1', title: '最新' },
					{ value: '2', title: '最热' }
				]
			},
			keyName: null,
			selectArr: {
				space: this.$route.params.space, // 空间
				style: this.$route.params.style, // 风格
				part: this.$route.params.part, // 硬装
				soft: this.$route.params.soft // 软装
			},
			orderObject: {
				order: this.$route.params.order, // 排序
				sharing: Number(this.$route.params.sharing), // 有购物单
				isopen: false
			},
			params: this.$route.params,
			page: 1,
			loadingText: '',
			even: {
				// 偶数
				maxHeight: 0,
				lastDom: null
			},
			odd: {
				// 奇数
				maxHeight: 0,
				lastDom: null
			},
			updateLength: 0
		}
	},
	watch: {
		selectArr: {
			handler: function(newval) {
				for (const key in newval) {
					if (newval?.[key]) {
						const element = newval[key]
						if (!element) {
							this.$delete(this.selectArr, key)
						} else {
							if (/^[0-9]*$/.test(element)) {
								if (!Number(element)) {
									this.$delete(this.selectArr, key)
								}
							}
						}
					}
				}
			},
			immediate: true, // 是否初始化执行
			deep: false // 是否深度监听
		},
		pics(newVal) {
			this.$nextTick(() => {
				if (Object.keys(this.$refs).length > 0) {
					const page = this.page - 1 > 1 ? this.page - 1 : 1
					const result = this.$refs.pic.slice(-this.updateLength)
					const scenes = this.$refs.scenes.slice(-this.updateLength)
					// 默认列数
					const col = 2
					if (this._getType(result) === 'array') {
						result.forEach((item, index) => {
							const img_h = item.getAttribute('img_h')
							const img_w = item.getAttribute('img_w')
							const width = getStyle(item, 'width')
							if (typeof width === 'string') {
								const height = (img_h / img_w) * width.replace('px', '')
								if (img_h && img_w) {
									setStyle(item, 'height', height + 'px')
								}
							}
						})
					}
					if (this._getType(scenes) === 'array') {
						if (page === 1) {
							this.even.maxHeight = 0
							this.odd.maxHeight = 0
							this.even.lastDom = null
							this.odd.lastDom = null
						}
						scenes.forEach((item, index) => {
							// 奇数
							if ((index + 1) % col) {
								setStyle(item, 'top', this.odd.maxHeight + 'px')
								setStyle(item, 'left', '0px')
								this.odd.lastDom = item
								this.odd.maxHeight += item.getClientRects()[0].height
							} else {
								// 偶数
								const preScenes = scenes[
									index - 1 === -1 ? 0 : index - 1
								].getClientRects()[0].width
								setStyle(item, 'left', preScenes + 'px')
								setStyle(item, 'top', this.even.maxHeight + 'px')
								this.even.lastDom = item
								this.even.maxHeight += item.getClientRects()[0].height
							}
						})
						// even:偶数  odd：基数
						if (this.even.maxHeight >= this.odd.maxHeight) {
							const lastDOMRectList = this.even.lastDom.getClientRects()[0]
							if (
								this.odd.maxHeight + lastDOMRectList.height <
								this.even.maxHeight
							) {
								setStyle(this.even.lastDom, 'left', '0px')
								setStyle(this.even.lastDom, 'top', this.odd.maxHeight + 'px')
								this.even.maxHeight =
									this.even.maxHeight - lastDOMRectList.height
								this.odd.maxHeight =
									this.odd.maxHeight + lastDOMRectList.height
							}
						} else {
							const lastDOMRectList = this.odd.lastDom.getClientRects()[0]
							if (
								this.even.maxHeight + lastDOMRectList.height <
								this.odd.maxHeight
							) {
								setStyle(
									this.odd.lastDom,
									'left',
									lastDOMRectList.width + 'px'
								)
								setStyle(this.odd.lastDom, 'top', this.even.maxHeight + 'px')
								this.odd.maxHeight =
									this.odd.maxHeight - lastDOMRectList.height
								this.even.maxHeight =
									this.even.maxHeight + lastDOMRectList.height
							}
						}
						const max = Math.max(this.even.maxHeight, this.odd.maxHeight)
						setStyle(document.getElementById('scenes'), 'height', max + 'px')
					}
				}
			})
		}
	},
	methods: {
		async getTages() {
			const { data } = await getActivitetags({ params: this.params })
			if (data?.success_code === 200) {
				const tags = data?.data?.tags
				if (this._getType(tags) === 'array') {
					const group = tags.reduce((item, value) => {
						if (value.group) {
							item.push(value)
						} else {
							this.$set(this.order, 'group', value.group)
							this.$set(this.order, 'key', value.key)
							this.$set(this.order, 'name', value.name)
						}
						return item
					}, [])
					this.tags = group
				}
			}
		},
		// 获取列表
		async getList(obj = { add: false }) {
			const asyncStatus = obj?.async
			if (typeof asyncStatus !== 'undefined') {
				if (asyncStatus && !this.isMore) return
				this.isMore = false
			}
			this.loadingText = '加载中...'
			const { data } = await getAlbum({
				params: {
					...this.params,
					page: obj?.page ? obj.page : this.page
				}
			})
			if (this.isLoading) {
				this.isLoading = false
			}
			if (data?.success_code === 200) {
				const pics = data?.data?.pics
				if (this._getType(pics) === 'array') {
					if (pics.length > 0) {
						this.updateLength = pics.length
						this.page = obj?.page ? obj.page + 1 : this.page + 1
						if (obj?.add) {
							this.pics = [...this.pics, ...pics]
							if (typeof asyncStatus !== 'undefined') {
								if (asyncStatus && !this.isMore) this.isMore = true
							}
						} else {
							this.pics = [...pics]
						}
						this.loadingText = '加载更多'
					} else {
						this.loadingText = '加载完毕'
					}
				}
			}
		},
		// 点击某个分类
		selectKey(key) {
			this.keyName = key === this.keyName ? null : key
			if (this.orderObject.isopen) {
				this.$set(this.orderObject, 'isopen', false)
			}
		},
		// 选择某一项
		selectOne(key, value) {
			const select = {
				space: this.$route.params.space, // 空间
				style: this.$route.params.style, // 风格
				part: this.$route.params.part, // 硬装
				soft: this.$route.params.soft // 软装
			}
			if (select[key] !== value) {
				select[key] = value
				this.selectArr = select
				this.$set(this.params, key, value)
				this.handlePath()
				this.getTages()
				this.getList({ page: 1 })
			}
			this.keyName = null
		},
		// 取消选中
		cancelArr(key) {
			this.$delete(this.selectArr, key)
			this.$set(this.params, key, '0')
			this.handlePath()
			this.getTages()
			this.getList({ page: 1 })
		},
		// 有购物单单选框改变
		handleCheck(e) {
			const value = e.target.checked
			const name = e.target.name
			this.$set(this.params, name, Number(value))
			this.handlePath()
			this.getTages()
			this.getList({ page: 1 })
		},
		// 排序选择
		orderSelect(key, value) {
			if (this.orderObject[key] !== value) {
				this.$set(this.orderObject, key, value)
				this.$set(this.params, key, value)
				this.handlePath()
				this.getTages()
				this.getList({ page: 1 })
			}
			this.$set(this.orderObject, 'isopen', false)
		},
		// 处理跳转路径
		handlePath() {
			let path = '/pic/list'
			console.log(this.params)
			Object.keys(this.params).forEach((item) => {
				path += '/' + this.params[item]
			})
			this.$router.push({
				path: path
			})
		}
	},
	filters: {
		handleText(value) {
			let text = ''
			if (value) {
				text = value.substring(0, 20) + '...'
			}
			return text
		}
	},
	mounted() {
		this.getTages()
		this.getList()
	}
}
</script>

<style lang="less" scoped>
#picList {
	width: 100%;
	height: 100%;
	overflow: auto;
	.choice {
		margin-bottom: 6.25px;
		position: relative;
		.choice-top {
			display: flex;
			align-items: center;
			height: 31.25px;
			padding: 9.375px 48.958px 9.375px 9.375px;
			box-sizing: content-box;
			background-color: #fff;
			position: relative;
			.choice-type {
				font-size: 12px;
				width: 25%;
				padding-right: 7.813px;
				height: 31.25px;
				box-sizing: content-box;
				.choice-button {
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #666;
				}
				i {
					margin-left: 5px;
					vertical-align: middle;
				}
				.choice-box {
					position: absolute;
					width: 100%;
					background-color: #fff;
					top: 50.5px;
					left: 0;
					padding: 9.375px 15.625px;
					box-sizing: border-box;
					z-index: 2;
					.choice-groups {
						.group-title {
							color: #ffa533;
						}
						.tags-box {
							margin-bottom: 5.208px;
							display: flex;
							flex-wrap: wrap;
							.tags-item {
								line-height: 20.828px;
								margin-top: 7.292px;
								margin-right: 7.292px;
								padding: 0 8.333px;
								text-align: center;
								color: #666;
								font-size: 12px;
							}
						}
					}
				}
			}
			.choice-order {
				height: 31.25px;
				line-height: 31.25px;
				color: #888;
				width: 37.5px;
				position: absolute;
				right: 9.375px;
				text-align: center;
				font-size: 20px;
				&.active {
					color: #ffa533;
				}
				i {
					vertical-align: middle;
				}
			}
			.order-box {
				position: absolute;
				width: 100%;
				background-color: #fff;
				top: 50.5px;
				left: 0;
				z-index: 2;
				padding-left: 9.375px;
				box-sizing: border-box;
				.order-div {
					font-size: 12.6px;
					padding: 9.375px 0 9.375px 9.375px;
					display: flex;
					align-items: center;
					input {
						margin-right: 4.167px;
					}
					.order-item {
						height: 31.25px;
						line-height: 31.25px;
						margin-left: 9.375px;
						padding: 0 15.625px;
						color: #666;
						background-color: #f4f4f4;
						font-size: 12px;
						border: 0;
						border-radius: 4.16672px;
						&.hover {
							color: #ffa533;
							background-color: #fff;
						}
					}
				}
			}
		}
		.choice-select {
			width: 100%;
			background-color: #fff;
			padding: 4.6875px 15.625px 9.375px 15.625px;
			box-sizing: border-box;
			.select-box {
				display: flex;
				align-items: center;
				font-size: 12px;
				flex-wrap: wrap;
				.select-item {
					margin-top: 4.6875px;
					height: 27.078px;
					line-height: 27.078px;
					margin-right: 10.417px;
					padding: 0 10.417px;
					color: #fff;
					background-color: #f3af34;
					border-radius: 27.0833px;
				}
			}
		}
	}
	#scenes {
		position: relative;
		font-size: 12px;
		.scenes-padding {
			position: absolute;
			padding: 0 4.167px 4.167px 4.167px;
			width: 50%;
			.scenes-item {
				position: relative;
				display: block;
				.scenes-pic {
					border-top-left-radius: 4.16672px;
					border-top-right-radius: 4.16672px;
					border-bottom-right-radius: 0;
					border-bottom-left-radius: 0;
					overflow: hidden;
					background-color:#f2f2f2;
					.fa-tag {
						position: absolute;
						color: #fff;
						z-index: 1;
						top: 5.208px;
						right: 5.208px;
						font-size: 14px;
						transform: rotate(90deg);
						padding: 3.042px 4.167px;
						background-color: rgba(51, 51, 51, 0.6);
						border-radius: 3.12504px;
					}
				}

				.scenes-bottom {
					.scenes-title {
						padding: 10.417px 8.333px 4.167px;
						color: #333;
					}
					.scenes-avatar {
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 39.578px;
						padding: 0 8.333px;
						.avatar-img {
							height: 22.906px;
							width: 22.906px;
							background-color: #f1f1f1;
							overflow: hidden;
							border: 1px solid #f2f2f2;
							border-radius: 22.9167px;
						}
						.avatar-name {
							color: #666;
							flex: 1;
							margin-left: 8px;
						}
						.avatar-collect {
							color: #bbb;
						}
					}
				}
			}
		}
	}
	.picList-more {
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
=======
<template>
  <div id="picList" v-loading.body="isLoading">
    <div class="choice borderBottom1">
      <div class="choice-top">
        <div class="choice-type" v-for="(item,index) in tags" :key="index">
          <div
            :class="['choice-button','fourColor3',selectArr[item.key]&&selectArr[item.key]!='0'?'hover':'']"
            @click="selectKey(item.key)"
          >
            {{item.name}}
            <i class="fa fa-sort-desc" aria-hidden="true"></i>
          </div>
          <div class="choice-box borderBottom" v-show="item.key==keyName">
            <div class="choice-groups" v-for="(v,k) in item.groups" :key="k">
              <div class="group-title">{{v.name}}</div>
              <div class="tags-box">
                <div
                  :class="['tags-item','fourColor3',selectArr[item.key]==t.value?'hover':'']"
                  v-for="(t,g) in v.sonTags"
                  :key="g"
                  @click="selectOne(item.key,t.value)"
                >{{t.value}}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          :class="['choice-order','fourColor3',orderObject.isopen?'active':'']"
          @click="keyName=null;orderObject.isopen=!orderObject.isopen"
        >
          <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
        </div>

        <div
          class="order-box borderBottom"
          v-if="order.sonTags.length>0"
          v-show="orderObject.isopen"
        >
          <div class="order-div borderBottom">
            <span>{{order.name}}</span>
            <div
              :class="['order-item',o.value==orderObject[order.key]?'fourColor3 hover':'']"
              v-for="(o,s) in order.sonTags"
              :key="s"
              @click="orderSelect(order.key,o.value)"
            >{{o.title}}</div>
          </div>
          <div class="order-div">
            <input
              type="checkbox"
              name="sharing"
              id="sharing"
              v-model="orderObject.sharing"
              @change="handleCheck"
            />
            <label for="sharing">有购物单</label>
          </div>
        </div>
      </div>

      <div class="choice-select borderTop" v-if="Object.keys(selectArr).length>0">
        <div class="select-box">
          <div
            class="select-item"
            v-for="(item,index) in selectArr"
            :key="index"
            @click="cancelArr(index)"
          >
            {{item}}
            <i class="fa fa-times" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>

    <div id="scenes">
      <div class="scenes-padding" v-for="(item,index) in pics" :key="index" ref="scenes">
        <router-link
          class="scenes-item fourColor0"
          :to="{path:'/pic/slice/'+item.match_id+'/'+params.space+'/'+params.style+'/'+params.part+'/'+params.soft+'/'+params.order+'/'+params.sharing}"
          exact
        >
          <div
            class="scenes-pic"
            :style="{backgroundColor:getColor()}"
            :img_h="item.data.info.img_h"
            :img_w="item.data.info.img_w"
            ref="pic"
          >
            <img v-lazy="item.small_image" :alt="'背景图'+index" class="lazy" />
            <i class="fa fa-tag" aria-hidden="true" v-if="item.tag_jump"></i>
          </div>
          <div class="scenes-bottom">
            <div class="scenes-title" v-if="item.case_title">{{item.case_title|handleText}}</div>
            <div class="scenes-avatar">
              <div class="avatar-img" :style="{backgroundColor:getColor()}">
                <img v-lazy="item.user_pic" :alt="item.user_name" class="lazy" />
              </div>
              <div class="avatar-name">{{item.user_name}}</div>
              <div class="avatar-collect" v-if="item.favtimes>0">
                <i class="fa fa-star" aria-hidden="true"></i>
                {{item.favtimes}}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="picList-more">
      <div class="more-bd fourColor0" @click="getList({add:true,async:true});">{{loadingText}}</div>
    </div>
  </div>
</template>

<script>
import { getAlbum, getActivitetags } from "@/api/api.js";
import { randomColor, random } from "@/Plugin/utils/index.js";
import { getStyle, setStyle } from "@/Plugin/dom/dom.js";
export default {
  name: "pic-list",
  data() {
    return {
      isLoading: true, //是否在加载中
      isMore: true, //是否可以加载操作
      tags: [],
      pics: [],
      order: {
        group: false,
        key: "order",
        name: "排序",
        sonTags: [
          { value: "0", title: "推荐" },
          { value: "1", title: "最新" },
          { value: "2", title: "最热" }
        ]
      },
      keyName: null,
      selectArr: {
        space: this.$route.params.space, //空间
        style: this.$route.params.style, //风格
        part: this.$route.params.part, //硬装
        soft: this.$route.params.soft //软装
      },
      orderObject: {
        order: this.$route.params.order, //排序
        sharing: Number(this.$route.params.sharing), //有购物单
        isopen: false
      },
      params: this.$route.params,
      page: 1,
      loadingText: "",
      even: {
        //偶数
        maxHeight: 0,
        lastDom: null
      },
      odd: {
        // 奇数
        maxHeight: 0,
        lastDom: null
      },
      updateLength: 0
    };
  },
  watch: {
    selectArr: {
      handler: function(newval) {
        for (const key in newval) {
          if (newval?.[key]) {
            const element = newval[key];
            if (!element) {
              this.$delete(this.selectArr, key);
            } else {
              if (/^[0-9]*$/.test(element)) {
                if (!Number(element)) {
                  this.$delete(this.selectArr, key);
                }
              }
            }
          }
        }
      },
      immediate: true, //是否初始化执行
      deep: false //是否深度监听
    },
    pics(newVal) {
      this.$nextTick(() => {
        if (Object.keys(this.$refs).length > 0) {
          const page = this.page - 1 > 1 ? this.page - 1 : 1;
          let result = this.$refs.pic.slice(-this.updateLength);
          let scenes = this.$refs.scenes.slice(-this.updateLength);
          // 默认列数
          const col = 2;
          if (this._getType(result) == "array") {
            result.forEach((item, index) => {
              const img_h = item.getAttribute("img_h");
              const img_w = item.getAttribute("img_w");
              let width = getStyle(item, "width");
              if (typeof width == "string") {
                let height = (img_h / img_w) * width.replace("px", "");
                if (img_h && img_w) {
                  setStyle(item, "height", height + "px");
                }
              }
            });
          }
          if (this._getType(scenes) == "array") {
            if (page == 1) {
              this.even.maxHeight = 0;
              this.odd.maxHeight = 0;
              this.even.lastDom = null;
              this.odd.lastDom = null;
            }
            scenes.forEach((item, index) => {
              // 奇数
              if ((index + 1) % col) {
                setStyle(item, "top", this.odd.maxHeight + "px");
                setStyle(item, "left", "0px");
                this.odd.lastDom = item;
                this.odd.maxHeight += item.getClientRects()[0].height;
              } else {
                // 偶数
                const preScenes = scenes[
                  index - 1 == -1 ? 0 : index - 1
                ].getClientRects()[0].width;
                setStyle(item, "left", preScenes + "px");
                setStyle(item, "top", this.even.maxHeight + "px");
                this.even.lastDom = item;
                this.even.maxHeight += item.getClientRects()[0].height;
              }
            });
            // even:偶数  odd：基数
            if (this.even.maxHeight >= this.odd.maxHeight) {
              const lastDOMRectList = this.even.lastDom.getClientRects()[0];
              if (
                this.odd.maxHeight + lastDOMRectList.height <
                this.even.maxHeight
              ) {
                setStyle(this.even.lastDom, "left", "0px");
                setStyle(this.even.lastDom, "top", this.odd.maxHeight + "px");
                this.even.maxHeight =
                  this.even.maxHeight - lastDOMRectList.height;
                this.odd.maxHeight =
                  this.odd.maxHeight + lastDOMRectList.height;
              }
            } else {
              const lastDOMRectList = this.odd.lastDom.getClientRects()[0];
              if (
                this.even.maxHeight + lastDOMRectList.height <
                this.odd.maxHeight
              ) {
                setStyle(
                  this.odd.lastDom,
                  "left",
                  lastDOMRectList.width + "px"
                );
                setStyle(this.odd.lastDom, "top", this.even.maxHeight + "px");
                this.odd.maxHeight =
                  this.odd.maxHeight - lastDOMRectList.height;
                this.even.maxHeight =
                  this.even.maxHeight + lastDOMRectList.height;
              }
            }
            const max = Math.max(this.even.maxHeight, this.odd.maxHeight);
            setStyle(document.getElementById("scenes"), "height", max + "px");
          }
        }
      });
    }
  },
  methods: {
    async getTages() {
      const { data } = await getActivitetags({ params: this.params });
      if (data?.success_code == 200) {
        const tags = data?.data?.tags;
        if (this._getType(tags) == "array") {
          let group = tags.reduce((item, value) => {
            if (value.group) {
              item.push(value);
            } else {
              this.$set(this.order, "group", value.group);
              this.$set(this.order, "key", value.key);
              this.$set(this.order, "name", value.name);
            }
            return item;
          }, []);
          this.tags = group;
        }
      }
    },
    // 获取列表
    async getList(obj = { add: false }) {
      const asyncStatus = obj?.async;
      if (typeof asyncStatus != "undefined") {
        if (asyncStatus && !this.isMore) return;
        this.isMore = false;
      }
      this.loadingText = "加载中...";
      const { data } = await getAlbum({
        params: {
          ...this.params,
          page: obj?.page ? obj.page : this.page
        }
      });
      if (this.isLoading) {
        this.isLoading = false;
      }
      if (data?.success_code == 200) {
        const pics = data?.data?.pics;
        if (this._getType(pics) == "array") {
          if (pics.length > 0) {
            this.updateLength = pics.length;
            this.page = obj?.page ? obj.page + 1 : this.page + 1;
            if (obj?.add) {
              this.pics = [...this.pics, ...pics];
              if (typeof asyncStatus != "undefined") {
                if (asyncStatus && !this.isMore) this.isMore = true;
              }
            } else {
              this.pics = [...pics];
            }
            this.loadingText = "加载更多";
          } else {
            this.loadingText = "加载完毕";
          }
        }
      }
    },
    //点击某个分类
    selectKey(key) {
      this.keyName = key == this.keyName ? null : key;
      if (this.orderObject.isopen) {
        this.$set(this.orderObject, "isopen", false);
      }
    },
    // 选择某一项
    selectOne(key, value) {
      let select = {
        space: this.$route.params.space, //空间
        style: this.$route.params.style, //风格
        part: this.$route.params.part, //硬装
        soft: this.$route.params.soft //软装
      };
      if (select[key] !== value) {
        select[key] = value;
        this.selectArr = select;
        this.$set(this.params, key, value);
        this.handlePath();
        this.getTages();
        this.getList({ page: 1 });
      }
      this.keyName = null;
    },
    // 取消选中
    cancelArr(key) {
      this.$delete(this.selectArr, key);
      this.$set(this.params, key, "0");
      this.handlePath();
      this.getTages();
      this.getList({ page: 1 });
    },
    // 有购物单单选框改变
    handleCheck(e) {
      const value = e.target.checked;
      const name = e.target.name;
      this.$set(this.params, name, Number(value));
      this.handlePath();
      this.getTages();
      this.getList({ page: 1 });
    },
    // 排序选择
    orderSelect(key, value) {
      if (this.orderObject[key] !== value) {
        this.$set(this.orderObject, key, value);
        this.$set(this.params, key, value);
        this.handlePath();
        this.getTages();
        this.getList({ page: 1 });
      }
      this.$set(this.orderObject, "isopen", false);
    },
    // 处理跳转路径
    handlePath() {
      let path = "/pic/list";
      Object.keys(this.params).forEach(item => {
        path += "/" + this.params[item];
      });
      this.$router.replace({
        path: path
      });
    },
    getColor: randomColor
  },
  filters: {
    handleText(value) {
      let text = "";
      if (value) {
        text = value.substring(0, 20) + "...";
      }
      return text;
    }
  },
  mounted() {
    this.getTages();
    this.getList();
  }
};
</script>

<style lang="less" scoped>
#picList {
  .choice {
    margin-bottom: 6.25px;
    position: relative;
    .choice-top {
      display: flex;
      align-items: center;
      height: 31.25px;
      padding: 9.375px 48.958px 9.375px 9.375px;
      box-sizing: content-box;
      background-color: #fff;
      position: relative;
      .choice-type {
        font-size: 12px;
        width: 25%;
        padding-right: 7.813px;
        height: 31.25px;
        box-sizing: content-box;
        .choice-button {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        i {
          margin-left: 5px;
          vertical-align: middle;
        }
        .choice-box {
          position: absolute;
          width: 100%;
          background-color: #fff;
          top: 50.5px;
          left: 0;
          padding: 9.375px 15.625px;
          box-sizing: border-box;
          z-index: 2;
          .choice-groups {
            .group-title {
              color: #ffa533;
            }
            .tags-box {
              margin-bottom: 5.208px;
              display: flex;
              flex-wrap: wrap;
              .tags-item {
                line-height: 20.828px;
                margin-top: 7.292px;
                margin-right: 7.292px;
                padding: 0 8.333px;
                text-align: center;
                color: #666;
                font-size: 12px;
              }
            }
          }
        }
      }
      .choice-order {
        height: 31.25px;
        line-height: 31.25px;
        color: #888;
        width: 37.5px;
        position: absolute;
        right: 9.375px;
        text-align: center;
        font-size: 20px;
        &.active {
          color: #ffa533;
        }
        i {
          vertical-align: middle;
        }
      }
      .order-box {
        position: absolute;
        width: 100%;
        background-color: #fff;
        top: 50.5px;
        left: 0;
        z-index: 2;
        padding-left: 9.375px;
        box-sizing: border-box;
        .order-div {
          font-size: 12.6px;
          padding: 9.375px 0 9.375px 9.375px;
          display: flex;
          align-items: center;
          input {
            margin-right: 4.167px;
          }
          .order-item {
            height: 31.25px;
            line-height: 31.25px;
            margin-left: 9.375px;
            padding: 0 15.625px;
            color: #666;
            background-color: #f4f4f4;
            font-size: 12px;
            border: 0;
            border-radius: 4.16672px;
            &.hover {
              color: #ffa533;
              background-color: #fff;
            }
          }
        }
      }
    }
    .choice-select {
      width: 100%;
      background-color: #fff;
      padding: 4.6875px 15.625px 9.375px 15.625px;
      box-sizing: border-box;
      .select-box {
        display: flex;
        align-items: center;
        font-size: 12px;
        flex-wrap: wrap;
        .select-item {
          margin-top: 4.6875px;
          height: 27.078px;
          line-height: 27.078px;
          margin-right: 10.417px;
          padding: 0 10.417px;
          color: #fff;
          background-color: #f3af34;
          border-radius: 27.0833px;
        }
      }
    }
  }
  #scenes {
    position: relative;
    font-size: 12px;
    .scenes-padding {
      position: absolute;
      padding: 0 4.167px 4.167px 4.167px;
      width: 50%;
      .scenes-item {
        position: relative;
        display: block;
        .scenes-pic {
          border-top-left-radius: 4.16672px;
          border-top-right-radius: 4.16672px;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
          overflow: hidden;
          .fa-tag {
            position: absolute;
            color: #fff;
            z-index: 1;
            top: 5.208px;
            right: 5.208px;
            font-size: 14px;
            transform: rotate(90deg);
            padding: 3.042px 4.167px;
            background-color: rgba(51, 51, 51, 0.6);
            border-radius: 3.12504px;
          }
        }

        .scenes-bottom {
          .scenes-title {
            padding: 10.417px 8.333px 4.167px;
            color: #333;
          }
          .scenes-avatar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 39.578px;
            padding: 0 8.333px;
            .avatar-img {
              height: 22.906px;
              width: 22.906px;
              background-color: #f1f1f1;
              overflow: hidden;
              border: 1px solid #f2f2f2;
              border-radius: 22.9167px;
            }
            .avatar-name {
              color: #666;
              flex: 1;
              margin-left: 8px;
            }
            .avatar-collect {
              color: #bbb;
            }
          }
        }
      }
    }
  }
  .picList-more {
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
