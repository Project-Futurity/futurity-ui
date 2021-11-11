import {By} from "@angular/platform-browser";
import {ComponentFixture} from "@angular/core/testing";

export function sharedPasswordTest(initialize: () => any) {
  describe("testing password input form", () => {
    let component: any;
    let fixture: ComponentFixture<any>;
    let formTest: any;

    beforeEach(() => {
      const cp = initialize();

      component = cp.component;
      fixture = cp.fixture;
      formTest = cp.formTest;
    });

    it("should be valid and has no errors for password (after entering)", () => {
      formTest.passwordInput.value = "password";
      formTest.passwordInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(formTest.passwordInput.value).toEqual(formTest.passwordInput.value);
      expect(formTest.passwordForm.errors).toBeNull();
      expect(formTest.passwordForm.valid).toBeTruthy();
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

    it("should not show the errors before entering", () => {
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

    it("should block the button after invalid password entering", () => {
      const button = fixture.debugElement.nativeElement.querySelector("button");
      formTest.passwordInput.value = "12345"; // less than 6 chars

      formTest.passwordInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(button.disabled).toBeTruthy();
      expect(button.style["pointer-events"]).toEqual("none");
    });
  });
}
