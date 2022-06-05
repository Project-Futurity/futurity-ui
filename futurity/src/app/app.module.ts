import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomePageComponent} from './home-page/home-page.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";
import {NotLoginedLayoutComponent} from './shared/layouts/not-logined-layout/not-logined-layout.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {RegisterEmailFormComponent} from './register-email-page/register-email-form.component';
import {RegisterUserDataFormComponent} from './register-user-data-page/register-user-data-form.component';
import {RegistrationPageComponent} from './registration-page/registration-page.component';
import {RegistrationFormDirective} from './shared/directives/registration-form.directive';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtModule} from "@auth0/angular-jwt";
import {LoginService} from "./shared/services/login.service";
import {RefreshTokenInterceptor} from "./shared/interceptors/refresh-token-interceptor";
import {LoginedLayoutComponent} from './shared/layouts/logined-layout/logined-layout.component';
import {ProjectsPageComponent} from './projects-page/projects-page.component';
import {CreationProjectFormComponent} from './creation-project-form/creation-project-form.component';
import {ContextMenuModule, ContextMenuService} from "ngx-contextmenu";
import {ContextMenuFixService} from "./shared/services/context-menu-fix.service";
import {AlertPopupComponent} from './alert-popup/alert-popup.component';
import {KanbanPageComponent} from './kanban-page/kanban-page.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DragScrollDirective} from "./shared/directives/drag-scroll.directive";
import {ConfigureTaskFormComponent} from './configure-task-form/configure-task-form.component';
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule} from "ng-pick-datetime";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxBootstrapIconsModule, power, check2Circle, checkLg} from "ngx-bootstrap-icons";
import {MOMENT_FORMAT} from "./shared/interfaces/time";
import {OwlMomentDateTimeModule} from "ng-pick-datetime-moment-ng9";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotLoginedLayoutComponent,
    LoginPageComponent,
    RegisterEmailFormComponent,
    RegisterUserDataFormComponent,
    RegistrationPageComponent,
    RegistrationFormDirective,
    LoginedLayoutComponent,
    ProjectsPageComponent,
    CreationProjectFormComponent,
    AlertPopupComponent,
    KanbanPageComponent,
    DragScrollDirective,
    ConfigureTaskFormComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    HttpClientModule,
    ContextMenuModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(LoginService.TOKEN_KEY),
        // here you can add allowed
      },
    }),
    DragDropModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    BrowserAnimationsModule,
    NgxBootstrapIconsModule.pick({power, check2Circle, checkLg})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true},
    {provide: ContextMenuService, useExisting: ContextMenuFixService},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MOMENT_FORMAT}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
