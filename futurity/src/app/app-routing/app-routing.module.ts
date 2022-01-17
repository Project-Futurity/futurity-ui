import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "../home-page/home-page.component";
import {NgModule} from "@angular/core";
import {NotLoginedLayoutComponent} from "../shared/layouts/not-logined-layout/not-logined-layout.component";
import {LoginPageComponent} from "../login-page/login-page.component";
import {RegistrationPageComponent} from "../registration-page/registration-page.component";
import {LoginedLayoutComponent} from "../shared/layouts/logined-layout/logined-layout.component";
import {ProjectsPageComponent} from "../projects-page/projects-page.component";
import {LoginGuard} from "../shared/guards/login.guard";


const routes: Routes = [
  {
    path: "", component: NotLoginedLayoutComponent, children: [
      {path: "", component: HomePageComponent},
      {path: "login", component: LoginPageComponent},
      {path: "singup", component: RegistrationPageComponent},
    ]
  },
  {
    path: "projects", component: LoginedLayoutComponent, canActivate: [LoginGuard], children: [
      {path: "", component: ProjectsPageComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
