import {createRouter, createWebHistory, useRoute} from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import {ref} from "vue";
import axios from "axios";

const routes = [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 添加全局前置守卫
router.beforeEach(async (to, from, next) => {
    if (to.name == "Home") {
        const sessionId = ref("");
        const sessionIdFromUrl = to.query.sessionId as string;
        if (sessionIdFromUrl) {
            sessionId.value = sessionIdFromUrl;
            localStorage.setItem('sessionId', sessionIdFromUrl);
        } else if (localStorage.getItem('sessionId')) {
            sessionId.value = localStorage.getItem('sessionId') || '';
        }
        if (sessionId.value == '') {
            // 没有 sessionId，重定向到登录页面
            return next({ name: 'Login' });
        } else {
            try {
                // 验证 sessionId 是否有效
                const response = await axios.get('http://localhost:8080/auth/home', {
                    params: { sessionId: sessionId.value }
                });
                if (response.data && response.data.data) {
                    // 如果 username 存在，则 sessionId 有效
                    localStorage.setItem('username', response.data.data);
                    next();
                } else {
                    // 如果无效，清除 localStorage 并重定向到登录页面
                    localStorage.removeItem('sessionId');
                    next({ name: 'Login' });
                }
            } catch (error) {
                console.error('验证 sessionId 失败:', error);
                localStorage.removeItem('sessionId');
                next({ name: 'Login' });
            }
        }
    } else {
        // 如果目标路由是登录页面，直接继续导航
        next();
    }
});

export default router