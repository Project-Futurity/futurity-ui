import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {DateValidator} from "../shared/validators/date-validator";

@Component({
  selector: 'app-configure-task-form',
  templateUrl: './configure-task-form.component.html',
  styleUrls: ['./configure-task-form.component.css']
})
export class ConfigureTaskFormComponent implements OnInit {
  disableDeadLine = false;
  deadlineForm: FormGroup;

  @ViewChild("date_picker") datePicker: ElementRef;

  constructor(public activeModal: NgbActiveModal) {
  }

  toggleDeadLine() {
    this.disableDeadLine = !this.disableDeadLine;
    this.datePicker.nativeElement.disabled = this.disableDeadLine;
  }

  ngOnInit() {
    this.deadlineForm = new FormGroup({
      deadline: new FormControl({value: "", disabled: this.disableDeadLine},
        [DateValidator.isValidDate])
    });
  }

  onSubmit() {
    let deadline = this.deadlineForm.get("deadline").value;
    if (this.disableDeadLine || deadline == "") {
      deadline = null;
    }

    this.activeModal.close(deadline);
  }

  currentTime() {
    return new Date();
  }
}
