import axios from 'axios';
import config from './config';
import _ from "lodash";
//创建axios
const request = axios.create(config);
//默认请求带参数
const urlPrefix = "/api";

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// 响应拦截器拦截返回的响应信息 6100状态码为用户未登录
request.interceptors.response.use(
    response => {
        const code = parseInt(response.data && response.data.errcode);
        switch (code) {
            // 用户未登录       
            case 500:
                console.log("500");
                break;
        }
        if (isIE9()) {
            // IE9数据处理
            if (response.status == 200 && response.request) {
                if (
                    response.request.responseType === "json" &&
                    response.request.responseText
                ) {
                    response.data = JSON.parse(response.request.responseText);
                }
            }
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    });
// 添加请求拦截器
request.interceptors.request.use(function(option) {
        // 在发送请求之前将参数转码在ie中会出现参数被编码的情况，这边做统一处理  
        option.url = urlPrefix + option.url;
        switch (option.method) {
            case 'post':
                if (option.headers['Content-Type'] !== 'application/json') {
                    option.data = decodeURIComponent(option.data);
                    console.log('Making request to ' + option.url)
                } else {
                    option.data = option.data;
                }
                break;
            case 'get':
                if (isIE9()) {
                    const { params } = option;
                    if (_.isObject(params)) {
                        params.time = +new Date();
                    }
                }
                break;
            default:
                break;
        }
        return option;
    },
    function(error) {
        // 对请求错误做些什么  
        return Promise.reject(error);
    });
// 是否为IE9
function isIE9() {
    if (
        navigator.appName == "Microsoft Internet Explorer" &&
        parseInt(
            navigator.appVersion
            .split(";")[1]
            .replace(/[ ]/g, "")
            .replace("MSIE", "")
        ) <= 9
    ) {
        return true;
    }
    return false;
}
//暴露模块
export default request;