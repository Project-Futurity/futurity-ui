import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {FileMetaInfo} from "../interfaces/file-meta-info";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {
  constructor(private http: HttpClient) {}

  loadFromUrl(url: string): Observable<FileMetaInfo> {
    return this.http.get(url, {responseType: "blob"}).pipe(
      switchMap(file => this.readFile(file, url))
    );
  }

  public readFile(file: Blob, url?: string): Observable<FileMetaInfo> {
    const reader = new FileReader();
    const subject = new Subject<FileMetaInfo>();

    reader.onload = () => {
      const readUrl = reader.result as string;
      let readFile: File;

      if (file instanceof File) {
        readFile = file;
      } else if (url) {
        // if it is default avatar then it needs to be converted to File
        readFile = new File([file], url);
      }

      subject.next({
        file: readFile,
        url: readUrl
      });
      subject.complete();
    }

    reader.readAsDataURL(file);
    return subject.asObservable();
  }
}
