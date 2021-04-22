<template>
  <div class="comment">
    <div class="comment__avatar">
      <img v-lazy="comment.user_pic" alt="用户头像" class="lazy" />
    </div>
    <div class="comment__container">
      <div class="comment__container--name">{{ comment.user_name }}</div>
      <div class="comment__container--time">{{ comment.created }}</div>
      <div class="comment__container--content">{{ comment.content }}</div>
    </div>
    <div class="comment__like">
      <span>{{ comment.zan_num }}</span>
      <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
export default {
	props: {
		comment: {
			type: Object
		}
	}
}
</script>

<style lang="less" scoped>
.comment {
  display: flex;
  padding: 17.78px 0 0 46.785px;
  position: relative;
  &:last-child {
    .comment-container {
      border-bottom: none;
    }
  }
  &__avatar {
    width: 31.25px;
    height: 31.25px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #f2f2f2;
    background-color: #f1f1f1;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 17.78px;
  }
  &__container {
    padding-bottom: 15.625px;
    width: 100%;
    border-bottom: 1px solid #e8e9eb;
    &--name {
      font-size: 13px;
      color: #666;
    }
    &--time {
      font-size: 12px;
      color: #999;
      margin-top: 4.167px 0;
    }
    &--content {
      font-size: 13.5px;
      line-height: 20.834px;
      margin-top: 11.4px;
      color: #666;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  &__like {
    color: #999;
    font-size: 13px;
    line-height: 16.66px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    i {
      margin-left: 4.16672px;
      font-size: 18px;
    }
  }
}
</style>
