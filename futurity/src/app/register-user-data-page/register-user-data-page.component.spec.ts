import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RegisterUserDataPageComponent} from "./register-user-data-page.component";
import {By} from "@angular/platform-browser";
import {sharedPasswordTest} from "../shared/tests/password-test";
import {AvatarService} from "../shared/services/avatar.service";
import {EmailService} from "../shared/services/email.service";
import createSpy = jasmine.createSpy;

interface FormTest {
  uploadFileInput: any;
  nicknameInput: any;
  passwordInput: any;
  confirmPasswordInput: any;
  nicknameForm: AbstractControl;
  passwordForm: AbstractControl;
  confirmPasswordForm: AbstractControl;
  checkbox: any;
}

describe("RegisterUserDataPageComponent", () => {
  let component: RegisterUserDataPageComponent;
  let fixture: ComponentFixture<RegisterUserDataPageComponent>;
  let formTest: FormTest;
  let avatarService: AvatarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), ReactiveFormsModule, FormsModule],
      declarations: [RegisterUserDataPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.overrideComponent(RegisterUserDataPageComponent, {
      set: {
        providers: []
      }
    }).createComponent(RegisterUserDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let inputs = fixture.debugElement.nativeElement.querySelector("form").querySelectorAll("input");
    formTest = {
      uploadFileInput: inputs[0],
      nicknameInput: inputs[1],
      passwordInput: inputs[2],
      confirmPasswordInput: inputs[3],
      checkbox: inputs[4],
      nicknameForm: component.registerForm.get("nickname"),
      passwordForm: component.registerForm.get("password"),
      confirmPasswordForm: component.registerForm.get("confirmPassword")
    };
    avatarService = TestBed.inject(AvatarService);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should count elements in the register form group", () => {
    const countInputs = fixture.debugElement.nativeElement.querySelector("form").querySelectorAll("input");

    expect(countInputs.length).toEqual(5); // 1 upload button, 3 inputs and 1 checkbox
  });

  it("should be empty since the initial value", () => {
    const form = component.registerForm;
    const inputForm = {
      nickname: "",
      password: "",
      confirmPassword: ""
    };

    expect(form.value).toEqual(inputForm);
  });

  sharedPasswordTest(() => {
    return {
      component: component,
      fixture: fixture,
      formTest: {
        passwordInput: formTest.passwordInput,
        passwordForm: formTest.passwordForm
      }
    };
  })

  it("should be unchecked the checkbox and hiding the password field", () => {
    expect(formTest.checkbox.checked).toBeFalsy();
    expect(formTest.passwordInput.type).toEqual("password");
  });

  it("should be empty and has errors (before entering)", () => {
    expect(formTest.nicknameInput.value).toEqual(formTest.nicknameInput.value);
    expect(formTest.passwordInput.value).toEqual(formTest.passwordForm.value);
    expect(formTest.confirmPasswordInput.value).toEqual(formTest.confirmPasswordForm.value);

    expect(formTest.nicknameForm.errors).toBeTruthy();
    expect(formTest.nicknameForm.errors.required).toBeTruthy();
    expect(formTest.nicknameForm.invalid).toBeTruthy();

    expect(formTest.passwordForm.errors).toBeTruthy();
    expect(formTest.passwordForm.errors.required).toBeTruthy();
    expect(formTest.passwordForm.invalid).toBeTruthy();

    expect(formTest.confirmPasswordForm.errors).toBeTruthy();
    expect(formTest.confirmPasswordForm.errors.required).toBeTruthy();
    expect(formTest.confirmPasswordForm.invalid).toBeTruthy();
  });

  it("should be valid and has no errors for nickname (after entering)", () => {
    formTest.nicknameInput.value = "alex";
    formTest.nicknameInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.nicknameInput.value).toEqual(formTest.nicknameInput.value);
    expect(formTest.nicknameForm.errors).toBeFalsy();
    expect(formTest.nicknameForm.valid).toBeTruthy();
  });

  it("should be invalid and has errors for email (after entering)", () => {
    formTest.nicknameInput.value = "a"; // less than 4 chars
    formTest.nicknameInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.nicknameInput.value).toEqual(formTest.nicknameInput.value);
    expect(formTest.nicknameForm.errors).toBeTruthy();
    expect(formTest.nicknameForm.valid).toBeFalsy();
  });

  it("should be valid and has no errors for confirm password (after entering)", () => {
    const password = "password";
    formTest.passwordInput.value = password;
    formTest.confirmPasswordInput.value = password;
    formTest.confirmPasswordInput.dispatchEvent(new Event("input"));
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.confirmPasswordInput.value).toEqual(formTest.confirmPasswordInput.value);
    expect(formTest.passwordInput.value).toEqual(formTest.passwordForm.value);
    expect(formTest.passwordInput.value).toEqual(formTest.confirmPasswordInput.value);

    expect(component.registerForm.errors?.notMatch).toBeFalsy();
  });

  it("should be invalid and has errors for confirm password (after entering)", () => {
    formTest.passwordInput.value = "password";
    formTest.confirmPasswordInput.value = "differentPassword";
    formTest.confirmPasswordInput.dispatchEvent(new Event("input"));
    formTest.passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(formTest.confirmPasswordInput.value).toEqual(formTest.confirmPasswordInput.value);
    expect(formTest.passwordInput.value).toEqual(formTest.passwordForm.value);
    expect(formTest.passwordInput.value).not.toEqual(formTest.confirmPasswordInput.value);

    expect(component.registerForm.errors?.notMatch).toBeTruthy();
  });

  it("should hide/show the passwords by using checkbox", () => {
    formTest.checkbox.click();
    fixture.detectChanges();

    expect(formTest.checkbox.checked).toBeTruthy();
    expect(formTest.passwordInput.type).toEqual("text");
    expect(formTest.confirmPasswordInput.type).toEqual("text");

    formTest.checkbox.click();
    fixture.detectChanges();

    expect(formTest.checkbox.checked).toBeFalsy();
    expect(formTest.passwordInput.type).toEqual("password");
    expect(formTest.confirmPasswordInput.type).toEqual("password");
  });

  it("should block the button before entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");

    expect(button.style["pointer-events"]).toEqual("none");
    expect(button.disabled).toBeTruthy();
  });

  it("should not block the button after valid entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");

    formTest.nicknameInput.value = "alex";
    formTest.passwordInput.value = "password";
    formTest.confirmPasswordInput.value = "password";

    formTest.nicknameInput.dispatchEvent(new Event("input"));
    formTest.passwordInput.dispatchEvent(new Event("input"));
    formTest.confirmPasswordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
    expect(button.style["pointer-events"]).toEqual("auto");
  });

  it("should not show the error of invalid password before entering", () => {
    const error = fixture.debugElement.query(By.css(".error-message"));

    expect(error).toBeFalsy();
  });

  it("should show the default avatar user", waitForAsync(() => {
    const avatar = fixture.debugElement.queryAll(By.css(".avatar"))[0].nativeElement;

    expect(avatar).toBeTruthy();
    expect(avatar.src).toContain("/assets/user.png");
  }));

  it("should call loadImage after change avatar", () => {
    spyOn(avatarService, "loadImage")
    component.onChangeAvatar({
      target: {files: []}
    });

    expect(avatarService.loadImage).toHaveBeenCalled();
  });

  it("should get different avatar", () => {
    const imageUrl = "assets/someAvatar.png";
    const avatar = fixture.debugElement.queryAll(By.css(".avatar"))[0].nativeElement;
    spyOn(avatarService, "getAvatar").and.returnValue(imageUrl);

    fixture.detectChanges();

    expect(avatar).toBeTruthy();
    expect(avatar.src).toContain(imageUrl);
  });
});
