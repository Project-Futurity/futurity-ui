import {Injectable} from '@angular/core';
import {FileReaderService} from "./file-reader.service";
import {FileMetaInfo} from "../interfaces/file-meta-info";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly ALLOWED_EXTENSIONS = ["jpeg", "png", "gif"];
  private readonly ALLOWED_SIZE = 5 * 1024 * 1024;
  private avatar: File = null;
  private avatarUrl: string;

  constructor(private fileReaderService: FileReaderService) {
  }

  loadImage(image: File): string | void {
    if (!this.isCorrectExtension(image.type)) {
      return "Wrong image type. Must be one of the following: .jpeg, .png, .gif";
    }

    if (!this.isCorrectFileSize(image.size)) {
      return "Avatar is too large. Max size 5MB";
    }

    this.fileReaderService.readFile(image).subscribe(file => this.setAvatar(file));
  }

  loadDefaultAvatar(url: string) {
    this.fileReaderService.loadFromUrl(url).subscribe(file => this.setAvatar(file));
  }

  getAvatarUrl() {
    return this.avatarUrl;
  }

  getAvatar(): File {
    return this.avatar;
  }

  private isCorrectExtension(type: string): boolean {
    const ex = type.split("/")[1];

    return this.ALLOWED_EXTENSIONS.includes(ex);
  }

  private isCorrectFileSize(size: number): boolean {
    return size < this.ALLOWED_SIZE;
  }

  private setAvatar(file: FileMetaInfo) {
    this.avatar = file.file;
    this.avatarUrl = file.url;
  }
}
