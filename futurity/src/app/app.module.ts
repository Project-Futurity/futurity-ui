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
import { RegisterEmailPageComponent } from './register-email-page/register-email-page.component';
import { RegisterUserDataPageComponent } from './register-user-data-page/register-user-data-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotLoginedLayoutComponent,
    LoginPageComponent,
    RegisterEmailPageComponent,
    RegisterUserDataPageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
