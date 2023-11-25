import {
  Component,
  ComponentFactoryResolver,
  ComponentRef, OnInit,
  Type,
  ViewChild
} from '@angular/core';
import {RegistrationFormDirective} from "../shared/directives/registration-form.directive";
import {RegisterEmailFormComponent} from "../register-email-page/register-email-form.component";
import {RegisterUserDataFormComponent} from "../register-user-data-page/register-user-data-form.component";

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {
  @ViewChild(RegistrationFormDirective, {static: true}) form: RegistrationFormDirective;

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    const instance = this.loadComponent(RegisterEmailFormComponent).instance as RegisterEmailFormComponent;

    instance.closeEvent.subscribe(email => {
      const component = this.loadComponent(RegisterUserDataFormComponent).instance as RegisterUserDataFormComponent;
      component.email = email;
    });
  }

  private loadComponent(component: Type<unknown>): ComponentRef<unknown> {
    const viewContainerRef = this.form.viewContainerRef;
    const factory = this.resolver.resolveComponentFactory(component);
    viewContainerRef.clear();
    return viewContainerRef.createComponent(factory);
  }
}
