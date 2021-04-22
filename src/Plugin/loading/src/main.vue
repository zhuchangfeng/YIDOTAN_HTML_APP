<template>
	<transition name="op" @after-leave="handleAfterLeave">
		<div
			:class="[customClass,'loading-mask']"
			v-show="visible"
			:style="{ backgroundColor: background || '' }"
		>
			<div class="loading-img">
				<img src="/static/image/initload.gif" alt />
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	data() {
		return {
			fullscreen: true,
			visible: true,
			// Loading 的自定义类名
			customClass: '',
			// 背景颜色
			background: null
		}
	},
	methods: {
		handleAfterLeave() {
		}
	}
}
</script>

<style lang="less" scoped>
.loading-mask {
	position: absolute;
	background-color: hsla(0, 0%, 100%, 1);
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: opacity 0.4s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	touch-action: none;
	outline: none;
	z-index: 2000;
	&.is-fullscreen {
		position: fixed;
	}
	.loading-img {
		width: 120px;
		height: 120px;
	}
}
</style>
