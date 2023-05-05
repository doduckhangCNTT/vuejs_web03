import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/employee",
      name: "EmployeeHome",
      component: () => import("../views/employee/EmployeeHome.vue"),
      children: [
        {
          path: ":id",
          components: {
            EmployeeRouterView: () =>
              import("../views/employee/EmployeeForm.vue"),
          },
          name: "EmployeeEditRouter",
        },
        {
          path: "create",
          components: {
            EmployeeRouterView: () =>
              import("../views/employee/EmployeeForm.vue"),
          },
          name: "EmployeeCreateRouter",
        },
      ],
      sensitive: true,
    },
    {
      path: "/customer",
      name: "CustomerHome",
      component: () => import("../views/customer/CustomerHome.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../layouts/NotFound.vue"),
    },
  ],
});

export default router;
