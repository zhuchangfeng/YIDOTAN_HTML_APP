import axios from 'axios'
import config from './config'
import _ from 'lodash'
import Vue from 'vue'
const instance = new Vue('vue')
// 创建axios
const request = axios.create(config)
// 默认请求带参数
const urlPrefix = '/api'
// 默认请求次数
axios.defaults.retry = 4
// 默认请求的间隙
axios.defaults.retryDelay = 1000
// 默认请求头
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// 响应拦截器拦截返回的响应信息 6100状态码为用户未登录
request.interceptors.response.use(
	response => {
		const code = parseInt(response.data && response.data.errcode)
		switch (code) {
			// 用户未登录
			case 500:
				console.log('500')
				break
		}
		if (isIE9()) {
			// IE9数据处理
			if (response.status === 200 && response.request) {
				if (
					response.request.responseType === 'json' &&
					response.request.responseText
				) {
					response.data = JSON.parse(response.request.responseText)
				}
			}
		}
		return response
	},
	error => {
		// 请求超时的之后，抛出 error.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
		if (
			error.code === 'ECONNABORTED' &&
			error.message.indexOf('timeout') !== -1
		) {
			const config = error.config
			if (!config.retry) {
				config.retry = axios.defaults.retry
			}
			if (!config.retryDelay) {
				config.retryDelay = axios.defaults.retryDelay
			}
			// If config does not exist or the retry option is not set, reject
			if (!config || !config.retry) return Promise.reject(error)
			config.__retryCount = config.__retryCount || 0
			// Reject with the error
			if (config.__retryCount >= config.retry) {
				return Promise.reject(error)
			}
			// Increase the retry count
			config.__retryCount += 1
			// Create new promise to handle exponential backoff
			const backoff = new Promise(function(resolve) {
				setTimeout(function() {
					resolve()
					instance.$message({
						message: '请求超时'
					})
				}, config.retryDelay || 1)
			})
			// Return the promise in which recalls axios to retry the request
			return backoff.then(() => axios(config))
		} else {
			const { status } = error.request
			instance.$message({
				message: `服务错误${status}`
			})
			return Promise.reject(error)
		}
	}
)
// 添加请求拦截器
request.interceptors.request.use(
	function(option) {
		// 在发送请求之前将参数转码在ie中会出现参数被编码的情况，这边做统一处理
		option.url = urlPrefix + option.url
		switch (option.method) {
			case 'post':
				if (option.headers['Content-Type'] !== 'application/json') {
					option.data = decodeURIComponent(option.data)
					console.log('Making request to ' + option.url)
				}
				break
			case 'get':
				if (isIE9()) {
					const { params } = option
					if (_.isObject(params)) {
						params.time = +new Date()
					}
				}
				break
			default:
				break
		}
		return option
	},
	function(error) {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)
// 是否为IE9
function isIE9() {
	if (
		navigator.appName === 'Microsoft Internet Explorer' &&
		parseInt(
			navigator.appVersion
				.split(';')[1]
				.replace(/[ ]/g, '')
				.replace('MSIE', '')
		) <= 9
	) {
		return true
	}
	return false
}
// 暴露模块
export default request
