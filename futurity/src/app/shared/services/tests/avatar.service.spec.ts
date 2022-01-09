import {AvatarService} from "../avatar.service";
import {TestBed, waitForAsync} from "@angular/core/testing";

describe("AvatarService", () => {
  let service: AvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("initial values should be empty and has default image", () => {
    expect(service["avatar"]).toBeFalsy();
    expect(service["avatarUrl"]).toBeFalsy();
  });

  it("should load image", waitForAsync(() => {
    const mockImageName = "image";
    const mockImage = new File([''], mockImageName, {type: "images/png"});

    service.loadImage(mockImage);
  }));

  it("should be valid types", waitForAsync(() => {
    const jpeg = new File([''], "image", {type: "images/jpeg"});
    const png = new File([''], "image", {type: "images/png"});
    const gif = new File([''], "image", {type: "images/gif"});
    const images = [jpeg, png, gif];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      service["avatarUrl"] = null;
      service.loadImage(image)
    }
  }));

  it("should be invalid types", () => {
    const wrongTypes = ["*/*", "pdf", "images/gmp"];

    for (let i = 0; i < wrongTypes.length; i++) {
      expect(service["isCorrectExtension"](wrongTypes[i])).toBeFalsy();
    }
  });

  it("should return from function", () => {
    const wrongFile = new File([''], "image", {type: "wrongType"});
    const callback = jasmine.createSpy().and.callFake(() => {});

    service.loadImage(wrongFile)

    expect(callback).not.toHaveBeenCalled();
  });
});
