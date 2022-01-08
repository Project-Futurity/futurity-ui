import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";
import { NotLoginedLayoutComponent } from './shared/layouts/not-logined-layout/not-logined-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterEmailFormComponent } from './register-email-page/register-email-form.component';
import { RegisterUserDataFormComponent } from './register-user-data-page/register-user-data-form.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { RegistrationFormDirective } from './shared/directives/registration-form.directive';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotLoginedLayoutComponent,
    LoginPageComponent,
    RegisterEmailFormComponent,
    RegisterUserDataFormComponent,
    RegistrationPageComponent,
    RegistrationFormDirective
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
