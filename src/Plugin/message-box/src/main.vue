<template>
	<transition name="msgbox-scale">
		<div
			class="message-box__wrapper"
			tabindex="-1"
			role="dialog"
			aria-modal="true"
			v-show="visible"
			:aria-label="title || 'dialog'"
			:style="messageZindex"
		>
			<div :class="['message-box',customClass,center&&'t-c']">
				<div class="message-box__header" v-if="title!=null">
					<div class="message-box__title">
						<h2>{{title}}</h2>
					</div>
				</div>
				<div class="message-box__content">
					<div class="message-box__container">
						<div class="message-box__message" v-if="message!=''">
							<span>{{message}}</span>
						</div>
					</div>
				</div>
				<div class="message-box__btns" :button-row="String(rowButton)">
					<button
						:class="['btns-cancel',cancelButtonClass]"
						type="button"
						v-if="showCancelButton"
						@click="handleAction('cancel')"
					>{{cancelButtonText}}</button>
					<button
						:class="['btns-confirm',confirmButtonClass]"
						type="button"
						v-if="showConfirmButton"
						@click="handleAction('confirm')"
					>{{confirmButtonText}}</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { addClass, setStyle } from '../../dom/dom'
export default {
	data() {
		return {
			// 文字是否居中
			center: true,
			// 标题
			title: '',
			// 提示内容
			message: '',
			// 自定义类
			customClass: '',
			// 是否显示取消按钮
			showCancelButton: false,
			// 取消按钮类
			cancelButtonClass: '',
			// 取消按钮文字
			cancelButtonText: '',
			// 是否显示确定按钮
			showConfirmButton: true,
			// 确定按钮类
			confirmButtonClass: '',
			// 确定按钮文字
			confirmButtonText: '',
			// z-index
			zIndex: new Date().getFullYear(),
			// 回调函数
			callback: null,
			// 提示框类型
			type: '',
			// 是否按钮显示一行
			rowButton: true,
			// 提交方式
			action: '',
			uid: new Date().getFullYear(),
			visible: false
		}
	},
	methods: {
		getSafeClose() {
			const currentId = this.uid
			return () => {
				this.$nextTick(() => {
					if (currentId === this.uid) this.doClose()
				})
			}
		},
		handleAction(action) {
			this.action = action
			if (typeof this.beforeClose === 'function') {
				this.close = this.getSafeClose()
				this.beforeClose(action, this, this.close)
			} else {
				this.doClose()
			}
		},
		doClose() {
			if (!this.visible) return
			this.visible = false
			this._closing = true
			setTimeout(() => {
				if (this.action) this.callback(this.action, this)
			})
		}
	},
	computed: {
		messageZindex() {
			return {
				'z-index': this.zIndex
			}
		},
		modeZindex() {
			return {
				'z-index': this.zIndex - 1
			}
		}
	},
	watch: {
		visible(nVisible) {
			const created = document.createElement('div')
			addClass(created, 'v-modal')
			created.setAttribute('tabindex', 0)
			setStyle(created, this.modeZindex)
			if (nVisible) {
				document.body.append(created)
			} else {
				document.querySelector('.v-modal').remove()
			}
		}
	}
}
</script>

<style lang="less" scoped>
.message-box__wrapper {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	text-align: center;
	width: 100%;
	height: 100%;
	font-size: 22px;
	&:after {
		display: inline-block;
		content: "";
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.message-box {
		border-radius: 13px;
		box-shadow: none;
		overflow: hidden;
		display: inline-block;
		vertical-align: middle;
		width: auto;
		min-width: 250px;
		max-width: 270px;
		min-height: auto;
		max-height: 90%;
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
		user-select: none;
		.message-box__header {
			padding: 12px 16px 7px 16px;
			.message-box__title {
				h2 {
					color: #000;
					margin-top: 8px;
					font-size: 17px;
					font-weight: 600;
				}
			}
		}
		.message-box__content {
			font-size: 13px;
			color: #000;
			max-height: 240px;
			overflow-y: auto;
      overscroll-behavior-y: contain;
			.message-box__container {
				padding:  0 16px 21px 16px;
			}
		}
		.message-box__btns {
			line-height: 44px;
			font-size: 17px;
			&[button-row="false"] {
				display: unset;
				button {
					display: block;
					width: 100%;
					&:nth-child(odd) {
						border-left: none;
						border-top: 1px solid #ccc;
					}
					&:nth-child(even) {
						border-top: 1px solid #ccc;
					}
				}
			}
			&[button-row="true"] {
				display: flex;
				button {
					display: block;
					flex: 1;
					&:nth-child(odd) {
						border-left: none;
						border-top: 1px solid #ccc;
					}
					&:nth-child(even) {
						border-top: 1px solid #ccc;
						border-left: 1px solid #ccc;
					}
				}
			}
			.btns-cancel {
				font-weight: 500;
				color: #3880ff;
				font-size: 17px;
			}
			.btns-confirm {
				color: #3880ff;
				font-size: 17px;
				font-weight: 700;
			}
		}
	}
}
</style>
<style type="text/css">
.v-modal {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0.5;
	background-color: rgba(64, 68, 79, 0.35);
}
</style>
