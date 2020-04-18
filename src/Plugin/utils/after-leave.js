/**
 * @param {instance} vue实例
 * @param {callback} 离开后的回调函数
 * @param {speed }  过渡时间 默认300ms
 * @param {once} 绑定后是否执行一次 默认是false
 */

export default function(instance, callback, speed = 300, once = false) {
    if (!instance && !callback) throw new Error('instance & callback is required');
    let called = false;
    const afterLeaveCallback = function() {
        if (called) return;
        called = true;
        if (callback) {
            callback.apply(null, arguments);
        }
    }
    if (once) {
        instance.$once('after-leave', afterLeaveCallback);
    } else {
        instance.$on('after-leave', afterLeaveCallback);
    }
    setTimeout(() => {
        afterLeaveCallback();
    }, speed + 100);
}