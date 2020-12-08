import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /**
   * URL to log in the user to the backend
   */
  dataUrl= 'http://127.0.0.1:8000/login/';

  /** 
   * URL to register the user in the backend
   */
  dataUrl2= 'http://127.0.0.1:8000/signup/';

  /**
   * URL to get user details from the backend
   */
  getUserUrl= 'http://127.0.0.1:8000/get_user/';

  /**
   * URL to log out the user from the backend
   */
  logoutUrl = 'http://127.0.0.1:8000/fileupload/logout/';

  /**
   * 
   * @param http Creates an HttpClient object for use
   */
  constructor(private http: HttpClient) {}
  
  /**
   * 
   * @param form The value of the form passed form onSubmit() in login.component.ts
   * @returns A JSON object with the JWT access token and user details
   * 
   * POSTS the data to the backend to authenticate the user and re
   */
  checkLogin(form: any): Observable<any> {
    return this.http.post<any>(this.dataUrl, form);
  }
  
  /**
   * 
   * @param form  POSTS the signup data to the backend
   * @returns A JSON object indiacating status of signup
   */
  signup(form: any): Observable<any> {
    return this.http.post<any>(this.dataUrl2, form);
  }

  /**
   * GETS the response from logout of the user
   * 
   * @returns A JSON object indicating status of user logout
   */
  logout(): Observable<any> {
	  return this.http.get<any>(this.logoutUrl);
  }

  /**
   * GETS the user details from backend
   * 
   * @returns A JSON object containing user details
   */
  getUser(){
    return this.http.get<any>(this.getUserUrl);
  }
 
}
