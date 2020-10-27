import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  dataUrl= '/login/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  constructor(private http: HttpClient) { 
   
    
  }
  
  addpost(items: any): Observable<any> {
    //console.log("gygjhyvlhjvlhcyutkgjc");
    return this.http.post<any>(this.dataUrl, items, this.httpOptions);
  }
  

  
 
}
