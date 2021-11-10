import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {RegisterEmailPageComponent} from "./register-email-page.component";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginPageComponent} from "../login-page/login-page.component";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Location} from "@angular/common";
import {sharedEmailTest} from "../shared/tests/email-test";
import {EmailService} from "../shared/services/email.service";

describe("RegisterEmailPageComponent", () => {
  let component: RegisterEmailPageComponent;
  let fixture: ComponentFixture<RegisterEmailPageComponent>;
  let location: Location;
  let emailInput: any;
  let emailForm: AbstractControl;
  let emailService: EmailService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: "login", component: LoginPageComponent},
        {path: "register", component: RegisterEmailPageComponent}
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
    emailService = TestBed.inject(EmailService);
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

  it("should count elements in the email form group", () => {
    const form = fixture.debugElement.nativeElement.querySelector("form");
    const countInputs = form.querySelectorAll("input");

    expect(countInputs.length).toEqual(1);
  });

  it("should not block the button after valid entering", () => {
    const button = fixture.debugElement.nativeElement.querySelector("button");
    emailInput.value = "alex@jpeg.com";
    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
    expect(button.style["pointer-events"]).toEqual("auto");
  });

  it("should be empty since the initial value", () => {
    const form = component.emailInputForm;
    const email = {email: ""};

    expect(form.value).toEqual(email);
  });

  it("should navigate to the login page", waitForAsync(() => {
    const a = fixture.debugElement.nativeElement.querySelectorAll("a")[1];

    a.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual("/login");
    });
  }));

  it("should be empty after getting empty value", () => {
    const emptyEmail = "";
    spyOn(emailService, "getEmail").and.returnValue(emptyEmail);

    component.ngOnInit();
    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(emailService.getEmail).toHaveBeenCalled();
    expect(component.emailInputForm.get("email").value).toEqual(emptyEmail);
    expect(fixture.debugElement.nativeElement.querySelector("form").querySelector("input").value).toEqual(emptyEmail);
  });

  it("should be value from previous page", () => {
    const email = "alex@jpeg.com";

    spyOn(emailService, "getEmail").and.returnValue(email);

    component.ngOnInit();

    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();


    expect(emailService.getEmail).toHaveBeenCalled();
    expect(component.emailInputForm.get("email").value).toEqual(email);
    expect(fixture.debugElement.nativeElement.querySelector("form").querySelector("input").value).toEqual(email);
  });

  it("should navigate to the register data user page", waitForAsync(() => {
    spyOn(emailService, "setEmail");
    const button = fixture.debugElement.nativeElement.querySelector("button");
    emailInput.value = "alex@jpeg.com";
    emailInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    button.click();
    fixture.whenStable().then(() => {
      expect(emailService.setEmail).toHaveBeenCalled();
      expect(location.path()).toEqual("/register");
    });
  }));
});
