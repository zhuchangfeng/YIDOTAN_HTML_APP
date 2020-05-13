export default [{
        path: '/HelloWorld',
        name: 'HelloWorld',
        component: resolve => require(['@/components/HelloWorld.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            TopTitlehide: true, //是否隐藏标题
            opName: 'HelloWorld'
        }
    },
    {
        path: '/Home',
        name: 'Home',
        component: resolve => require(['@/page/demo/Home.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: true, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        },
    },
    {
        path: '/Home1',
        name: 'Home1',
        component: resolve => require(['@/components/Home/Home1.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: true, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        },
    },
    {
        path: '/jsx',
        name: 'jsx',
        component: resolve => require(['@/components/jsx/jsx.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: true, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        },
    },
    {
        path: '/Home2',
        name: 'Home2',
        component: resolve => require(['@/page/demo/Home2.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: true, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        }
    },
    {
        path: '/Home3',
        name: 'Home3',
        component: resolve => require(['@/page/demo/Home3.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: true, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        }
    },
    {
        path: '/Home4',
        name: 'Home4',
        component: resolve => require(['@/page/demo/Home4.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: true, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        }
    },
    // {
    //     path: '/test',
    //     name: 'test',
    //     component: resolve => require(['@/page/demo/test.vue'], resolve),
    //     meta: {
    //         // keepAlive: true, // 不需要被缓存
    //         Tbshow: false, //是否显示tabbar
    //         TopTitlehide: true, //是否隐藏标题
    //     }
    // },
    {
        path: '/dome',
        name: 'dome',
        component: resolve => require(['@/page/demo/demo.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: false, //是否显示tabbar
            TopTitlehide: true, //是否隐藏标题
        }
    },
    {
        path: '/index',
        name: 'index',
        component: resolve => require(['@/page/index.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: false, //是否显示tabbar
            TopTitlehide: false, //是否隐藏标题
        },
        alias: '/'
    },
    {
        path: "/404",
        name: "404Found",
        component: resolve => require(['@/page/404Found.vue'], resolve),
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: false, //是否显示tabbar
            TopTitlehide: false, //是否隐藏标题,
            TopName: '页面不存在！'
        }
    },
    {
        path: "/new",
        name: "new",
        component: resolve => require(['@/page/new/index.vue'], resolve),
        children: [{
            path: "/new/:id",
            component: resolve => require(['@/page/new/_id.vue'], resolve),
            name: "new-id",
            beforeEnter: (to, from, next) => {
                if (/^[0-9]*$/.test(to.params.id)) {
                    next();
                } else {
                    next("/404");
                }
            },
        }]
    },
    {
        path: "/master",
        name: "master",
        component: resolve => require(['@/page/master/index.vue'], resolve),
        children: [{
                path: "/master/:id",
                component: resolve => require(['@/page/master/_id.vue'], resolve),
                name: "master-id",
                meta: {
                    masterTop: true,
                    masterBottom: true,
                },
                beforeEnter: (to, from, next) => {
                    const { id } = to.params;
                    if (/^[0-9]*$/.test(id)) {
                        next();
                    } else {
                        next("/404");
                    }
                },
            },
            {
                path: "/master/decorate/:type",
                component: resolve => require(['@/page/master/decorate/_type.vue'], resolve),
                name: "master-decorate-type",
                beforeEnter: (to, from, next) => {
                    const { type } = to.params;
                    if (type && /[\S]+/.test(type)) {
                        next();
                    } else {
                        next("/404");
                    }
                }
            }
        ]
    },
    {
        path: "/zhongce",
        name: "zhongce",
        component: resolve => require(['@/page/zhongce/index.vue'], resolve),
        children: [{
                path: "/zhongce/list",
                component: resolve => require(['@/page/zhongce/list/index.vue'], resolve),
                name: "zhongce-list",
                meta: {
                    keepAlive: true, // 不需要被缓存
                    zhongceTop: true
                }
            },
            {
                path: "/zhongce/similar",
                component: resolve => require(['@/page/zhongce/similar/index.vue'], resolve),
                name: "zhongce-similar",
                meta: {
                    keepAlive: true, // 不需要被缓存
                    zhongceTop: true
                }
            },
            {
                path: "/zhongce/:id",
                component: resolve => require(['@/page/zhongce/_id.vue'], resolve),
                name: "zhongce-id",
                beforeEnter: (to, from, next) => {
                    if (/^[0-9]*$/.test(to.params.id)) {
                        next();
                    } else {
                        next("/404");
                    }
                }
            }
        ]
    },
    {
        path: "/pic/list/:space/:style/:part/:soft/:order/:sharing",
        component: resolve => require(['@/page/pic/list/index.vue'], resolve),
        name: "pic-list",
        meta: {
            keepAlive: true, // 不需要被缓存
            Tbshow: false, //是否显示tabbar
            TopTitlehide: false, //是否隐藏标题,
        }
    },
    {
        path: "/pic/slice/:id/:space/:style/:part/:soft/:order/:sharing",
        component: resolve => require(['@/page/pic/slide/index.vue'], resolve),
        name: "pic-slice",
        meta: {
            // keepAlive: true, // 不需要被缓存
            Tbshow: false, //是否显示tabbar
            TopTitlehide: false, //是否隐藏标题,
        },
        redirect: to => "/pic/slice/user/" + to.params.id,
        beforeEnter: (to, from, next) => {
            const { id } = to.params;
            if (/^[0-9]*$/.test(id)) {
                next();
            } else {
                next("/404");
            }
        },
        children: [{
            path: '/pic/slice/user/:id',
            component: resolve => require(['@/page/pic/slide/user/_id.vue'], resolve),
            name: "pic-slide-user-id",
            beforeEnter: (to, from, next) => {
                const { id } = to.params;
                if (/^[0-9]*$/.test(id)) {
                    next();
                } else {
                    next("/404");
                }
            }
        }]
    },
    {
        path: "/case/list/:size/:area/:budget/:style/:type/:order",
        name: "case-list",
        component: resolve => require(['@/page/case/list.vue'], resolve),
        meta: {
            keepAlive: true, // 不需要被缓存
            Tbshow: false, //是否显示tabbar
            TopTitlehide: false, //是否隐藏标题,
        }
    },
    {
        path: "*",
        redirect: "/404"
    }
]