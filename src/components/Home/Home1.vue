<template>
  <div class="home1">
    <span>this is a home1 component</span>
  </div>
</template>

<script>
export default {
  props: {
    test: {
      type: Number,
      required: false,
      default: 200,
      validator: function(value) {
        return value;
      }
    }
  },
};
</script>

<style lang="less" scoped>
</style>