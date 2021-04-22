<template>
	<transition name="op" @after-leave="handleAfterLeave">
		<div :class="['message',customClass]" role="alert" v-show="visible" :style="positionStyle">
			<div class="message-text">{{message}}</div>
		</div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
			closed: false,
			message: '',
			duration: 3000,
			timer: null,
			onClose: null,
			verticalOffset: 20,
			customClass: ''
		}
	},
	computed: {
		positionStyle() {
			return {
				bottom: `${this.verticalOffset}px`
			}
		},
		messageText() {
			const message = String(this.message)
			return message
		}
	},
	watch: {
		closed(newVal) {
			if (newVal) {
				this.visible = false
			}
		}
	},
	methods: {
		handleAfterLeave() {
			this.$destroy(true)
			this.$el.parentNode.removeChild(this.$el)
		},
		startTimer() {
			if (this.duration > 0) {
				this.timer = setTimeout(() => {
					if (!this.closed) {
						this.close()
					}
				}, this.duration)
			}
		},
		close() {
			this.closed = true
			this.onClose && typeof this.onClose === 'function' && this.onClose(this)
		},
		keydown(e) {
			if (e.keyCode === 27) {
				// esc关闭消息
				if (!this.closed) {
					this.close()
				}
			}
		}
	},
	mounted() {
		this.startTimer()
		document.addEventListener('keydown', this.keydown)
	},
	beforeDestroy() {
		if (this.timer) {
			clearTimeout(this.timer)
		}
		document.removeEventListener('keydown', this.keydown)
	}
}
</script>

<style lang="less" scoped>
.message {
	color: rgb(0, 0, 0);
	border-radius: 10px;
	line-height: 1.8;
	width: 98px;
	backdrop-filter: saturate(180%) blur(20px);
	background-color: rgba(255, 255, 255, 0.72);
	-webkit-transition-property: background-color, -webkit-backdrop-filter;
	transition-property: background-color, -webkit-backdrop-filter;
	transition-property: background-color, backdrop-filter;
	transition-property: background-color, backdrop-filter,
		-webkit-backdrop-filter;
	transition: bottom 0.5s cubic-bezier(0.28, 0.11, 0.32, 1),
		background-color 0.5s cubic-bezier(0.28, 0.11, 0.32, 1),
		opacity 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);
	position: fixed;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
	text-align: center;
	left: 0;
	right: 0;
	margin: 0 auto;
	padding: 8px;
	overflow: hidden;
	user-select: none;
	.message-text {
		font-size: 12px;
		min-width: 0;
		overflow: hidden;
		text-overflow: unset;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
</style>
