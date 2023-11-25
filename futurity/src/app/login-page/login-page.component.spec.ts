import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {LoginPageComponent} from "./login-page.component";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Location} from "@angular/common";
import {RegisterEmailFormComponent} from "../register-email-page/register-email-form.component";
import {RouterTestingModule} from "@angular/router/testing";
import {sharedPasswordTest} from "../shared/tests/password-test";
import {sharedEmailTest} from "../shared/tests/email-test";
import {HttpClientModule} from "@angular/common/http";

interface FormTest {
  emailInput: any;
  passwordInput: any;
  emailForm: AbstractControl;
  passwordForm: AbstractControl;
  checkbox: any;
}

describe("LoginPageComponent", () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let formTest: FormTest;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: "singup", component: RegisterEmailFormComponent}
      ]), ReactiveFormsModule, FormsModule, HttpClientModule],
      declarations: [LoginPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
    let inputs = fixture.debugElement.nativeElement.querySelector("form").querySelectorAll("input");
    formTest = {
      emailInput: inputs[0],
      passwordInput: inputs[1],
      checkbox: inputs[2],

      emailForm: component.loginForm.get("email"),
      passwordForm: component.loginForm.get("password")
    };
  });

  sharedPasswordTest(() => {
    return {
      fixture: fixture,
      component: component,
      formTest: formTest
    }
  });

  sharedEmailTest(() => {
    return {
      fixture: fixture,
      component: component,
      emailInput: formTest.emailInput,
      emailForm: formTest.emailForm
    };
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should count elements in the login form group", () => {
    const countInputs = fixture.debugElement.nativeElement.querySelector("form").querySelectorAll("input");

    expect(countInputs.length).toEqual(3); // 2 inputs and checkbox
  });

  it("should be empty since the initial value", () => {
    const form = component.loginForm;
    const email = {
      email: "",
      password: ""
    };

    expect(form.value).toEqual(email);
  });

  it("should be unchecked the checkbox and hiding the password field", () => {
    expect(formTest.checkbox.checked).toBeFalsy();
    expect(formTest.passwordInput.type).toEqual("password");
  });

  it("should be empty and has errors (before entering)", () => {
    expect(formTest.emailInput.value).toEqual(formTest.emailForm.value);
    expect(formTest.passwordInput.value).toEqual(formTest.passwordForm.value);

    expect(formTest.emailForm.errors).toBeTruthy();
    expect(formTest.emailForm.errors.required).toBeTruthy();
    expect(formTest.emailForm.invalid).toBeTruthy();

    expect(formTest.passwordForm.errors).toBeTruthy();
    expect(formTest.passwordForm.errors.required).toBeTruthy();
    expect(formTest.passwordForm.invalid).toBeTruthy();
  });


  it("should hide/show the password by using checkbox", () => {
    formTest.checkbox.click();
    fixture.detectChanges();

    expect(formTest.checkbox.checked).toBeTruthy();
    expect(formTest.passwordInput.type).toEqual("text");

    formTest.checkbox.click();
    fixture.detectChanges();

    expect(formTest.checkbox.checked).toBeFalsy();
    expect(formTest.passwordInput.type).toEqual("password");
  });

  it("should not block the button after valid entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");

    formTest.emailInput.value = "alex@jpeg.com";
    formTest.passwordInput.value = "password";
    formTest.emailInput.dispatchEvent(new Event("input"));
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
    expect(button.style["pointer-events"]).toEqual("auto");
  });

  it("should navigate to the register page", waitForAsync(() => {
    const a = fixture.debugElement.nativeElement.querySelectorAll("a")[1];

    a.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual("/singup");
    });
  }));
});
