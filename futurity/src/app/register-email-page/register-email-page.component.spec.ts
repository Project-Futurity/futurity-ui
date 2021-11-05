import {ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {RegisterEmailPageComponent} from "./register-email-page.component";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginPageComponent} from "../login-page/login-page.component";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Location} from "@angular/common";
import {sharedEmailTest} from "../../tests/email-test";

describe("RegisterEmailPageComponent", () => {
  let component: RegisterEmailPageComponent;
  let fixture: ComponentFixture<RegisterEmailPageComponent>;
  let location: Location;
  let emailInput: any;
  let emailForm: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: "login", component: LoginPageComponent}
      ]), ReactiveFormsModule, FormsModule],
      declarations: [RegisterEmailPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
    emailInput = fixture.debugElement.nativeElement.querySelector("form").querySelector("input");
    emailForm = component.emailInputForm.get("email");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  sharedEmailTest(() => {
    return {
      fixture: fixture,
      component: component,
      emailInput: emailInput,
      emailForm: emailForm
    };
  });


});
