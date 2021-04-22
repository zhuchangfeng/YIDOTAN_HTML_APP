import Vue from 'vue'
import message from './main.vue'
const isServer = Vue.prototype.$isServer
const MessageConstructor = Vue.extend(message)
// 计数
let seed = 1
// 消息实例
let instance
// 消息实例数组
const instances = []
/**
 * 初始化Message
 * @param{options} 配置
 */
const Message = function(options) {
	// 是否服务端渲染
	if (isServer) return
	options = options || {}
	if (typeof options === 'string') {
		options = {
			message: options
		}
	}
	const id = `message_${seed++}`
	// 关闭回调函数
	const userOnClose = options.onClose
	options.onClose = function() {
		Message.close(id, userOnClose)
	}
	instance = new MessageConstructor({
		data: options
	})
	instance.id = id
	// 挂载body
	instance.$mount()
	document.body.appendChild(instance.$el)
	let verticalOffset = options.offset || 20
	instances.forEach(item => {
		verticalOffset += item.$el.offsetHeight + 16
		item.verticalOffset = verticalOffset
	})
	instance.verticalOffset = options.offset || 20
	instance.visible = true
	const zIndex = options.zIndex || '9999'
	instance.$el.style.zIndex = zIndex
	instances.unshift(instance)
	return instance
}
/**
 * 关闭消息提示
 * @param{id} 指定的id
 * @param{userOnClose} 关闭回调
 */
Message.close = function(id, userOnClose) {
	const len = instances.length
	let index = -1
	let removedHeight
	for (let i = 0; i < len; i++) {
		if (id === instances[i].id) {
			index = i
			removedHeight = instances[i].$el.offsetHeight
			userOnClose && typeof userOnClose === 'function' && userOnClose(instances[i])
			instances.splice(i, 1)
			break
		}
	}
	if (len <= 1 || index === -1 || index > instances.length - 1) return
	for (let i = index; i < len - 1; i++) {
		const dom = instances[i].$el
		dom.style['bottom'] =
            parseInt(dom.style['bottom'], 10) - removedHeight - 16 + 'px'
	}
}

// 全部关闭
Message.closeAll = function() {
	instances.forEach(item => {
		item.close()
	})
}

export default Message
