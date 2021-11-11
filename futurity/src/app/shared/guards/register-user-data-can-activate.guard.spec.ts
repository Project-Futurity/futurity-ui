import {TestBed} from "@angular/core/testing";

import {RegisterUserDataCanActivateGuard} from "./register-user-data-can-activate.guard";
import {EmailService} from "../services/email.service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {RegisterUserDataPageComponent} from "../../register-user-data-page/register-user-data-page.component";

describe("RegisterUserDataCanActivateGuard", () => {
  let guard: RegisterUserDataCanActivateGuard;
  let emailService: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: "singup", component: RegisterUserDataPageComponent}
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    guard = TestBed.inject(RegisterUserDataCanActivateGuard);
    emailService = TestBed.inject(EmailService);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should be true", () => {
    emailService.setEmail("alex@jpeg.com");
    expect(guard.canActivate(null, null)).toBeTruthy();
  });

  it("should be false", () => {
    expect(guard.canActivate(null, null)).toBeFalsy();
  });
});
