import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  upload_url = 'http://127.0.0.1:8000/fileupload/';
  empty_url = 'http://127.0.0.1:8000/emptyfileupload/';
    edit_url = 'http://127.0.0.1:8000/fileupload/edit_file_from_textbox/';
  constructor(private http:HttpClient) { }

  postFile(form: any): Observable<any> {
	  console.log("At file sending location");
	  return this.http.post(this.upload_url, form);
  }


  getRequest():any{
    return this.http.get<any>('http://127.0.0.1:8000/fileupload').subscribe(data => {
      console.log(data.json())
    });
  }

  uploadFromTextBox(form: any): Observable<any> {
	  console.log("At file uploading location");
	  return this.http.post(this.empty_url, form);
  }

    editFromTextBox(form: any): Observable<any> {
	  console.log("At file edit location");
	  return this.http.post(this.edit_url, form);
    }

}