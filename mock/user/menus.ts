import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

const menusList = [
  // Dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'LAYOUT',
    redirect: '/dashboard/console',
    meta: {
      icon: 'DashboardOutlined',
      title: 'Dashboard',
    },
    children: [
      {
        path: 'console',
        name: 'dashboard_console',
        component: '/dashboard/console/console',
        meta: { title: '主控台' },
      },
      {
        path: 'monitor',
        name: 'dashboard_monitor',
        component: '/dashboard/monitor/monitor',
        meta: { title: '监控页' },
      },
    ],
  },

  // 可信数据门户系统
  {
    path: '/portal',
    name: 'Portal',
    component: 'LAYOUT',
    meta: { title: '可信数据门户系统', icon: 'DatabaseOutlined' },
    children: [
    { path: 'catalog', name: 'portal_catalog', component: '/portal/catalog/index', meta: { title: '数据目录浏览与申请' } },
    { path: 'catalog/detail/:id?', name: 'portal_catalog_detail', component: '/portal/catalog/detail', meta: { title: '数据详情', hidden: true } },
  { path: 'myapply', name: 'portal_myapply', component: '/portal/myapply/index', meta: { title: '我的申请管理' } },
      { path: 'access', name: 'portal_access', component: '/portal/access', meta: { title: '数据访问与交付' } },
      { path: 'messages', name: 'portal_messages', component: '/portal/messages', meta: { title: '通知与消息' } },
    ],
  },

  // 可信数据目录上报系统
  {
    path: '/catalog-upload',
    name: 'CatalogUpload',
    component: 'LAYOUT',
    meta: { title: '可信数据目录上报系统', icon: 'UploadOutlined' },
    children: [
      { path: 'create-fill', name: 'catalog_create_fill', component: '/catalog-upload/create-fill', meta: { title: '数据目录创建与填报' } },
      { path: 'sync-update', name: 'catalog_sync_update', component: '/catalog-upload/sync-update', meta: { title: '数据同步与更新' } },
      { path: 'tasks', name: 'catalog_tasks', component: '/catalog-upload/tasks', meta: { title: '填报任务管理' } },
      { path: 'feedback', name: 'catalog_feedback', component: '/catalog-upload/feedback', meta: { title: '上报审核反馈' } },
    ],
  },

  // 可信数据运营管理系统（并入服务内核能力）
  {
    path: '/ops',
    name: 'Ops',
    component: 'LAYOUT',
    meta: { title: '可信数据运营管理系统', icon: 'SettingOutlined' },
    children: [
      { path: 'approval', name: 'ops_approval', component: '/ops/approval', meta: { title: '数据申请审批与授权' } },
      { path: 'catalog-publish', name: 'ops_catalog_publish', component: '/ops/catalog-publish', meta: { title: '数据目录治理与发布' } },
      { path: 'audit-log', name: 'ops_audit_log', component: '/ops/audit-log', meta: { title: '使用行为与日志审计' } },
      { path: 'usage-analysis', name: 'ops_usage_analysis', component: '/ops/usage-analysis', meta: { title: '数据使用分析' } },

      // 从“服务内核”引入的可运营子模块
      { path: 'workflow-templates', name: 'ops_workflow_templates', component: '/ops/workflow-templates', meta: { title: '审批流程模板' } },
      { path: 'notify-templates', name: 'ops_notify_templates', component: '/ops/notify-templates', meta: { title: '通知模板管理' } },
      { path: 'dictionary', name: 'ops_dictionary', component: '/ops/dictionary', meta: { title: '数据字典与枚举' } },
      { path: 'policy-browser', name: 'ops_policy_browser', component: '/ops/policy-browser', meta: { title: '权限策略（只读）' } },

      // 仅平台管理员 & 非生产环境可见
      { 
        path: 'security-rotation', 
        name: 'ops_security_rotation', 
        component: '/ops/security-rotation', 
        meta: { title: '密钥轮换向导', roles: ['platform-admin'], hiddenInProd: true } 
      }
    ],
  },
];

export default defineMock({
  '/api/menus': () => resultSuccess(menusList),
});