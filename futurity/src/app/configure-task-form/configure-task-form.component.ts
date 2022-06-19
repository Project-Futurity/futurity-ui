import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {DateValidator} from "../shared/validators/date-validator";
import * as moment from "moment";
import {DATE_FORMAT} from "../shared/interfaces/time";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-configure-task-form',
  templateUrl: './configure-task-form.component.html',
  styleUrls: ['./configure-task-form.component.css']
})
export class ConfigureTaskFormComponent implements OnInit, AfterViewInit {
  disableDeadLine = false;
  deadlineForm: FormGroup;

  @ViewChild("date_picker") datePicker: ElementRef;

  startDate: string;

  constructor(public activeModal: NgbActiveModal, @Inject(DOCUMENT) private document: Document) {
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

  ngAfterViewInit() {
    if (this.startDate) {
      this.datePicker.nativeElement.value = this.startDate;
    }
    const content = this.document.querySelector(".modal-content") as any;

    content.style.borderRadius = "35px";
    content.style.background = "rgb(70, 70, 70)";
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

  setTimeToPicker(time: string) {
    this.startDate = moment(time).format(DATE_FORMAT);
  }
}
