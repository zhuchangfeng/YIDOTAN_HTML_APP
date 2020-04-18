import Vue from 'vue'
import Router from 'vue-router'
import Felix from "./modules/Felix"
Vue.use(Router);
const version = "v4";
const R = new Router({
    mode: "history",
    routes: [
        ...Felix
    ],
    base: "/" + version + "/",
    fallback: false
});
export default R;