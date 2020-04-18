'use strict'
/**
 * 
 * @param {文件名称匹配} FolderName
 *  实际上是 webpack 的方法,vue 工程一般基于 webpack,所以可以使用
    require.context(directory,useSubdirectories,regExp)
    接收三个参数:
    directory：说明需要检索的目录
    useSubdirectories：是否检索子目录
    regExp: 匹配文件的正则表达式,一般是文件名
 */

export const importComponents = (FolderName) => {
    const files = require.context('@/components/', true, /\.vue$/);
    const modules = {};
    const path = require('path');
    files.keys().forEach(key => {
        if (FolderName && key.indexOf(FolderName) != -1) {
            const name = path.basename(key, '.vue');
            modules[name] = files(key).default || files(key);
        }
    });
    return modules;
}