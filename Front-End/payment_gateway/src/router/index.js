import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/Mumbai-Testnet/deposit'
    },
    {
        path: '/:paymentNetwork',
        name: 'Index',
        component: () => import('../views/index.vue'),
        children: [
            // {
            //     path: '/:paymentNetwork/deposit',
            //     name: 'Deposit',
            //     component: () => import('../views/deposit.vue')
            // },
            // {
            //     path: '/:paymentNetwork/withdraw',
            //     name: 'Withdraw',
            //     component: () => import('../views/withdraw.vue')
            // },
            {
                path: 'deposit',
                name: 'ConnectBoxContainer',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Deposit"},
            },
            {
                path: 'withdraw',
                name: 'ConnectBoxContainer',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Withdrawal"},
            },
            {
                path: 'tokenRegister',
                name: 'TokenRegister',
                // component: () => import('../components/tokenRegister.vue'),
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Token"},
            },
            {
                path: 'c2bPayment',
                name: 'c2bPayment',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Flash C2B Payment"},
            },
            {
                path: 'admin',
                name: 'admin',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Admin"},
            },
            {
                path: 'merchant',
                name: 'merchant',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Merchant"},
            },
            {
                path: 'referralcommission',
                name: 'referralCommission',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Referral Commission System"},
            },
            {
                path: 'subscription',
                name: 'subscription',
                component: () => import('../views/connectBoxContainer.vue'),
                props:{service:"Subscription Service"},
            },
            // {
            //     path: '/:paymentNetwork/c2bPayment',
            //     name: 'c2bPayment',
            //     component: () => import('../components/c2bPayment.vue')
            // },
            // {
            //     path: '/:paymentNetwork/tokenRegister',
            //     name: 'TokenRegister',
            //     component: () => import('../components/tokenRegister.vue')
            // },
            {
                path: '/:paymentNetwork/test',
                name: 'Test',
                component: () => import('../views/test.vue')
            },
            {
                path: '/:paymentNetwork/dashboard',
                name: 'Dashboard',
                component: () => import('../views/dashboard.vue')
            }

        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


export default router;