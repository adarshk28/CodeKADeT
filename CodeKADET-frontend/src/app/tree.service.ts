import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TreeService {

  /**
   * URL to get the file tree structrure from backend 
   */
  tree_url = 'http://127.0.0.1:8000/fileupload/dirstr';
  
  /**
   * 
   * @param http Creates an HttpClient object to be used
   */
  constructor(private http:HttpClient) { }

  /**
   * Sends a GET request to obtain the file tree for the user as a nested JSON object from the backend
   * 
   * @returns The nested JSON object obtained from backend
   */
  getRequest():any{
    return this.http.get<any>(this.tree_url);
  }
}
