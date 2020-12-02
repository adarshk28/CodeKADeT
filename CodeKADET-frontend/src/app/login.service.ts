import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  dataUrl= 'http://127.0.0.1:8000/login/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  constructor(private http: HttpClient) { 
   
    
  }
  
  checkLogin(form: any): Observable<any> {
    return this.http.post<any>(this.dataUrl, form, this.httpOptions);
  }
  

  
 
}
