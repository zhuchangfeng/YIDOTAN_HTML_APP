import Loading from '../Plugin/loading/index.js'
import Message from '../Plugin/message/index.js'
import MessageBox from '../Plugin/message-box/index.js'

const install = (Vue, opts = {}) => {
	Vue.use(Loading.directive)
	Vue.prototype.$loading = Loading.service
	Vue.prototype.$message = Message
	Vue.prototype.$msgbox = MessageBox
}

export default {
	version: '2.13.0',
	install,
	Loading,
	Message,
	MessageBox
}
