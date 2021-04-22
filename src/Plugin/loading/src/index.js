// view https://github.com/ElemeFE/element/blob/6ec5f8e900ff698cf30e9479d692784af836a108/packages/loading/src/index.js#L41
import Loading from './main.vue'
import Vue from 'vue'
import { getStyle, addClass, removeClass } from '../../dom/dom.js'
import merge from '../../utils/merge.js'
import afterLeave from '../../utils/after-leave.js'
const isServer = Vue.prototype.$isServer
const LoadingConstructor = Vue.extend(Loading)
const defaults = {
	fullscreen: true,
	body: false,
	lock: false,
	customClass: ''
}
let fullscreenLoading
LoadingConstructor.prototype.originalPosition = ''
LoadingConstructor.prototype.originalOverflow = ''

LoadingConstructor.prototype.close = function() {
	if (this.fullscreen) {
		fullscreenLoading = undefined
	}
	afterLeave(this, () => {
		const target = this.fullscreen || this.body ? document.body : this.target
		removeClass(target, 'loading-parent--relative')
		removeClass(target, 'loading-parent--hidden')
	}, 300)
	if (this.$el && this.$el.parentNode) {
		this.$el.parentNode.removeChild(this.$el)
	}
	this.$destroy()
	this.visible = true
}

const loading = (options = {}) => {
	// 服务端渲染？
	if (isServer) return
	// 数据拼接
	options = merge({}, defaults, options)
	if (typeof options.target === 'string') {
		options.target = document.querySelector(options.target)
	}
	options.target = options.target || document.body
	if (options.target !== document.body) {
		options.fullscreen = false
	} else {
		options.body = true
	}
	// 是否全屏显示
	if (options.fullscreen && fullscreenLoading) {
		return fullscreenLoading
	}
	// 获取插入目标
	const parent = options.body ? document.body : options.target
	const instance = new LoadingConstructor({
		el: document.createElement('div'),
		data: options
	})
	addStyle(options, parent, instance)
	if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
		addClass(parent, 'loading-parent--relative')
	}
	if (options.fullscreen && options.lock) {
		addClass(parent, 'loading-parent--hidden')
	}
	parent.appendChild(instance.$el)
	// 可见
	Vue.nextTick(() => {
		instance.visible = true
	})
	if (options.fullscreen) {
		fullscreenLoading = instance
	}
	return instance
}

const addStyle = (options, parent, instance) => {
	const loadingStyle = {}
	if (options.fullscreen) {
		instance.originalPosition = getStyle(document.body, 'position')
		instance.originalOverflow = getStyle(document.body, 'overflow')
		loadingStyle.zIndex = '9999'
	} else if (options.body) {
		instance.originalPosition = getStyle(document.body, 'position')
	} else {
		instance.originalPosition = getStyle(parent, 'position')
		loadingStyle.height = document.documentElement.clientHeight - parent.getBoundingClientRect()['top'] + 'px'
	}
	Object.keys(loadingStyle).forEach(property => {
		instance.$el.style[property] = loadingStyle[property]
	})
}

export default loading
