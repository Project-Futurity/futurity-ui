import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from "@angular/core/testing";

import {NotLoginedLayoutComponent} from "./not-logined-layout.component";
import {Location} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";
import {LoginPageComponent} from "../../../login-page/login-page.component";
import {RegisterEmailFormComponent} from "../../../register-email-page/register-email-form.component";

describe("NotLoginedLayoutComponent", () => {
  let component: NotLoginedLayoutComponent;
  let fixture: ComponentFixture<NotLoginedLayoutComponent>;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: "login", component: LoginPageComponent},
        {path: "singup", component: RegisterEmailFormComponent}
      ])],
      declarations: [NotLoginedLayoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLoginedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to the login page", waitForAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelectorAll("button")[1]; // login

    expect(button).toBeTruthy();
    expect(button.innerHTML).toEqual("Login");

    button.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/login");
    });
  }));

  it("should navigate to the register page", waitForAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelectorAll("button")[2]; // singup

    expect(button).toBeTruthy();
    expect(button.innerHTML).toEqual("Sing up");

    button.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual("/singup");
    });
  }));
});
