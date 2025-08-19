import { PageEnum } from '@/enums/pageEnum';
import { ErrorPageRoute } from '@/router/base';
import { useAsyncRoute } from '@/store/modules/asyncRoute';
import { useUser } from '@/store/modules/user';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { storage } from '@/utils/Storage';
import { routerDebugger } from '@/utils/routerDebug';
import type { RouteRecordRaw } from 'vue-router';
import { isNavigationFailure, Router } from 'vue-router';
import { RedirectName } from './constant';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList = [LOGIN_PATH]; // no redirect whitelist

export function createRouterGuards(router: Router) {
  const userStore = useUser();
  const asyncRouteStore = useAsyncRoute();
  
  // 设置路由调试器
  routerDebugger.setRouter(router);
  
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'] || null;
    Loading && Loading.start();
    
    // 记录路由信息
    routerDebugger.logRouteInfo(to, from);
    
    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
      next(PageEnum.BASE_HOME);
      return;
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    const token = storage.get(ACCESS_TOKEN);

    if (!token) {
      // You can access without permissions. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // 如果动态路由已经添加，检查目标路由是否存在
    if (asyncRouteStore.getIsDynamicRouteAdded) {
      // 检查目标路由是否已经存在
      const targetRoute = router.resolve(to.path);
      if (targetRoute.matched.length > 0) {
        next();
        return;
      } else {
        // 路由不存在，可能是动态路由丢失，重新生成
        console.warn('Route not found, regenerating dynamic routes...');
        routerDebugger.logRouteError(new Error(`Route not found: ${to.path}`), 'Route Check');
        asyncRouteStore.setDynamicRouteAdded(false);
      }
    }

    try {
      const userInfo = await userStore.getInfo();
      const routes = await asyncRouteStore.generateRoutes(userInfo);

      // 记录动态路由生成信息
      routerDebugger.logDynamicRouteGeneration(userInfo, routes);

      // 动态添加可访问路由表
      routes.forEach((item) => {
        routerDebugger.logRouteAddition(item);
        router.addRoute(item as unknown as RouteRecordRaw);
      });

      //添加404
      const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
      if (isErrorPage === -1) {
        router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
      }

      // 标记动态路由已添加
      asyncRouteStore.setDynamicRouteAdded(true);

      // 重要：重新导航到目标路由，确保新添加的路由生效
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      
      if (to.path === redirect) {
        // 如果目标路径相同，使用 replace 模式
        next({ ...to, replace: true });
      } else {
        // 否则跳转到重定向路径
        next({ path: redirect, replace: true });
      }
      
      Loading && Loading.finish();
    } catch (error) {
      console.error('Failed to generate routes:', error);
      routerDebugger.logRouteError(error, 'Route Generation');
      // 路由生成失败，重定向到登录页
      next({ path: LOGIN_PATH, replace: true });
      Loading && Loading.finish();
    }
  });

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title;
    if (isNavigationFailure(failure)) {
      console.error('Navigation failed:', failure);
      routerDebugger.logRouteError(failure, 'Navigation');
    }
    const asyncRouteStore = useAsyncRoute();
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = asyncRouteStore.keepAliveComponents;
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == RedirectName) {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
    const Loading = window['$loading'] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.error('Router error:', error);
    routerDebugger.logRouteError(error, 'Router Error');
  });
}
