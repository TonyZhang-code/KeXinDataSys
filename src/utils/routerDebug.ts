/**
 * 路由调试工具
 * 用于排查路由相关的问题
 */

import { Router } from 'vue-router';

export class RouterDebugger {
  private static instance: RouterDebugger;
  private router: Router | null = null;
  private debugMode: boolean = false;

  static getInstance(): RouterDebugger {
    if (!RouterDebugger.instance) {
      RouterDebugger.instance = new RouterDebugger();
    }
    return RouterDebugger.instance;
  }

  setRouter(router: Router) {
    this.router = router;
  }

  enableDebug(enable: boolean = true) {
    this.debugMode = enable;
    if (enable) {
      console.log('🚀 Router debug mode enabled');
    }
  }

  logRouteInfo(to: any, from: any) {
    if (!this.debugMode) return;

    console.group('🔍 Route Navigation Info');
    console.log('From:', from.path);
    console.log('To:', to.path);
    console.log('To Name:', to.name);
    console.log('To Meta:', to.meta);
    console.log('Current Routes:', this.router?.getRoutes().map(r => ({ path: r.path, name: r.name })));
    console.groupEnd();
  }

  logDynamicRouteGeneration(userInfo: any, routes: any[]) {
    if (!this.debugMode) return;

    console.group('🔄 Dynamic Route Generation');
    console.log('User Info:', userInfo);
    console.log('Generated Routes:', routes);
    console.log('Routes Count:', routes.length);
    console.groupEnd();
  }

  logRouteAddition(route: any) {
    if (!this.debugMode) return;

    console.log('➕ Adding Route:', {
      path: route.path,
      name: route.name,
      component: route.component,
      meta: route.meta
    });
  }

  logRouteError(error: any, context: string) {
    if (!this.debugMode) return;

    console.error(`❌ Router Error in ${context}:`, error);
  }

  checkRouteExists(path: string): boolean {
    if (!this.router) return false;
    
    const route = this.router.resolve(path);
    const exists = route.matched.length > 0;
    
    if (this.debugMode) {
      console.log(`🔍 Route check for ${path}:`, exists ? '✅ EXISTS' : '❌ NOT FOUND');
      if (!exists) {
        console.log('Available routes:', this.router.getRoutes().map(r => r.path));
      }
    }
    
    return exists;
  }

  getRouteDebugInfo() {
    if (!this.router) return null;

    return {
      currentRoute: this.router.currentRoute.value,
      allRoutes: this.router.getRoutes(),
      routeCount: this.router.getRoutes().length,
      currentPath: this.router.currentRoute.value.path,
      currentName: this.router.currentRoute.value.name
    };
  }
}

// 导出单例实例
export const routerDebugger = RouterDebugger.getInstance();

// 在开发环境下自动启用调试
if (import.meta.env.DEV) {
  routerDebugger.enableDebug(true);
}
