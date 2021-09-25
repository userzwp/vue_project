import Vue from 'vue'
import VueRouter from 'vue-router'

const Welcome = () =>
    import ("../components/Welcome")
Vue.use(VueRouter)

const routes = [{
        path: "/",
        redirect: "/login"
    }, {
        path: "/login",
        component: () =>
            import ("../components/Login")
    },

    {
        path: "/home",
        component: () =>
            import ("../components/Home"),
        redirect: "/welcome",
        children: [{
                path: "/welcome",
                name: "",
                component: Welcome
            },
            {
                path: "/users",
                component: () =>
                    import ("../components/user/Users")
            },
            {
                path: "/rights",
                component: () =>
                    import ("../components/power/Rights")
            },
            {
                path: "/roles",
                component: () =>
                    import ("../components/power/Roles")
            },
            {
                path: "/categories",
                component: () =>
                    import ("../components/goods/Cate")
            },
            {
                path: "/params",
                component: () =>
                    import ("../components/goods/Params")
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === "/login") return next();
    const tokenStr = sessionStorage.getItem("token")
    if (!tokenStr) return next("/login")
    next()
})

export default router