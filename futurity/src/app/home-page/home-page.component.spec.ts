import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";

import {HomePageComponent} from "./home-page.component";
import {RouterTestingModule} from "@angular/router/testing";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Location} from "@angular/common";
import {RegisterEmailPageComponent} from "../register-email-page/register-email-page.component";
import {sharedEmailTest} from "../../tests/email-test";

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
