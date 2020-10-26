import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  // postFile(fileToUpload: File): Observable<boolean> {
  //   const endpoint = 'your-destination-url';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this.httpClient.post(endpoint, formData, {
  //     headers: yourHeadersConfig
  //   })
  //   .map(() => { return true; })
  //   .catch((e) => this.handleError(e));
  // }

}
