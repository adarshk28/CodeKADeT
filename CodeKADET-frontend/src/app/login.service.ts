import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  dataUrl= 'http://127.0.0.1:8000/login/';
  dataUrl2= 'http://127.0.0.1:8000/signup/';
  getUserUrl= 'http://127.0.0.1:8000/get_user/';
  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  // };
  logoutUrl = 'http://127.0.0.1:8000/fileupload/logout/';

  constructor(private http: HttpClient) {}
  
  
  checkLogin(form: any): Observable<any> {
    // return this.http.post<any>(this.dataUrl, form, this.httpOptions);
    console.log('Inside service for checking login')
    console.log("Url is " + this.dataUrl)
    return this.http.post<any>(this.dataUrl, form);
  }
  
  signup(form: any): Observable<any> {
    // return this.http.post<any>(this.dataUrl2, form, this.httpOptions);
    return this.http.post<any>(this.dataUrl2, form);
  }
  logout(): Observable<any> {
	  console.log("Inside service for logging out");
	  return this.http.get<any>(this.logoutUrl);
  }

  getUser(){
    return this.http.get<any>(this.getUserUrl);
  }
 
}
