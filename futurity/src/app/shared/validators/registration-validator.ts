import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class RegistrationValidator {
  static mustMatch(matchTo: string): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {

      return !!control.parent && !!control.parent.value
      && control.value === (control.parent?.controls as any)[matchTo].value
        ? null : { notMatch: true };
    };
  }
}
