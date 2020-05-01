// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import i18n from './i18n/index';
import store from './store/index';
import ('./style/public.less');
import ('./style/base.less');
import ('./style/main.less');
import { Popup, Cell, NumberKeyboard, Button, Swipe, SwipeItem } from 'vant';
import _ from 'lodash';
import VRFCT from './Plugin/VRFCT';
import VueLazyload from 'vue-lazyload';
import Plugin from "./Plugin/index.js"
import 'font-awesome/css/font-awesome.min.css';
Vue.config.productionTip = false;
Vue.prototype._ = _;
Vue.use(Popup).use(Cell).use(NumberKeyboard).use(Button).use(Swipe).use(SwipeItem);
Vue.use(VRFCT);
Vue.use(Plugin);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    // error: 'dist/error.png',
    // loading: 'dist/loading.gif',
    attempt: 3,
    listenEvents: ['scroll'], //['scroll','wheel','mousewheel','resize','animationend','transitionend','touchmove']
});

Vue.component('Profile', () =>
    import ('./extend/profile'));
/* eslint-disable no-new */
Vue.config.keyCodes = {
    // camelCase won`t work
    v: 86,
    f1: 112,
    // 取而代之的是 kebab-case 且用双引号括起来
    'media-play-pause': 179,
    up: [38, 87],
    ctrl: 17,
    esc: 27
}
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    components: { App },
    template: '<App/>'
})