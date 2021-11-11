import {TestBed} from "@angular/core/testing";

import {EmailService} from "../email.service";

describe("EmailService", () => {
  let service: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("initial values should be empty", () => {
    expect(service.getEmail()).toEqual("");
  });

  it("should set value", () => {
    const email = "alex@jpeg.com";
    service.setEmail(email);

    expect(service.hasEmail()).toBeTruthy();
    expect(service.getEmail()).toEqual(email);
  });

  it("should drop value after getting", () => {
    const email = "alex@jpeg.com";
    service.setEmail(email);

    expect(service.getEmail()).toEqual(email);
    expect(service.getEmail()).toEqual("");
    expect(service.hasEmail()).toBeFalsy();
  });
});
