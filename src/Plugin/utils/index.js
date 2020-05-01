//see:https://github.com/ElemeFE/element/blob/6ec5f8e900ff698cf30e9479d692784af836a108/src/utils/util.js
import Vue from 'vue';
const isServer = Vue.prototype.$isServer;
const version = "0.1";
const hasOwnProperty = Object.prototype.hasOwnProperty;
const typer = Object.prototype.toString;
/**
 * @param {value} 待检查的值
 * @description
 * 获取值的类型
 * @export
 */
export function getType(value) {
    var typeStr = typer.call(value);
    typeStr = typeStr.replace(/.*\s(\w+)\]/g, '$1');
    return typeStr.toLowerCase();
}

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
};
/**
 * @param {to}目标对象
 * @param {_from}传入对象
 * @description
 * 对象合并
 * @export
 */
export function extend(to, _from) {
    const isObj = getType(to) == "object" ? getType(_from) == "object" ? true : false : false;
    if (isObj) {
        for (let key in _from) {
            if (hasOwn(_from, key)) {
                const element = _from[key];
                to[key] = element;
            }
            return to;
        }
    } else {
        if (to) return to;
        if (_from) return _from;
    }

}
/**
 * @param {arr}目标对象
 * @description
 * 转化为对象
 * @export
 */
export function toObject(arr) {
    if (getType(arr) == "object") {
        return arr
    } else {
        var res = {};
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element) {
                extend(res, {
                    [i]: element
                })
            }
        }
        return res
    }
}

/**
 * @description
 * 随机ID 四位数
 * @export
 */
export const generateId = function() {
    return Math.floor(Math.random() * 10000);
};

/**
 * @description
 * 特殊字段处理
 *  @param {value}传入的值
 * @export
 */
export const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
/**
 * @description
 * 是否IE浏览器
 * @export
 */
export const isIE = function() {
    return !isServer && !isNaN(Number(document.documentMode));
};
/**
 * @description
 * 是否Edge浏览器
 * @export
 */
export const isEdge = function() {
    return !isServer && navigator.userAgent.indexOf('Edge') > -1;
};
/**
 * 是否Firefox浏览器
 * @export
 */
export const isFirefox = function() {
    return !isServer && !!window.navigator.userAgent.match(/firefox/i);
};

/**
 * @param {val} 待检查的值
 * @description
 * 获取值的是否为空
 * @export
 */
export const isEmpty = function(val) {
    if (val == null) return true;
    if (typeof val === 'boolean') return false;
    if (typeof val === 'number') return !val;
    if (val instanceof Error) return val.message === '';
    const type = getType(val);
    switch (type) {
        case 'array':
            return !val.length;
        case 'string':
            return !val.replace(/\s+/g, "").length;
        case 'file':
        case 'map':
        case 'set':
            {
                return !val.size;
            }
        case 'object':
            return !Object.keys(val).length;
    }
    return false;
}

/**
 * @description
 * 对象转转换为数组
 * @param{obj}传入的对象
 * @export
 */
export const objToArray = function(obj) {
    const type = getType(obj);
    if (type == "array") {
        return obj;
    }
    return isEmpty(obj) ? [] : [obj]
}

/**
 * @description
 * 首字母大写
 * @param{str} 需要转化的字符串
 * @export
 */
export const capitalize = function(str) {
    const type = getType(str);
    if (type == "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);;
    }
    return str
}

/**
 * 两个值是否相等
 * @param{a} 比较值
 * @param{b} 比较值
 * @export
 */
export const valueEquals = (a, b) => {
    if (a === b) return true;
    if (!(a instanceof Array)) return false;
    if (!(b instanceof Array)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i !== a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};


/**
 * @description
 * 判断平台是否是 iOS
 * @param {string} [ua=window.navigator.userAgent] ua字符串
 * @returns {boolean} 返回判断结果
 * @export
 * @example
 * Utils.isiOS('Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1')
 * // => true
 */
export function isiOS(ua) {
    /* istanbul ignore if */
    if (!ua) {
        ua = window.navigator.userAgent;
    }
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

/**
 * @description
 * 判断平台是否是安卓
 * @param {string} [ua=window.navigator.userAgent] ua字符串
 * @returns {boolean} 返回判断结果
 * @export
 * @example
 * Utils.isAndroid('Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Mobile Safari/537.36')
 * // => true
 */
export function isAndroid(ua) {
    /* istanbul ignore if */
    if (!ua) {
        ua = window.navigator.userAgent;
    }
    return -1 < ua.indexOf('Android') || -1 < ua.indexOf('Adr');
}


/**
 * @description
 * 判断平台是否是微信 
 * @param {string} [ua=window.navigator.userAgent] ua字符串
 * @returns {boolean} 返回判断结果
 * @example
 * @export
 * Utils.isWechat('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.3 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1  MicroMessenger/7.0.4')
 * // => true
 */
export function isWechat(ua) {
    /* istanbul ignore if */
    if (!ua) {
        ua = window.navigator.userAgent;
    }
    return /MicroMessenger/i.test(ua);
}

/**
 * @description
 * 获取URL的参数 
 * @param {string} name字符串
 * @returns {string||null} 返回判断结果
 * @export
 * @example
 * ?search=555&&age=666
 * // => string||null
 */
export function parseUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2])
    }
    return null
};
/**
 * @description
 * 随机颜色 
 * @param {number} opacity
 * @returns {string} 返回判断结果
 * @export
 * @example
 * rgba(199, 223, 145, 0.3);
 */
export function randomColor(opacity = 0.3) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = /^0\.[1-9]\d*$/.test(opacity) ? opacity : 1
    return "rgb(" + r + ',' + g + ',' + b + ',' + opacity + ")";
}