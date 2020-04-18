<template>
  <div class="Tabbar">
    <div
      :class="['Tabbar-item',item.path.includes($route.path)?'hover':'']"
      v-for="(item,index) in tabData"
      :key="index"
      @click="changeOne(index)"
    >
      <div class="Tabbar-img">
        <img :src="item.icon" :alt="item.name" />
      </div>
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabData: [
        {
          path: ["/","/Index"],
          name: "我是导航1",
          icon: "../../../static/image/home.svg"
        },
        {
          path: ["/Home2"],
          name: "我是导航2",
          icon: "../../../static/image/home.svg"
        },
        {
          path: ["/Home3"],
          name: "我是导航3",
          icon: "../../../static/image/home.svg"
        },
        {
          path: ["/Home4"],
          name: "我是导航4",
          icon: "../../../static/image/home.svg"
        }
      ],
    };
  },
  methods: {
    changeOne(index) {
      if (!this.tabData[index].path.includes(this.$route.path)) {
        this.$router.replace({ path: this.tabData[index].path[0] });
      }
    },
  },
    mounted() {
    console.log(this.$route);
  }
};
</script>

<style lang="less" scoped>
.Tabbar {
  width: 100%;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(255, 255, 255, 0.72);
  transition-property: background-color, backdrop-filter,
    -webkit-backdrop-filter;
  transition: background-color 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0;
  margin: auto;
  display: flex;
 z-index: 9998;
  font-size: 14px;
  border-top: 1px solid #f1f1f1;
  height: 51px;
  .Tabbar-item {
    flex: 1;
    font-size: 12px;
    text-align: center;
    align-self: center;
    filter: grayscale(1);
    &.hover {
      filter: grayscale(0);
      span {
        color: #c46813;
      }
    }
    .Tabbar-img {
      width: 25px;
      height: 25px;
      margin: 0 auto 3px auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>