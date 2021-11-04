import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";

import {HomePageComponent} from "./home-page.component";
import {RouterTestingModule} from "@angular/router/testing";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Location} from "@angular/common";
import {RegisterEmailPageComponent} from "../register-email-page/register-email-page.component";

describe("HomePageComponent", () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let location: Location;
  let emailInput: any;
  let emailForm: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: "singup", component: RegisterEmailPageComponent}
      ]), ReactiveFormsModule, FormsModule],
      declarations: [HomePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
    emailInput = fixture.debugElement.nativeElement.querySelector("form").querySelector("input");
    emailForm = component.emailInputForm.get("email");;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should count elements in the email form group", () => {
    const form = fixture.debugElement.nativeElement.querySelector("form");
    const countInputs = form.querySelectorAll("input");

    expect(countInputs.length).toEqual(1);
  });

  it("should be empty since the initial value", () => {
    const form = component.emailInputForm;
    const email = {email: ""};

    expect(form.value).toEqual(email);
  });

  it("should be empty and has errors (before entering)", () => {
    expect(emailForm.value).toEqual(emailInput.value);
    expect(emailForm.errors).not.toBeNull(); // if it is required must be the error
    expect(emailForm.errors.required).toBeTruthy();
    expect(emailForm.invalid).toBeTruthy();
  });

  it("should be valid and has no errors (after entering)", () => {
    emailInput.value = "alex@jpeg.com";
    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(emailInput.value).toEqual(emailForm.value);
    expect(emailForm.errors).toBeNull();
    expect(emailForm.valid).toBeTruthy();
  });

  it("should be invalid and has errors (after entering)", () => {
    const invalidEmails = ["invalid email", "invalid@mail", "invalid.ru", "invalid@mail,ru"];

    for (let i = 0; i < invalidEmails.length; i++) {
      emailInput.value = invalidEmails[i];
      emailInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(emailInput.value).toEqual(emailForm.value);
      expect(emailForm.errors).not.toBeNull();
      expect(emailForm.errors['pattern']).not.toBeNull();
      expect(emailForm.errors['required']).toBeFalsy();
    }
  });

  it("should block the button before entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");

    expect(button.style["pointer-events"]).toEqual("none");
    expect(button.disabled).toBeTruthy();
  });

  it("should not block the button after valid entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");
    emailInput.value = "alex@jpeg.com";
    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
    expect(button.style["pointer-events"]).toEqual("auto");
  });

  it("should block the button after invalid entering", () => {
    const invalidEmails = ["invalid email", "invalid@mail", "invalid.ru", "invalid@mail,ru"];
    const button = fixture.debugElement.nativeElement.querySelector("button");

    for (let i = 0; i < invalidEmails.length; i++) {
      emailInput.value = invalidEmails[i];
      emailInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();


      expect(button.disabled).toBeTruthy();
      expect(button.style["pointer-events"]).toEqual("none");
    }
  });

  it("should navigate to the register page", waitForAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector("button");
    emailInput.value = "alex@jpeg.com";
    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    button.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual("/singup");
    });
  }));
});
