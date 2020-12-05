import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TreeService {

  upload_url = 'http://127.0.0.1:8000/fileupload/dirstr';
  constructor(private http:HttpClient) { }

  getRequest():any{
    return this.http.get<any>(this.upload_url);
    }

}
