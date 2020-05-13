<template>
  <div id="index" v-loading.body="isLoading">
    <div class="index-title">
      <div class="index-logo">
        <img v-lazy="'https://h5.yidoutang.com/v4/public/logo/logo-56.png'" class="lazy" alt />
      </div>
      <div class="index-words">
        <p>一兜糖家居APP</p>
        <p>装修家居生活社区</p>
      </div>
      <div class="index-download">
        <a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.yidoutang.app">下载</a>
      </div>
    </div>

    <div class="index-banner borderBottom">
      <router-link
        :to="item.link"
        v-for="(item,index) in bannerData"
        :key="index"
        :data-type="item.type"
      >
        <div class="banner-item">
          <div class="item-img">
            <img :alt="item.title" v-lazy="item.icon" />
          </div>
          <p>{{item.title}}</p>
        </div>
      </router-link>
    </div>

    <div class="index-col borderBottom">
      <div class="col-title">
        <div class="col-bl"></div>今日屋主
      </div>
      <div class="col-star">
        <img v-lazy="master[0]&&master[0].pic" alt class="lazy" />
        <div class="col-avatar">
          <img v-lazy="master[0]&&master[0].user_pic" alt class="avatar-img lazy" />
          <img
            v-lazy="'https://h5.yidoutang.com/v4/public/identity_3.png'"
            alt
            class="avatar-identity lazy"
          />
        </div>
        <div class="col-info">
          <div class="info-title">{{master[0]&&master[0].title}}</div>
          <div class="info-name">{{master[0]&&master[0].user_name}}</div>
        </div>
      </div>
    </div>

    <div class="index-col borderBottom pb0" ref="recommend">
      <div class="col-title">
        <div class="col-bl"></div>编辑精选
      </div>
      <essay v-for="(item,index) in recommend" :key="index" :value="item" @handGain="handClick"></essay>
    </div>

    <div class="index-more" @click="scrollTo();getHome();">{{loadingText}}</div>
    <div class="index-open">App 内打开</div>
  </div>
</template>

<script>
import essay from "@/components/essay.vue";
import { getInfo } from "../api/api";
export default {
  data() {
    return {
      bannerData: [],
      recommend: [],
      master: [],
      isLoading: true,
      loadingText: "",
      page: 1
    };
  },
  components: {
    essay
  },
  methods: {
    checkType() {
      const that = this;
      let arr = that.bannerData.reduce((item, index) => {
        const { title } = index;
        switch (title) {
          case "全屋记":
            index.link = "/";
            break;
          case "文章攻略":
            index.link = "/";
            break;
          case "新手指南":
            const { data } = index;
            index.link = "/master/" + data;
            break;
          case "众测":
            index.link = "/zhongce/list";
            break;
          default:
            index.link = "/";
            break;
        }
        if (index.type != "0") {
          if (that._.findIndex(item, o => o.type == index.type) == -1) {
            item.push(index);
          } else {
            item[that._.findIndex(item, o => o.type == index.type)] = index;
          }
        }
        return item;
      }, []);
      that.bannerData = arr;
    },
    getHome() {
      this.loadingText = "加载中...";
      getInfo({
        params: {
          page: this.page
        }
      }).then(r => {
        const res = r?.data;
        if (this.isLoading) {
          this.isLoading = false;
        }
        this.loadingText = "加载更多";
        if (res?.success_code == 200) {
          const array = ["recommend", "master"];
          let data = res?.data;
          for (const iterator of array) {
            if (!this._isEmpty(data?.[iterator])) {
              if (this.page > 1) {
                this.recommend = [...this.recommend, ...data["recommend"]];
              } else if (this.page == 1) {
                this[iterator] = data[iterator];
              }
            }
          }
          if (this.page == 1) {
            this.bannerData = data?.nav;
            if (!this._isEmpty(this.bannerData)) {
              this.checkType();
            }
          }
          this.page = this.page + 1;
        }
      });
    },
    scrollTo() {
      this.$nextTick(() => {
        if (this.$refs?.recommend) {
          const { bottom } = this.$refs.recommend.getBoundingClientRect();
          document.getElementById("app").scrollTop = bottom;
        }
      });
    },
    handClick(obj) {
      if (!this._isEmpty(obj?.id)) {
        switch (obj.subtype) {
          case "8":
            this.$router.push({
              path: "/new/" + obj.id
            });
            break;
          case "0":
            this.$router.push({
              path: "/master/" + obj.id
            });
            break;
          default:
            break;
        }
      }
    }
  },
  created() {
    this.getHome();
  }
};
</script>

<style lang="less" scoped>
@import url("../style/fuction.less");
#index {
  height: 100%;
  .index-title {
    position: relative;
    z-index: 1;
    height: 52.08px;
    width: 100%;
    background-color: hsla(0, 0%, 100%, 0.96);
    padding: 0 14.5833px;
    display: flex;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    .index-logo {
      width: 37.48px;
      height: 37.48px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      border-radius: 10.42px;
      padding: 5.2px;
    }
    .index-words {
      margin-left: 14.5833px;
      p:first-child {
        font-size: 15.625px;
        color: #4d4d4d;
        font-weight: 700;
      }
      p:last-child {
        color: rgb(193, 193, 193);
        font-size: 12px;
        margin-top: 3.13px;
      }
    }
    .index-download {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      a {
        color: #fff;
        padding: 0 10.42px;
        font-size: 12px;
        background-color: #f8b434;
        border-radius: 26.1px;
        overflow: hidden;
        line-height: 26.1px;
      }
    }
  }
  .index-banner {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: #fff;
    text-align: center;
    margin-bottom: 10.4px;
    a {
      flex-basis: 20%;
      min-height: 84.38px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .banner-item {
        .item-img {
          width: 28.125px;
          height: 28.125px;
          margin: 0 auto 7.5px auto;
        }
        p {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  .index-col {
    background-color: #fff;
    margin-bottom: 10.4px;
    padding-bottom: 15.6px;
    .col-title {
      padding: 12.5px 23.96px;
      font-size: 13px;
      position: relative;
      color: #666;
      .col-bl {
        width: 4.15px;
        height: 15.6px;
        border-radius: 5.2px;
        position: absolute;
        left: 12.5px;
        background-color: #ffda46;
      }
    }
    .col-star {
      height: 104.156px;
      margin: 0 10.4167px;
      position: relative;
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(30, 30, 30, 0.2);
      }
      .col-avatar {
        position: absolute;
        top: 0;
        z-index: 1;
        left: 23.4375px;
        top: 26.0416px;
        .avatar-img {
          width: 54.08px;
          height: 54.08px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #fff;
          display: inline-block;
        }
        .avatar-identity {
          width: 15.6094px;
          height: 15.6094px;
          margin-left: -22px;
          margin-bottom: -2px;
          display: inline-block;
        }
      }
      .col-info {
        font-size: 15.625px;
        position: absolute;
        color: #fff;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 208.328px;
        right: 55px;
        height: 41.6563px;
        z-index: 1;
        .info-title {
          .ellipsis();
        }
      }
      .info-name {
        font-size: 12px;
      }
    }
  }
  .index-open {
    border-radius: 26.0416px;
    width: 110.14px;
    line-height: 38.81px;
    background-color: #f8b434;
    font-size: 14px;
    text-align: center;
    position: fixed;
    bottom: 41.6667px;
    left: 0;
    right: 0;
    margin: 0 auto;
    color: #fff;
    z-index: 1;
  }
  .index-more {
    margin: 9.375px;
    height: 41.65px;
    line-height: 41.65px;
    font-size: 13px;
    color: gray;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 5.2px;
    text-align: center;
  }
}
</style>