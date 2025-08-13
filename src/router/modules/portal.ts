import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/portal',
    name: 'portal',
    component: () => import('@/layout/index.vue'),
    meta: { title: '可信数据门户系统', icon: 'DatabaseOutlined' },
    children: [
      {
        path: 'catalog',
        name: 'portal_catalog',
        component: () => import('@/views/portal/catalog/index.vue'),
        meta: { title: '数据目录浏览与申请' }
      },
      {
        path: 'myapply',
        name: 'portal_myapply',
        component: () => import('@/views/portal/myapply/index.vue'),
        meta: { title: '我的申请管理' }
      }
    ]
  }
];

export default routes;
