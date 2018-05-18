import VueRouter from 'vue-router'
import Vue from 'vue'
import queryView1 from '../views/queryView1'
import containerView from '../views/containerView'

Vue.use(VueRouter);

export default new VueRouter({
    mode : 'history',
    routes : [
        {
            path : '/',
            redirect : '/pc/query'
        },
        {
            path : '/pc',
            component : containerView,
            children : [
                {
                    path : 'query',
                    name : 'pcquery',
                    component: queryView1
                }
            ]
        },
    ]
})