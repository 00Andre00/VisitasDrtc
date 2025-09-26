// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import authService from '@/services/authService';
import RegisterVisitView from '@/views/RegisterVisitView.vue';
import ActiveVisitsView from '@/views/ActiveVisitsView.vue';
import HistoryPublicView from '@/views/HistoryPublicView.vue';
import VisitHistoryView from '@/views/VisitHistoryView.vue';
import LoginView from '@/views/LoginView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/registrar-visita'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true, requiresGuest: true }
  },
  {
    path: '/registrar-visita',
    name: 'RegisterVisit',
    component: RegisterVisitView,
    meta: { requiresAuth: true, roles: ['admin', 'recepcion'] }
  },
  {
    path: '/visitas-activas',
    name: 'ActiveVisits',
    component: ActiveVisitsView,
    meta: { requiresAuth: true, roles: ['admin', 'recepcion', 'seguridad'] }
  },
  {
    path: '/historial',
    name: 'VisitHistory',
    component: VisitHistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/historial-publico',
    name: 'HistoryPublic',
    component: HistoryPublicView,
    meta: { public: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guards de navegación - CORREGIDO
router.beforeEach(async (to, _, next) => { // ← _ en lugar de from
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Si la ruta es pública, permitir acceso
  if (to.meta.public) {
    return next();
  }

  // Si requiere ser invitado pero ya está autenticado
  if (to.meta.requiresGuest && isAuthenticated) {
    return next('/');
  }

  // Si requiere autenticación pero no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // Verificar token con el servidor si está autenticado
  if (isAuthenticated) {
    const tokenValid = await authService.verifyToken();
    if (!tokenValid) {
      return next('/login');
    }
  }

  // Si la ruta requiere roles específicos
  if (to.meta.roles && user) {
    const userRole = user.rol;
    const requiredRoles = to.meta.roles as string[];
    const hasRequiredRole = requiredRoles.includes(userRole);
    if (!hasRequiredRole) {
      alert('No tiene permisos para acceder a esta página');
      return next('/');
    }
  }

  next();
});

export default router;