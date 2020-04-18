import Vue from 'vue';
import Vuex from 'vuex';
import Felix from './public/Felix'
import Jack from './public/Jack'
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        Felix,
        Jack
    },
    strict: process.env.NODE_ENV !== 'production'
});
export default store;