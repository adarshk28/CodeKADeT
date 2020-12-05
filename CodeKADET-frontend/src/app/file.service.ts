import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  upload_url = 'http://127.0.0.1:8000/fileupload/';
  empty_url = 'http://127.0.0.1:8000/emptyfileupload/';
  runtextbox_url = 'http://127.0.0.1:8000/fileupload/exec_from_textbox';
    edit_url = 'http://127.0.0.1:8000/fileupload/edit_file_from_textbox/';
  constructor(private http:HttpClient) { }

  postFile(form: any): Observable<any> {
	  console.log("At file sending location");
	  return this.http.post(this.upload_url, form);
  }


  getFile(name: any,path: any):any{
    // let heads = new HttpHeaders();
    // heads.append('Content-Type', 'application/json');
    // let param = new HttpParams();
    // param.set("name", form.get("name").value)
    // param.set("path", form.get("path").value)
    console.log('Service trying to get your file')
    return this.http.get<any>('http://127.0.0.1:8000/fileupload/file_view/',{params: {"name":  name,"path": path }})
  }

  uploadFromTextBox(form: any): Observable<any> {
	  console.log("At file uploading location");
	  return this.http.post(this.empty_url, form);
  }

    editFromTextBox(form: any): Observable<any> {
	  console.log("At file edit location");
	  return this.http.post(this.edit_url, form);
    }
    runFromTextbox(form: any){
      return this.http.post(this.runtextbox_url, form);
    }
}