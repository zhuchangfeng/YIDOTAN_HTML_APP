<template>
  <div class="user" v-loading.body="isLoading" ref="user">
    <div class="user__id">
      <div class="user__id--info">
        <div
          class="info-bg lazy"
          v-lazy:background-image="
            user.background && user.background.normal_image
          "
        ></div>
        <div class="info-cover"></div>
        <div class="info-avatar">
          <div class="avatar-img">
            <div class="img" v-lazy:background-image="user.pic"></div>
          </div>
          <div class="avatar-attention">
            <i class="fa fa-plus" aria-hidden="true"></i>
            关注
          </div>
        </div>
        <div class="info-name">
          <span>{{ user.user_name }}</span>
          <div class="view-count">
            总阅读
            <span class="count">{{ view_count_info.view_count }}</span>
            <i class="fa fa-question-circle-o" aria-hidden="true"></i>
          </div>
        </div>
        <div class="info-signature">{{ user.signature }}</div>
        <div class="info-follow">
          <span class="follow">关注 {{ user.follow_num }}</span>
          <span class="followed">粉丝 {{ user.follower_num }}</span>
        </div>
        <div class="info-badge">
          <div
            class="badge-item tag"
            v-for="(item, index) in user.badge_list"
            :key="index"
          >
            <img v-lazy="item.image" :alt="item.name" class="lazy" />
            {{ item.name }}
          </div>
          <i
            :class="['fa', user.sex ? 'fa-mars' : 'fa-venus', 'tag']"
            aria-hidden="true"
          ></i>
        </div>
        <div class="info-statistics">
          <div class="statistics-item">
            <div class="item-wrap">
              <div class="num">{{ user.photo_num }}</div>
              <div class="label">图片及视频</div>
            </div>
          </div>
          <div class="statistics-item">
            <div class="item-wrap">
              <div class="num">{{ user.case_num }}</div>
              <div class="label">全屋记</div>
            </div>
          </div>
          <div class="statistics-item">
            <div class="item-wrap">
              <div class="num">{{ user.article_num }}</div>
              <div class="label">文章</div>
            </div>
          </div>
          <div class="statistics-item">
            <div class="item-wrap">
              <div class="num">{{ user.answer_num }}</div>
              <div class="label">回答</div>
            </div>
          </div>
        </div>
      </div>
      <div class="user__id--correlation" ref="correlation">
        <van-sticky @scroll="scrollSticky" ref="sticky">
          <div class="correlation-tab">
            <div
              class="tab-item"
              v-for="(item, index) in correlationTab.value"
              :key="index"
              @click="switchTab(index)"
            >
              <span
                :class="[index == correlationTab.hoverIndex ? 'hover' : '']"
                >{{ item }}</span
              >
            </div>
          </div>
        </van-sticky>
        <swiper
          ref="userSwiper"
          :options="swiperOptions"
          @transitionStart="onTransitionStart"
          @transitionEnd="onTransitionEnd"
        >
          <swiper-slide
            v-if="correlationTab.value.includes('主页')"
            :style="swiperStyle"
            >555</swiper-slide
          >
          <swiper-slide :style="swiperStyle">
            <div class="correlation-box">
              <component
                :value="item"
                :is="item.component"
                v-for="(item, index) in dynamic"
                :key="index"
                ref="component"
              >
                <user-title slot="user-title" :user="item"></user-title>
              </component>
            </div>
          </swiper-slide>
          <swiper-slide :style="swiperStyle">
            <div class="correlation-about">
              <div class="about-item" v-if="user.badge_list">
                <div class="about-item-label">徽章</div>
                <div class="about-item-value badge">
                  <img
                    v-lazy="item.image"
                    :alt="item.name"
                    class="lazy badge-image"
                    v-for="(item, index) in user.badge_list"
                    :key="index"
                  />
                </div>
              </div>
              <div class="about-item">
                <div class="about-item-label">个人信息</div>
                <div class="about-item-value">
                  性别：{{ user.sex ? "男" : "女" }}
                </div>
              </div>
              <div class="about-item" v-if="user.signature">
                <div class="about-item-label">个性签名</div>
                <div class="about-item-value">性别：{{ user.signature }}</div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo, getUserPublishList } from '@/api/api.js'
import dynamic from '@/components/user/dynamic'
import userTitle from '@/components/user/userTitle'
import master from '@/components/user/master'
import video from '@/components/user/video'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
	data() {
		return {
			user: {},
			view_count_info: {},
			correlationTab: {
				hoverIndex: 0,
				value: ['动态', '关于TA'],
				scrollValue: [0, 0]
			},
			swiperStyle: {
				height: 'auto',
				minHeight: '100vh',
				width: '100vw'
			},
			dynamic: [],
			isLoading: true, // 是否在加载中
			swiperOptions: {
				autoHeight: true, // 高度随内容变化
				notNextTick: true,
				observer: true, // 修改swiper的子元素时
				observeParents: true // 当Swiper的父元素变化时
				// slidesPerView: "auto",
				// watchSlidesVisibility: true,
				// preventClicksPropagation: false,
			},
			transitionType: 'onTransitionEnd' // Tips:切换的类型默认是onTransitionEnd Value:onTransitionEnd | onTransitionStart
		}
	},
	components: {
		userDynamic: dynamic,
		userTitle: userTitle,
		userMaster: master,
		userVideo: video,
		swiper,
		swiperSlide
	},
	computed: {
		swiper() {
			return this.$refs.userSwiper.swiper
		}
	},
	methods: {
		async getInfo() {
			const {
				params: { id: id }
			} = this.$route
			const {
				data: {
					data: data,
					success_code: success_code,
					error: error,
					message: message
				}
			} = await getUserInfo({
				params: {
					id: id
				}
			})
			if (error) {
				this.$message({
					message: message
				})
				if (this.isLoading) {
					this.isLoading = false
				}
			} else {
				if (success_code === 200) {
					const { user, view_count_info } = data
					if (this._getType(user) === 'object') {
						const { designer } = user
						const { value, scrollValue } = this.correlationTab
						if (designer) {
							value.unshift('主页')
							scrollValue.unshift(0)
						}
						this.user = user
					}
					if (this._getType(view_count_info) === 'object') {
						this.view_count_info = view_count_info
					}
					if (this.isLoading) {
						this.isLoading = false
					}
				}
			}
		},
		async getList() {
			const {
				params: { id: id }
			} = this.$route
			const index = this.dynamic.length - 1 < 0 ? 0 : this.dynamic.length - 1
			const {
				data: {
					data: { dynamic: dynamic }
				}
			} = await getUserPublishList({
				params: {
					id: id,
					score: this.dynamic[index]?.created
						? this.dynamic[index]?.created
						: ''
				}
			})
			if (Array.isArray(dynamic)) {
				dynamic.forEach((item) => {
					if (this._getType(item) === 'object') {
						const { do_title, short_post } = item
						const type = do_title.slice(-2)
						const component = {
							文章: 'user-master',
							动态: 'user-dynamic',
							视频: 'user-video'
						}
						if (this._getType(short_post) === 'object') {
							const { pics } = short_post
							if (Array.isArray(pics)) {
								const len = pics.length
								if (len > 0) {
									item.is_Image = true
									item.publishImage = pics
									item.remainder = len % 3
								}
							}
						}
						item.component = component[type]
					}
				})
				this.dynamic = dynamic
			}
		},
		switchTab(index) {
			if (this.correlationTab.hoverIndex !== index) {
				this.swiper && this.swiper.slideTo(index, 300, false)
			}
		},
		onTransitionStart() {
			this.transitionType = 'onTransitionStart'
		},
		onTransitionEnd() {
			const { hoverIndex, scrollValue } = this.correlationTab
			const { activeIndex } = this.swiper
			this.transitionType = 'onTransitionEnd'
			if (activeIndex !== hoverIndex) {
				this.$set(this.correlationTab, 'hoverIndex', activeIndex)
				window.scrollTo(0, scrollValue[activeIndex])
			}
		},
		scrollSticky: _.debounce(function(e) {
			const { isFixed } = e
			if (isFixed) {
				this.$nextTick(() => {
					const { sticky } = this.$refs
					if (sticky) {
						// const { height } = sticky
						// const {
						// 	0: { height: clientHeight }
						// } = document.body.getClientRects()
						// this.$set(
						// 	this.swiperStyle,
						// 	'minHeight',
						// 	`${clientHeight - height}px`
						// )
					}
				})
			}
		}, 250),
		IntersectionObserverFun: function(e) {
			this.$nextTick(() => {
				const { user } = this.$refs
				if (user) {
					const {
						0: { top: top }
					} = user.getClientRects()
					const {
						0: { height: height }
					} = document.getElementsByClassName('user-title')[0].getClientRects()
					const scrollTop = height - top
					if (
						![Infinity, NaN].includes(scrollTop) &&
            this.transitionType === 'onTransitionEnd'
					) {
						const { hoverIndex, scrollValue } = this.correlationTab
						scrollValue[hoverIndex] = scrollTop
					}
				}
			})
		}
	},
	mounted() {
		this.getInfo()
		this.getList()
		window.addEventListener(
			'scroll',
			this._.debounce(this.IntersectionObserverFun, 300),
			true
		)
		this.$once('hook:beforeDestroy', () => {
			window.removeEventListener('scroll', this.IntersectionObserverFun)
		})
	}
}
</script>

<style lang="less" scoped>
.user {
  &__id {
    &--info {
      padding: 31.25px 20.833px 15.625px 20.833px;
      color: #fff;
      position: relative;
      z-index: 1;
      .info {
        &-bg {
          background-size: cover;
          background-position: 50%;
        }
        &-cover {
          background-image: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.6),
            rgba(0, 0, 0, 0.15)
          );
        }
        &-bg,
        &-cover {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
        }
        &-avatar {
          padding: 4.167px 0 18.75px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #333;
          .avatar-img {
            .img {
              width: 72.906px;
              height: 72.906px;
              border-radius: 36.4583px;
              background-size: cover;
              background-position: 50%;
            }
          }
          .avatar-attention {
            padding: 0 10.417px;
            height: 33.406px;
            line-height: 33.406px;
            font-size: 13.5417px;
            border-radius: 2.08336px;
            box-sizing: border-box;
            border: 1px solid #ffda46;
            background: #ffda46;
          }
        }
        &-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20.8334px;
          font-weight: 500;
          position: relative;
          .view-count {
            font-size: 12px;
            position: absolute;
            right: -20px;
            background: rgba(51, 51, 51, 0.5);
            color: #fff;
            padding: 7px 20px 7px 10px;
            border-radius: 20px 0 0 20px;
            .count {
              color: #ffda46;
              margin-right: 6px;
            }
          }
        }
        &-signature,
        &-follow {
          margin: 11.458px 0;
          font-size: 13.5417px;
        }
        &-follow {
          .follow {
            margin-right: 26.042px;
          }
        }
        &-badge {
          margin: 11.458px 0;
          .tag {
            display: inline-block;
            font-size: 12px;
            line-height: 18.75px;
            padding: 0 6.25px;
            border-radius: 8.33332px;
            margin-right: 6.25px;
            margin-bottom: 11.458px;
          }
          .badge-item {
            background: hsla(0, 0%, 100%, 0.4);
            img {
              width: 12.5px;
              height: 12.5px;
              margin-bottom: 2px;
              display: inline-block;
              vertical-align: middle;
            }
          }
          i {
            width: 39.828px;
            text-align: center;
            background: hsla(0, 0%, 100%, 0.4);
          }
          .fa-mars {
            background-color: rgba(17, 94, 139, 0.5);
          }
          .fa-venus {
            background-color: rgba(235, 51, 137, 0.5);
          }
        }
        &-statistics {
          display: flex;
          align-items: center;
          padding: 16.667px 0 10.417px;
          text-align: center;
          .statistics-item {
            flex: 1;
            .item-wrap {
              border-right: 1px solid hsla(0, 0%, 100%, 0.2);
              .num {
                font-size: 18.75px;
                font-weight: 500;
              }
              .label {
              }
            }
            &:last-child {
              .item-wrap {
                border-right: 1px solid transparent;
              }
            }
          }
        }
      }
    }
    &--correlation {
      .swiper-container {
        .swiper-slide {
          background-color: #fff;
        }
      }
      .correlation {
        &-tab {
          display: flex;
          text-align: center;
          line-height: 44.828px;
          padding: 0 20.833px;
          font-size: 14.5833px;
          border-bottom: 1px solid #e8e8e8;
          box-sizing: border-box;
          background-color: #fff;
          .tab-item {
            flex: 1;
            span {
              display: inline-block;
              &.hover {
                border-bottom: 2px solid #ffda46;
              }
            }
          }
        }
        &-about {
          .about-item {
            font-size: 14.5833px;
            &-label {
              padding: 7.292px 12.5px;
              color: #000;
              background: #f7f7f7;
            }
            &-value {
              padding: 8.333px 12.5px;
              color: #666;
              background-color: #fff;
              &.badge {
                display: flex;
                .badge-image {
                  width: 26.031px;
                  height: 26.031px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
