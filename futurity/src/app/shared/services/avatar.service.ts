import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly DEFAULT_IMAGE_URL = "/assets/user.png";
  private readonly ALLOWED_EXTENSIONS = ["jpeg", "png", "gif"];
  private avatar: File;
  private avatarUrl: string;

  constructor() { }

  loadImage(image: File, callback?:() => void): void {
    if (!this.isCorrectExtension(image.type)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.avatar = image;

      callback();
    };
  }

  getAvatar() {
    return this.avatarUrl == null ? this.DEFAULT_IMAGE_URL : this.avatarUrl;
  }

  private isCorrectExtension(type: string): boolean {
    const ex = type.split("/")[1];

    return this.ALLOWED_EXTENSIONS.includes(ex);
  }
}
