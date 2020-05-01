import request from '../service/request';
import qs from 'qs';

function jsonProp(obj) {
    // type check
    if (!obj || (typeof obj !== 'object')) {
        return obj;
    }
    Object.keys(obj).forEach((key) => {
        if ((typeof obj[key]) === 'object') {
            obj[key] = JSON.stringify(obj[key])
        }
    });
    return obj;
}

function createObj(obj) {
    const toString = Object.prototype.toString;
    if (toString.call(obj) == "[object Object]") {
        const { params, data, ...other } = obj;
        const back = Object.assign(
            data ? {
                data: toString.call(data) == "[object Object]" ?
                    qs.stringify(jsonProp(data)) : jsonProp(data)
            } : params ? { params: params } : {}, other);
        return back;
    }
    return {};
}

export const getInfo = (obj) => request({
    method: "GET",
    url: "/info",
    ...createObj(obj)
});

export const getNewDetail = (obj) => request({
    method: "GET",
    url: "/new/detail",
    ...createObj(obj)
});

export const getMasterDetail = (obj) => request({
    method: "GET",
    url: "/master/detail",
    ...createObj(obj)
});

export const getZhongceList = (obj) => request({
    method: "GET",
    url: "/zhongce/list",
    ...createObj(obj)
});
export const getZhongDetail = (obj) => request({
    method: "GET",
    url: "/zhongce/detail",
    ...createObj(obj)
});
export const getSimilarList = (obj) => request({
    method: "GET",
    url: "/similar/list",
    ...createObj(obj)
});

export const getDecorateList = (obj) => request({
    method: "GET",
    url: "/master/decorate",
    ...createObj(obj)
});

export const getAlbum = (obj) => request({
    method: "GET",
    url: "/album",
    ...createObj(obj)
});

export const getActivitetags = (obj) => request({
    method: "GET",
    url: "/photo/activitetags",
    ...createObj(obj)
});

export const getAlbumDetail = (obj) => request({
    method: "GET",
    url: '/album/detail',
    ...createObj(obj)
});