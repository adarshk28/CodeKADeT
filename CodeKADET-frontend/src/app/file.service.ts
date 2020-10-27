import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

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
  getRequest():any{
    return this.http.get<any>('http://127.0.0.1:8000/fileupload').subscribe(data => {
      console.log(data.json())
    });
}

}
