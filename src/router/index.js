import { routes } from './routes'
import {
    //createMemoryHistory,
    createRouter,
    // createWebHashHistory,
    createWebHistory,
    } from 'vue-router';

export const router = createRouter({
    routes,
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(),
});