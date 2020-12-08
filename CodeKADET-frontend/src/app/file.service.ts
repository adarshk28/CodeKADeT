import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  /**
   * URL to create file uploaded from computer in the backend
   */
  upload_url = 'http://127.0.0.1:8000/fileupload/';

  /**
   * URL to create an empty file in the backend
   */
  empty_url = 'http://127.0.0.1:8000/emptyfileupload/';

  /**
   * URL to run the code in the editor
   */
  runtextbox_url = 'http://127.0.0.1:8000/fileupload/exec_from_textbox';

  /**
   * URL to save the file edited in the editor
   */
  edit_url = 'http://127.0.0.1:8000/fileupload/edit_file_from_textbox/';

  /**
   * URL to rename the required file in the backend
   */
  rename_url = 'http://127.0.0.1:8000/fileupload/rename/';

  /**
   * URL to delete the required file from the backend
   */
  delete_url = 'http://127.0.0.1:8000/fileupload/delete/';

  /**
   * URL to create a new folder in the backend
   */
  folder_upload_url = 'http://127.0.0.1:8000/fileupload/folder/';

  /**
   * 
   * @param http Creates an HttpClient object for use
   */
  constructor(private http:HttpClient) { }

  /**
   * 
   * @param form Contains the value of the FileForm from workspace.component.ts
   * @returns JSON object indicating status of file creation
   * 
   * Creates the file uploaded from computer in the backend
   */
  postFile(form: any): Observable<any> {
	  return this.http.post(this.upload_url, form);
  }

  /**
   * 
   * @param form Contains the value of the FileForm from workspace.component.ts
   * @returns JSON object indicating status of file creation
   * 
   * Creates an empty file in the backend with the needed name
   */
  uploadFromTextBox(form: any): Observable<any> {
	  return this.http.post(this.empty_url, form);
  }

  /**
   * 
   * @param name The name of the chosen file 
   * @param path The path of the chosen file
   * @returns A JSON object containing file content and details 
   * 
   * GETS file details from backend
   */
  getFile(name: any,path: any):any{
    return this.http.get<any>('http://127.0.0.1:8000/fileupload/file_view/',{params: {"name":  name,"path": path }})
  }

  /**
   * 
   * @param form Value of the form obtained from onSave() in workspace.component.ts
   * @returns JSON object indicating status of edit
   * 
   * Edits the file in the backend to reflect changes in the editor for the required file
   */
  editFromTextBox(form: any): Observable<any> {
	 return this.http.post(this.edit_url, form);
  }

  /**
   * 
   * @param form Value of the form obtained from run() in workspace.component.ts
   * @returns JSON object containing output of the execution, and errors if there are any
   * 
   * Runs the file currently in the editor and gives back the output obtained from running it in the backend
   */
  runFromTextbox(form: any){
    return this.http.post(this.runtextbox_url, form);
  }

  /**
   * 
   * @param form Value of the form obtained from file_rename() in try.component.ts
   * @returns JSON object indicating status of renaming operation
   * 
   * Renames the file in the backend 
   */
  renameFile(form: any){
    return this.http.post(this.rename_url,form);
  }

  /**
   * 
   * @param form Value of the form obtained from file_delete() in try.component.ts
   * @returns JSON object indicating status of delete operation
   * 
   * Deletes the selected file from backend
   */
  deleteFile(form: any){
    return this.http.post(this.delete_url,form);
  }

  /**
   * 
   * @param full_path The  complete relative path  of the folder to be created
   * @returns JSON object indicating status of folder addition operation
   * 
   * Adds the named folder to the backend if it doesn't exist already
   */
  addFolder(full_path: string){
    return this.http.post(this.folder_upload_url,full_path);
  }
}
