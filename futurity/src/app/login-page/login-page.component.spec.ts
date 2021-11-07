import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {LoginPageComponent} from "./login-page.component";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {Location} from "@angular/common";
import {RegisterEmailPageComponent} from "../register-email-page/register-email-page.component";
import {RouterTestingModule} from "@angular/router/testing";

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
        {path: "singup", component: RegisterEmailPageComponent}
      ]), ReactiveFormsModule, FormsModule],
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

    expect(formTest.emailForm.errors).not.toBeNull();
    expect(formTest.emailForm.errors.required).toBeTruthy();
    expect(formTest.emailForm.invalid).toBeTruthy();

    expect(formTest.passwordForm.errors).not.toBeNull();
    expect(formTest.passwordForm.errors.required).toBeTruthy();
    expect(formTest.passwordForm.invalid).toBeTruthy();
  });

  it("should be valid and has no errors for email (after entering)", () => {
    formTest.emailInput.value = "alex@gmail.com";
    formTest.emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.emailInput.value).toEqual(formTest.emailForm.value);
    expect(formTest.emailForm.errors).toBeNull();
    expect(formTest.emailForm.valid).toBeTruthy();
  });

  it("should be valid and has no errors for password (after entering)", () => {
    formTest.passwordInput.value = "password";
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.passwordInput.value).toEqual(formTest.passwordInput.value);
    expect(formTest.passwordForm.errors).toBeNull();
    expect(formTest.passwordForm.valid).toBeTruthy();
  });

  it("should be invalid and has errors for email (after entering)", () => {
    const invalidEmails = ["invalid email", "invalid@mail", "invalid.ru", "invalid@mail,ru"];

    for (let i = 0; i < invalidEmails.length; i++) {
      formTest.emailInput.value = invalidEmails[i];
      formTest.emailInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(formTest.emailInput.value).toEqual(formTest.emailForm.value);
      expect(formTest.emailForm.errors).not.toBeNull();
      expect(formTest.emailForm.errors['pattern']).not.toBeNull();
      expect(formTest.emailForm.errors['required']).toBeFalsy();
    }
  });

  it("should be invalid and has errors for password (after entering)", () => {
    formTest.passwordInput.value = "12345"; // less than 6 chars
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.passwordInput.value).toEqual(formTest.passwordForm.value);
    expect(formTest.passwordForm.errors).not.toBeNull();
    expect(formTest.passwordForm.errors['requiredLength']).not.toBeNull();
    expect(formTest.passwordForm.errors['required']).toBeFalsy();
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

  it("should block the button before entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");

    expect(button.style["pointer-events"]).toEqual("none");
    expect(button.disabled).toBeTruthy();
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

  it("should not show the error of invalid password before entering", () => {
    const error = fixture.debugElement.query(By.css(".error-message"));

    expect(error).toBeNull();
  });

  it("should show the error of invalid password after entering", () => {
    formTest.passwordForm.markAllAsTouched();
    formTest.passwordInput.value = "1234";
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css(".error-message"));
    expect(error).not.toBeNull();
  });

  it("should not show the error of invalid password after rewrite the password", () => {
    // wrong input
    formTest.passwordForm.markAllAsTouched();
    formTest.passwordInput.value = "1234";
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css(".error-message"))).not.toBeNull();

    // correct wrong input
    formTest.passwordInput.value = "123456";
    formTest.passwordForm.markAllAsTouched();
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css(".error-message"))).toBeNull();
  });

  it("should block the button after invalid email entering", () => {
    const invalidEmails = ["invalid email", "invalid@mail", "invalid.ru", "invalid@mail,ru"];
    const button = fixture.debugElement.nativeElement.querySelector("button");
    formTest.passwordInput.value = "password"; // valid password
    formTest.passwordInput.dispatchEvent(new Event("input"));

    for (let i = 0; i < invalidEmails.length; i++) {
      formTest.emailInput.value = invalidEmails[i];
      formTest.emailInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();


      expect(button.disabled).toBeTruthy();
      expect(button.style["pointer-events"]).toEqual("none");
    }
  });

  it("should block the button after invalid password entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");
    formTest.passwordInput.value = "12345"; // less than 6 chars

    formTest.emailInput.value = "alex@jpeg.com";
    formTest.emailInput.dispatchEvent(new Event("input"));
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();
    expect(button.style["pointer-events"]).toEqual("none");
  });

  it("should navigate to the register page", waitForAsync(() => {
    const a = fixture.debugElement.nativeElement.querySelectorAll("a")[1];

    a.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual("/singup");
    });
  }));
});
