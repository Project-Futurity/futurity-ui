import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[registrationForm]'
})
export class RegistrationFormDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
