import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fileclass } from './file/fileclass';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  upload_url = 'http://127.0.0.1:8000/fileupload/';
  constructor(private http:HttpClient) { }


  newfile: Fileclass[];

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
  postFile(form: any): Observable<any> {
	  console.log("At file sending location");
	  return this.http.post(this.upload_url, form);
  }


  getRequest():any{
    return this.http.get<any>('http://127.0.0.1:8000/fileupload').subscribe(data => {
      console.log(data.json())
    });
}

}
