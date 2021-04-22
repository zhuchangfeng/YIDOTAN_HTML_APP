import Vue from 'vue'
import msgbox from './main.vue'
const isServer = Vue.prototype.$isServer
import merge from '../../utils/merge.js'
import { getType } from '../../utils/index'
const MessageBoxConstructor = Vue.extend(msgbox)
let instance; let currentMsg; const queueArr = []
const defaults = {
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
	callback: null
}
const defaultCallback = action => {
	if (currentMsg) {
		if (typeof currentMsg.callback === 'function') {
			currentMsg.callback(action)
		}
		if (currentMsg.resolve) {
			currentMsg.resolve(action)
		}
		if (currentMsg.reject && (action === 'cancel')) {
			currentMsg.reject(action)
		}
	}
}
const MessageBox = function(options, callback) {
	if (isServer) return
	if (typeof options === 'string') {
		options = {
			message: options
		}
		if (typeof arguments[1] === 'string') {
			options.title = arguments[1]
		}
	} else if (options.callback && !callback) {
		callback = options.callback
	}
	if (typeof Promise !== 'undefined') {
		return new Promise((resolve, reject) => {
			queueArr.push({
				options: merge({}, defaults, MessageBox.defaults, options),
				callback: callback,
				resolve: resolve,
				reject: reject
			})

			showNextMsg()
		})
	} else {
		queueArr.push({
			options: merge({}, defaults, MessageBox.defaults, options),
			callback: callback
		})
		showNextMsg()
	}
}
MessageBox.alert = (message, title, options) => {
	// 提示框
	if (getType(message) === 'object') {
		options = message
		message = ''
	} else if (message === undefined) {
		message = ''
	}
	if (getType(title) === 'object') {
		options = title
		title = ''
	} else if (typeof title === undefined) {
		title = ''
	}
	return MessageBox(merge({
		title: title,
		message: message,
		type: 'alert',
		showCancelButton: false,
		showConfirmButton: true,
		closeOnPressEscape: false,
		closeOnClickModal: false
	}, options))
}

MessageBox.confirm = (message, title, options) => {
	// 确认框
	if (getType(message) === 'object') {
		options = message
		message = ''
	} else if (message === undefined) {
		message = ''
	}
	if (getType(title) === 'object') {
		options = title
		title = ''
	} else if (typeof title === undefined) {
		title = ''
	}
	return MessageBox(merge({
		title: title,
		message: message,
		type: 'confirm',
		showCancelButton: true,
		showConfirmButton: true,
		closeOnPressEscape: true,
		closeOnClickModal: false
	}, options))
}
MessageBox.close = () => {
	instance.doClose()
	instance.visible = false
	currentMsg = null
}
// 初始化实例
const initInstance = () => {
	instance = new MessageBoxConstructor({
		el: document.createElement('div')
	})

	instance.callback = defaultCallback
}

// // 设置默认配置
// const setDefaults = defaults => {
//   MessageBox.defaults = defaults
// }

const showNextMsg = () => {
	// 如果没有实例
	if (!instance) {
		initInstance()
	}
	instance.action = ''
	if (!instance.visible) {
		if (queueArr.length > 0) {
			// 获取队列数组的第一个并从数组中清除
			currentMsg = queueArr.shift()
			// 获取配置
			const options = currentMsg.options
			for (const key in options) {
				// eslint-disable-next-line no-prototype-builtins
				if (options.hasOwnProperty(key)) {
					instance[key] = options[key]
				}
			}
			// 默认回调弹出框的类型
			if (options.callback === undefined) {
				instance.callback = defaultCallback
			}
			const oldCb = instance.callback
			instance.callback = (action, instance) => {
				oldCb(action, instance)
				showNextMsg()
			};
			// closeOnPressEscape:esc取消 closeOnClickModal：点击蒙版
			['closeOnPressEscape', 'closeOnClickModal', 'modal'].forEach(prop => {
				if (instance[prop] === undefined) {
					instance[prop] = true
				}
			})
			document.body.appendChild(instance.$el)

			Vue.nextTick(() => {
				instance.visible = true
			})
		}
	}
}

export default MessageBox
