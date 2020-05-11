<template>
  <div class="zhongce-id" v-loading.body="isLoading">
    <div class="zhongce-top">
      <div class="zhongce-type type-1">{{tag}}</div>
      <div class="zhongce-image">
        <img v-lazy="image" alt class="lazy" />
      </div>
    </div>

    <div class="zhongce-bottom">
      <div class="bottom-title">{{title}}</div>
      <div class="bottom-group">
        <div class="bottom-col">
          名额：
          <span>{{group.amounts}}</span>
        </div>
        <div class="bottom-col">
          免单价格：
          <span>{{group.price}}</span> 元
        </div>
        <div class="bottom-col">
          状态：
          <span v-if="group.status=='4'" class="zc-over">体验中</span>
          <span v-else-if="group.status=='0'" class="zc-over">已结束</span>
        </div>
        <div class="bottom-col">
          已申请：
          <span>{{group.applicant_num}}</span> 人
        </div>
      </div>
    </div>

    <img v-lazy="'https://h5.yidoutang.com/v4/public/zhongce.png'" class="lazy" alt />
    <!-- 商品详情 -->
    <div class="zhongce-info borderBottom">
      <i class="fa fa-shopping-cart" aria-hidden="true"></i> 商品详情
    </div>
    <div class="part borderBottom" v-html="item_detail" v-lazy-container="{ selector: 'img' }"></div>
    <!-- 商品详情 end-->
    <!-- 活动相关流程 -->
    <div class="zhongce-info borderBottom">
      <i class="fa fa-shopping-cart" aria-hidden="true"></i> 活动流程及相关规则
    </div>
    <div class="part borderBottom" v-html="rule_detail" v-lazy-container="{ selector: 'img' }"></div>
    <!-- 活动相关流程 end-->
    <!-- 申请名单 -->
    <div class="zhongce-info borderBottom">
      <i class="fa fa-address-book-o" aria-hidden="true"></i> 申请名单
    </div>
    <div
      class="part borderBottom"
      style="padding-left: 0;padding-right: 0;"
      v-if="applyObject.applyArr.length>0"
    >
      <div class="zhongce-applicant">
        <div class="applicant-col" v-for="(item,index) in applyObject.applyArr" :key="index">
          <div class="col-avatar">
            <img v-lazy="item.user_pic" alt class="lazy" />
          </div>
          <div class="col-name">{{item.user_name}}</div>
        </div>
      </div>
      <div class="applicant-more borderTop borderBottomAfter" @click="loadingList">{{loadingText}}</div>
    </div>
    <div class="part borderBottom" style="padding-left: 0;padding-right: 0;" v-else>
      <div class="applicant-info">暂时没人申请，快去抢鲜体验吧!</div>
    </div>
    <!-- 申请名单 end-->
  </div>
</template>

<script>
import { getZhongDetail } from "@/api/api.js";

export default {
  data() {
    return {
      isLoading: true, //是否在加载中
      title: "", //标题名称
      tag: "", //标签名称
      image: "", //产品图片
      group: {
        amounts: "", //名额
        price: "", //价格
        applicant_num: "", //申请人数
        status: "" //状态
      },
      item_detail: "", //商品详情
      rule_detail: "", //活动相关流程
      applyObject: {
        //申请名单
        applyArr: [], //默认显示十条数据
        handle: {}, //数据处理
        pageSize: 12, //默认一页显示多少
        pageIndex: 1 //默认页数
      },
      loadingText: "",
      timer: null //定时器
    };
  },
  methods: {
    async getDetail() {
      const params = this.$route?.params;
      const _this = this;
      if (/^[0-9]*$/.test(params?.id)) {
        const { data: data } = await getZhongDetail({
          params: { id: params.id }
        });
        this.isLoading = false;
        if (data?.success_code == 200) {
          const detail = data?.data;
          if (this._getType(detail) == "object") {
            this.title = detail?.title ? detail.title : ""; //标题名称
            this.tag = detail?.tag ? detail.tag : ""; //标签名称
            this.image = detail?.image ? detail.image : ""; //产品图片
            this.group = {
              amounts: detail?.amounts ? detail.amounts : "", //名额
              price: detail?.price ? detail.price : "", //价格
              applicant_num: detail?.applicant_num ? detail.applicant_num : "", //申请人数
              status: detail?.status ? detail.status : "" //状态
            };
            const item_detail = detail?.item_detail;
            if (typeof item_detail == "string") {
              // 图片懒加载处理
              let regexp1 = new RegExp(/(<img.*?src=")(.*?)(".*?\/?)>/, "g");
              let contentp = item_detail.replace(regexp1, function(
                match,
                p1,
                p2,
                p3
              ) {
                return (
                  p1 + p2 + '" data-src="' + p2 + '" class="lazy' + p3 + ">"
                );
              });
              this.item_detail = contentp; //商品详情
            }

            const rule_detail = detail?.rule_detail;
            if (this._getType(rule_detail) == "string") {
              // 图片懒加载处理
              let regexp1 = new RegExp(/(<img.*?src=")(.*?)(".*?\/?)>/, "g");
              let contentp = rule_detail.replace(regexp1, function(
                match,
                p1,
                p2,
                p3
              ) {
                return (
                  p1 + p2 + '" data-src="' + p2 + '" class="lazy' + p3 + ">"
                );
              });
              this.rule_detail = contentp; // 活动流程及相关规则
            }
            const applicants = detail?.applicants;
            const result = this.applyObject.handle;
            const pageSize = this.applyObject.pageSize;
            const pageIndex = this.applyObject.pageIndex;
            if (this._getType(applicants) == "array") {
              for (let i = 0, j = applicants.length; i < j; i += pageSize) {
                result[Object.keys(result).length + 1] = applicants.slice(
                  i,
                  i + pageSize
                );
              }
              this.$set(this.applyObject, "handle", result);
              if (this._getType(result[pageIndex]) == "array") {
                if (result[pageIndex].length > 0) {
                  this.loadingText = "查看更多名单";
                  this.$set(this.applyObject, "applyArr", result[pageIndex]);
                  this.$set(
                    this.applyObject,
                    "pageIndex",
                    pageIndex + 1 > Object.keys(result).length
                      ? Object.keys(result).length
                      : pageIndex + 1
                  );
                }
              }
            }
          }
        }
      }
    },
    loadingList() {
      // 加载申请名单
      const pageIndex = this.applyObject.pageIndex; //显示的页数
      const applyArr = this.applyObject.applyArr; //加载数据
      const handle = this.applyObject.handle; //分页数据
      if (pageIndex <= Object.keys(handle).length) {
        this.loadingText = "数据加载中...";
          if (this._getType(handle?.[pageIndex]) == "array") {
            if (handle[pageIndex].length > 0) {
              let timer = setTimeout(() => {
                this.loadingText = "查看更多名单";
                this.$set(this.applyObject, "applyArr", [
                  ...applyArr,
                  ...handle[pageIndex]
                ]);
                this.$set(this.applyObject, "pageIndex", pageIndex + 1);
              }, 500);
              this.timer = timer;
            }
          }
      } else {
        this.loadingText = "数据加载中...";
        let timer = setTimeout(() => {
          this.loadingText = "数据加载完毕";
        }, 500);
        this.timer = timer;
      }
    }
  },
  created() {
    this.getDetail();
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../style/fuction.less");
.zhongce-id {
  min-height: 100vh;
  position: relative;
  background-color: #f2f2f2;
  font-size: 12px;
  .zhongce-top {
    .zhongce-type {
      position: absolute;
      left: 15.625px;
      top: 15.625px;
      height: 21.875px;
      line-height: 21.875px;
      padding: 0 7.29164px;
      text-align: center;
      background-color: #333;
      color: #ffffff;
      z-index: 100;
      border-radius: 3.12504px;
      &.type-1 {
        background-color: #f8b434;
      }
    }
  }
  .zhongce-bottom {
    padding: 9.375px 15.625px 10.417px 15.625px;
    background-color: #fff;
    margin-bottom: 10.417px;
    .bottom-title {
      line-height: 20.8334px;
      font-size: 15.625px;
      margin-bottom: 5.20828px;
    }
    .bottom-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .bottom-col {
        flex-basis: 50%;
        margin-top: 4.167px;
        font-size: 13.0208px;
        color: #666;
        letter-spacing: normal;
        span {
          color: #333;
          &.zc-over {
            color: #dadbde;
          }
        }
      }
    }
  }
  .zhongce-info {
    height: 46.875px;
    line-height: 46.875px;
    font-size: 14.5833px;
    color: #999;
    text-align: center;
    i {
      margin-right: 1.04168px;
    }
  }
  .part {
    .zhongce-applicant {
      background-color: #fff;
      padding-bottom: 21.875px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 12px;
      .applicant-col {
        flex-basis: 25%;
        height: 91.6563px;
        text-align: center;
        margin-top: 21.875px;
        color: #333;
        .col-avatar {
          width: 61.453px;
          height: 61.453px;
          margin: 0 auto;
          margin-bottom: 12.5px;
          overflow: hidden;
          border-radius: 5.20828px;
          background-color: #f1f1f1;
        }
        .col-name {
          width: 62.484px;
          height: 16.656px;
          line-height: 16.656px;
          margin: 0 auto;
          .ellipsis();
        }
      }
    }
    .applicant-info {
      line-height: 45px;
      height: 45px;
      color: #ccc;
      text-align: center;
    }
    .applicant-more {
      display: block;
      height: 46.875px;
      line-height: 46.875px;
      background-color: #fff;
      font-size: 12.55px;
      color: #666;
      text-align: center;
      flex: 1;
    }
  }
}
</style>

<style>
.part {
  background-color: #fff;
  padding: 10.417px 10.417px 0 10.417px;
}
.part a {
  color: #f8b434;
  text-decoration: none;
}
.part strong {
  font-weight: 700;
}
</style>