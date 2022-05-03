import * as moment from "moment/moment";
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export class DateValidator {
  static isValidDate(): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateToCheck = moment(control.value);
      return dateToCheck.isValid() ? null : {invalid: true}
    }
  }
}
