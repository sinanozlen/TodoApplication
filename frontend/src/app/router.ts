import { Routes } from "@angular/router";
import { AuthGuard } from "./components/auth/components/guard/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./components/auth/components/login/login.component").then(c => c.LoginComponent)
  },
  {
    path: "register",
    loadComponent: () =>
      import("./components/auth/components/register/register.component").then(c => c.RegisterComponent)
  },
  {
    path: "",
    canActivate: [AuthGuard],  // Sadece giriş yapmış kullanıcılar erişebilir
    loadComponent: () =>
      import("./layouts/layouts.component").then(c => c.LayoutsComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./home/home.component").then(c => c.HomeComponent)
      },
      {
        path: "todo",
        loadComponent: () =>
          import("../../../frontend/src/app/components/auth/components/todo/todo.component").then(c => c.TodoComponent)
      },
      {
        path: "taskdetail",
        loadComponent: () =>
          import("../../../frontend/src/app/components/auth/components/taskdetail/taskdetail.component").then(c => c.TaskDetailComponent)
      }
    ]
  }
];
