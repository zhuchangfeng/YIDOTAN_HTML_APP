import Vue from 'vue'
import Router from 'vue-router'
import Felix from './modules/Felix'
Vue.use(Router)

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

const version = 'v4'
const createRouter = () =>
	new Router({
		mode: 'history',
		routes: [
			...Felix
		],
		base: '/' + version + '/',
		fallback: false,
		scrollBehavior: () => ({ y: 0 })
	})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
