import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
        path: "/login",
        component: () =>
            import ("../components/Login")
    },
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/home",
        component: () =>
            import ("../components/Home"),

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