const state = {
    jack: {
        a: "jack"
    }, //测试
}
const getters = {
    getTest(state) {
        return state.jack;
    }
}
const mutations = {
    changTest(state, value) {
        state.jack = value
    }

}
const actions = {
    // 异步方法
    actionTest(context, value) {
        // 异步改变对话框的状态
        context.commit(changTest, value)
    }
}
export default {
    namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
    state,
    getters,
    mutations,
    actions
}