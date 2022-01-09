import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly DEFAULT_IMAGE_NAME = "user.png";
  private readonly DEFAULT_IMAGE_URL = "/assets/" + this.DEFAULT_IMAGE_NAME;
  private readonly ALLOWED_EXTENSIONS = ["jpeg", "png", "gif"];
  private readonly ALLOWED_SIZE = 5 * 1024 * 1024;
  private avatar: File = null;
  private avatarUrl: string;

  constructor(private http: HttpClient) {
  }

  loadImage(image: File): string | void {
    if (!this.isCorrectExtension(image.type)) {
      return "Wrong image type. Must be one of the following: .jpeg, .png, .gif";
    }

    if (!this.isCorrectFileSize(image.size)) {
      return "Avatar is too large. Max size 5MB";
    }

    this.readImage(image);
  }

  loadDefaultAvatar() {
    this.http.get(this.DEFAULT_IMAGE_URL, {responseType: "blob"})
      .subscribe((image) => {
        this.readImage(image);
      });
  }

  getAvatarUrl() {
    return this.avatarUrl;
  }

  getAvatar(): File {
    return this.avatar;
  }

  private readImage(image: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.avatarUrl = reader.result as string;

      if (image instanceof File) {
        this.avatar = image;
      } else {
        // if it is default avatar then it needs to be converted to File
        this.avatar = new File([image], this.DEFAULT_IMAGE_NAME);
      }
    };
  }

  private isCorrectExtension(type: string): boolean {
    const ex = type.split("/")[1];

    return this.ALLOWED_EXTENSIONS.includes(ex);
  }

  private isCorrectFileSize(size: number): boolean {
    return size < this.ALLOWED_SIZE;
  }
}
