import Loading from './main.vue'
import Vue from 'vue'
import { getStyle, addClass, removeClass } from '../../dom/dom.js'
import afterLeave from '../../utils/after-leave.js'
const Mask = Vue.extend(Loading)
const isServer = Vue.prototype.$isServer
const loadingDirective = {}
loadingDirective.install = Vue => {
	if (isServer) return
	/**
     * @param {el} 目标节点
     * @param {binding} 创建值
     *  切换Loading
     */
	// body fullscreen lock
	const toggleLoading = (el, binding) => {
		if (binding.value) {
			Vue.nextTick(() => {
				if (binding.modifiers.fullscreen) {
					el.originalPosition = getStyle(document.body, 'position')
					el.originalOverflow = getStyle(document.body, 'overflow')
					el.maskStyle.zIndex = '9999'
					addClass(el.mask, 'is-fullscreen')
					insertDom(document.body, el, binding)
				} else {
					removeClass(el.mask, 'is-fullscreen')
					if (binding.modifiers.body) {
						el.originalPosition = getStyle(document.body, 'position');
						// ['top', 'left'].forEach(property => {
						//     const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
						//     el.maskStyle[property] = el.getBoundingClientRect()[property] +
						//         document.body[scroll] +
						//         document.documentElement[scroll] -
						//         parseInt(getStyle(document.body, `margin-${property}`), 10) +
						//         'px';
						// });
						['height', 'width'].forEach(property => {
							el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px'
						})
						insertDom(document.body, el, binding)
					} else {
						el.maskStyle['height'] = document.body.getBoundingClientRect()['height'] - el.getBoundingClientRect()['top'] + 'px'
						el.originalPosition = getStyle(el, 'position')
						insertDom(el, el, binding)
					}
				}
			})
		} else {
			afterLeave(el.instance, () => {
				if (!el.instance.hiding) return
				el.domVisible = false
				const target = binding.modifiers.fullscreen || binding.modifiers.body ? document.body : el
				removeClass(target, 'loading-parent--relative')
				removeClass(target, 'loading-parent--hidden')
				el.instance.hiding = false
			}, 300, true)
			el.instance.visible = false
			el.instance.hiding = true
		}
	}
	/**
     * @param {parent} 父节点
     * @param {el} 目标节点
     * @param {binding} 创建值
     *  是否为DOM对象
     */
	const insertDom = (parent, el, binding) => {
		if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
			Object.keys(el.maskStyle).forEach(property => {
				el.mask.style[property] = el.maskStyle[property]
			})
			if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
				addClass(parent, 'loading-parent--relative')
			}
			if (binding.modifiers.fullscreen && binding.modifiers.lock) {
				addClass(parent, 'loading-parent--hidden')
			}
			el.domVisible = true
			parent.appendChild(el.mask)
			Vue.nextTick(() => {
				if (el.instance.hiding) {
					el.instance.$emit('after-leave')
				} else {
					el.instance.visible = true
				}
			})
			el.domInserted = true
		} else if (el.domVisible && el.instance.hiding === true) {
			el.instance.visible = true
			el.instance.hiding = false
		}
	}

	Vue.directive('loading', {
		bind(el, binding, vnode, oldVnode) {
			// new Mask
			const mask = new Mask({
				el: document.createElement('div'),
				data: {
					fullscreen: !!binding.modifiers.fullscreen
				}
			})
			// 赋值
			el.instance = mask
			el.mask = mask.$el
			el.maskStyle = {}
			binding.value && toggleLoading(el, binding)
		},
		update(el, binding, vnode, oldVnode) {
			if (binding.oldValue !== binding.value) {
				toggleLoading(el, binding)
			}
		},
		unbind: function(el, binding) {
			if (el.domInserted) {
				el.mask &&
                    el.mask.parentNode &&
                    el.mask.parentNode.removeChild(el.mask)
				toggleLoading(el, { value: false, modifiers: binding.modifiers })
			}
			// 当组件 unbind 的时候，执行组件销毁
			el.instance && el.instance.$destroy()
		}
	})
}

export default loadingDirective
