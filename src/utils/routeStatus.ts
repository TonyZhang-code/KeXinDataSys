/**
 * 路由状态检查工具
 * 可以在浏览器控制台中直接使用来排查路由问题
 */

import { routerDebugger } from './routerDebug';

// 全局路由状态检查函数
export function checkRouteStatus() {
  console.group('🔍 路由状态检查');
  
  const debugInfo = routerDebugger.getRouteDebugInfo();
  if (debugInfo) {
    console.log('当前路由信息:', debugInfo.currentRoute);
    console.log('当前路径:', debugInfo.currentPath);
    console.log('当前名称:', debugInfo.currentName);
    console.log('总路由数量:', debugInfo.routeCount);
    console.log('所有路由:', debugInfo.allRoutes);
  } else {
    console.warn('路由调试器未初始化');
  }
  
  // 检查本地存储
  console.log('本地存储检查:');
  console.log('- ACCESS_TOKEN:', localStorage.getItem('ACCESS_TOKEN'));
  console.log('- CURRENT_USER:', localStorage.getItem('CURRENT_USER'));
  
  // 检查全局配置
  if (window.__PRODUCTION__ADMINPRO__CONF__) {
    console.log('生产环境配置:', window.__PRODUCTION__ADMINPRO__CONF__);
  } else {
    console.warn('未找到生产环境配置');
  }
  
  console.groupEnd();
}

// 检查特定路径是否存在
export function checkRoute(path: string) {
  console.log(`🔍 检查路由: ${path}`);
  const exists = routerDebugger.checkRouteExists(path);
  return exists;
}

// 检查所有可用路由
export function listAllRoutes() {
  const debugInfo = routerDebugger.getRouteDebugInfo();
  if (debugInfo) {
    console.table(debugInfo.allRoutes.map(route => ({
      path: route.path,
      name: route.name,
      component: route.component?.name || 'Dynamic',
      meta: route.meta
    })));
  }
}

// 检查动态路由状态
export function checkDynamicRouteStatus() {
  console.group('🔄 动态路由状态');
  
  // 这里需要访问 store，暂时用 console 提示
  console.log('请在控制台执行以下命令检查动态路由状态:');
  console.log('1. 检查路由数量: listAllRoutes()');
  console.log('2. 检查路由状态: checkRouteStatus()');
  console.log('3. 检查特定路由: checkRoute("/portal/myapply")');
  
  console.groupEnd();
}

// 模拟路由跳转测试
export function testRouteNavigation(path: string) {
  console.log(`🧪 测试路由跳转: ${path}`);
  
  // 检查路由是否存在
  const exists = checkRoute(path);
  if (!exists) {
    console.error(`❌ 路由 ${path} 不存在`);
    return false;
  }
  
  console.log(`✅ 路由 ${path} 存在，可以正常跳转`);
  return true;
}

// 检查 Mock 数据状态
export function checkMockStatus() {
  console.group('🎭 Mock 数据状态检查');
  
  // 检查环境变量
  if (window.__PRODUCTION__ADMINPRO__CONF__) {
    const config = window.__PRODUCTION__ADMINPRO__CONF__;
    console.log('VITE_USE_MOCK:', config.VITE_USE_MOCK);
    console.log('VITE_LOGGER_MOCK:', config.VITE_LOGGER_MOCK);
  }
  
  // 检查网络请求
  console.log('网络请求检查:');
  console.log('- 检查 /api/login 是否返回 Mock 数据');
  console.log('- 检查 /api/admin_info 是否返回 Mock 数据');
  console.log('- 检查 /api/menus 是否返回 Mock 数据');
  
  console.groupEnd();
}

// 将工具函数挂载到全局，方便在控制台使用
if (typeof window !== 'undefined') {
  (window as any).routeUtils = {
    checkRouteStatus,
    checkRoute,
    listAllRoutes,
    checkDynamicRouteStatus,
    testRouteNavigation,
    checkMockStatus
  };
  
  console.log('🚀 路由调试工具已加载，可以使用以下命令:');
  console.log('- routeUtils.checkRouteStatus() - 检查路由状态');
  console.log('- routeUtils.checkRoute("/path") - 检查特定路由');
  console.log('- routeUtils.listAllRoutes() - 列出所有路由');
  console.log('- routeUtils.checkMockStatus() - 检查 Mock 状态');
}
