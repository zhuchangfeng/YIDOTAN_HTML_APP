<template>
  <div id="HelloWorld">
    <span>{{$t("brands.nike")}}</span>
    <span>{{$t("test")}}</span>
    <button @click="changLang">切换语言</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    // 获取状态仓库的batch
    ...mapGetters("Felix", {
      test: "getTest"
    }),
    ...mapGetters("Jack", {
      jack: "getTest"
    })
  },
  methods: {
    changLang() {
      const locale = this.$i18n.locale == "zh-CN" ? "en-US" : "zh-CN";
      this.$i18n.locale = locale;
    }
  },
  mounted() {
    console.log(this.test);
    console.log(this.jack);
  }
};
</script>

<style lang="less">
</style>