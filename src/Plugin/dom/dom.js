import Vue from 'vue';
import { getType } from "../utils/index"
const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const version = "0.1";
// IE的版本
const ieVersion = isServer ? 0 : Number(document.documentMode);
/**
 * @param {dom} DOM对象
 *  是否为DOM对象
 */
export const isDom = (dom) => typeof dom === 'object' ? dom instanceof HTMLElement : dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
/**
 * @param {name} 处理名称
 *  驼峰处理 
 */
export const camelCase = function(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};
/**
 * @param {string}字符串名称
 * 去两端空格
 */
export const trim = function(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/**
 * @param {DOM} element
 * @param {事件名称} event
 * @param {事件方法} handler
 *  dom事件监听
 */
export const on = (function() {
    if (!isServer) {
        if (document.addEventListener) {
            return function(element, event, handler) {
                if (element && event && handler) {
                    element.addEventListener(event, handler, true)
                }
            }
        } else {
            return function(element, event, handler) {
                if (element && event && handler) {
                    element.attachEvent('on' + event, handler);
                }
            }
        }
    }
})();
/**
 * @param {DOM} element
 * @param {事件名称} event
 * @param {事件方法} handler
 *  dom事件解绑
 */
export const off = (function() {
    if (!isServer) {
        if (document.removeEventListener) {
            return function(element, event, handler) {
                if (element && event && handler) {
                    element.removeEventListener(event, handler, false);
                }
            }
        } else {
            return function(element, event, handler) {
                if (element && event && handler) {
                    element.detachEvent('on' + event, handler);
                }
            }
        }
    }
})();
/**
 * @param {DOM} el
 * @param {事件名称} event
 * @param {事件方法} fn
 *  dom事件解绑
 */
export const once = function(el, event, fn) {
        var listener = function() {
            if (fn) {
                fn.apply(this, arguments)
            }
            off(el, event, listener);
        };
        on(el, event, listener);
    }
    /**
     * @param {DOM} el
     * @param {事件名称} event
     * @param {事件方法} fn
     *  是否存在class
     */
export const hasClass = function(el, cls) {
        if (!el || !cls) return;
        if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
        if (el.classList) {
            return el.classList.contains(cls);
        } else {
            return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
        }
    }
    /**
     * @param {DOM} el
     * @param {className} cls
     *  添加class 
     */
export const addClass = function(el, cls) {
        if (!el) return;
        var curClass = el.className;
        var classes = (cls || '').split(' ');
        for (var i = 0, j = classes.length; i < j; i++) {
            var clsName = classes[i];
            if (!clsName) continue;
            if (el.classList) {
                el.classList.add(clsName);
            } else if (!hasClass(el, clsName)) {
                curClass += ' ' + clsName;
            }
            if (!el.classList) {
                el.className = curClass;
            }
        }
    }
    /**
     * @param {DOM} el
     * @param {className} cls
     * 移除class 
     */
export const removeClass = function(el, cls) {
    if (!el && !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';
    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;
        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ')
        }
        if (!el.classList) {
            el.className = trim(curClass);
        }
    }
}

/**
 * @param {目标节点} root
 * @param {比较节点} el
 *  目标节点包涵比较节点
 */
export const contains = function(root, el) {
    if (root.compareDocumentPosition) {
        return root === el || !!(root.compareDocumentPosition(el) & 16);
    }
    if (root.contains && el.nodeType === 1) {
        // 节点是元素节点 1 节点是属性节点 2
        return root.contains(el) && root != el;
    }
    while ((el = el.parentNode))
        if (el === root) return true;
    return false;
}

/**
 * @param {element} 目标节点
 * @param {styleName}  样式名称
 *  获取样式
 */
export const getStyle = ieVersion < 9 ? function(element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'styleFloat';
    }
    try {
        switch (styleName) {
            case 'opacity':
                try {
                    return element.filters.item('alpha').opacity / 100;
                } catch (e) {
                    return 1.0;
                }
            default:
                return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
        }
    } catch (e) {
        return element.style[styleName];
    }
} : function(element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        var computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return element.style[styleName];
    }
};

/**
 * @param {element} 目标节点
 * @param {styleName}  样式名称
 * @param {value}  样式值
 *  设置样式
 */

export function setStyle(element, styleName, value) {
    if (!element || !styleName) return;
    if (getType(styleName) == "object") {
        for (const prop in styleName) {
            if (styleName.hasOwnProperty(prop)) {
                setStyle(element, prop, styleName[prop]);
            }
        }
    } else {
        styleName = camelCase(styleName);
        if (styleName === 'opacity' && ieVersion < 9) {
            element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
        } else {
            element.style[styleName] = value;
        }
    }
}