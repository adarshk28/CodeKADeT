import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from '../file.service';
import { LoginService } from '../login.service';
import {  Router } from '@angular/router';
import * as fileSaver from 'file-saver'

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})

export class WorkspaceComponent implements AfterViewInit {
  /**
  * Extracts the Ace editor component from the workspace     
  */
  @ViewChild('editor') editor;
  
  /**
  * Extracts the file tree component from the workspace     
  */
  @ViewChild('treecomp') treecomp;

  /**
   * Has 2-way binding with the text written in the editor
   */
  text: string | ArrayBuffer = '';

  /**
   * Contains the language in which the file is supposed to have been written 
   */
  mode: string = 'javascript';

  /** 
   * Refers to the file uploaded from the computer
   */
  fileToUpload: File = null;

  /**
   * Refers to the preceeding relative path of the folder in which the new folder is to be created
   */
  newFolder: string;

  /**
   * Refers to the name of the folder in which the new folder is to be created
   */
  newName: string;

  /** 
   * Refers to the currently logged in user
   */
  user: string;

  /**
   * Helps convert the language field needed to set the mode of the Ace editor to the formal name of the language to be set above the editor
   */
  formalName = {
	  'c_cpp': 'C/C++',
	  'python': 'Python',
	  'java': 'Java',
	  'javascript': 'Unsupported',
  };

  /**
   * Refers to the current color theme of the text editor
   */
  themes='monokai'

  /**
   * A form which stores the data needed to set the input and output when the code file is run
   */
  RunForm= new FormGroup({
    Filename: new FormControl(''),
    Language: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
    path: new FormControl('')
  });

  /**
   * Contains data about the newly-created file, be it an empty file or a file uploaded from computer
   */
  FileForm = new FormGroup({
    language: new FormControl(''),
    content: new FormControl(''),
    file_name: new FormControl(''),
    path: new FormControl(''),
  })

  /**
     * Contains the values which set the display of the editor and its secondary features when a particular file/folder is selected/created
     */
  DisplayForm = new FormGroup({
    name: new FormControl(''),
    path: new FormControl(''),
    content: new FormControl('')
  })

  /**
   * 
   * @param fileser A FileService object to allow interaction with file_upload in the backend 
   * @param logser A LoginService object to allow interaction with login in the backend
   * @param router A Router object to enable redirection to homepage on logout
   */
  constructor(private fileser:FileService, private logser: LoginService, private router: Router) { 
    this.logser.getUser().subscribe(result => {
      this.user = result["user"]
    });
  }

  /**
   * Sets up some of the editor features (like keybindings and basic autocompletion) when the workspace is initialized
   */
  ngAfterViewInit() {
    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });
    this.editor.getEditor().commands.addCommand({
      name: 'save',
      bindKey: {win: "Ctrl-S", mac: "Cmd-S"},
      exec: this.onSave
    })
  }

  /**
   * Changes the theme of the editor
   */
  changeTheme(){
    if(this.themes=='monokai')
    this.themes='clouds';
    else this.themes='monokai';
  }

  /**
   * The file creation modal is displayed if this variable is true, else it is not displayed
   */
  showmodal=false;

  /**
   * 
   * @param data A JSON object which contains the path and the name of the folder in which the new file is to be created obtained from the file tree component. Sets the path variable in FileForm
   */
  modalview(data: any){
    var path = data["path"] +'/'+ data["name"];
    this.FileForm.get("path").setValue(path);
    if(this.folderModal) this.folderModal=false
    this.showmodal=!this.showmodal;
  }

  /**
   * Determines whether the modal for folder creation is displayed or not
   */
  folderModal = false;

  /**
   * 
   * @param data A JSON object which contains the path and the name of the folder in which the new folder is to be created obtained from the file tree component. Sets the newFolder variable 
   */
  folderModalview(data: any){
    var path = data["path"] +'/'+ data["name"];
    this.newFolder = path;
    if(this.showmodal) this.showmodal=false
    this.folderModal = !this.folderModal;
  }

  /**
   * @param isInEmpty True if the file to be created is in the base directory of the user, else false
   * 
   *Sets the path variable in FileForm accordingly.
   */
  closeModal(isInEmpty: boolean){
	 if (isInEmpty) this.FileForm.get('path').setValue('.');
    this.showmodal = !this.showmodal;
  }

  /**
   * @param isInEmpty True if the folder to be created is in the base directory of the user, else false
   * 
   *Sets the newFolder variable accordingly.
   */
  closeFolderModal(isInEmpty: boolean){
	  if (isInEmpty) this.newFolder='.';
    this.folderModal = !this.folderModal;
  }

  /**
   * The empty file creation form is shown if showwhat is set to true, else the file upload form is shown
   */
  showwhat=true;

  /**
   * Sets showwhat to true, thus displaying the empty file creation form
   */
  empty(){
    this.showwhat=true;
  }

  /**
   * Sets showwhat to true, thus displaying the file upload form
   */
  comp(){
    this.showwhat=false;
  }

  /**
   * Sets the theme of the editor
   */
  theme(){
    this.themes='monokai'
  }

  /**
   *  Saves the file in the backend
   */
  onSave = () => {
	  this.DisplayForm.get('content').setValue(this.text);
    if (this.DisplayForm.get('path').value == '') this.DisplayForm.get('path').setValue('.');
	  this.fileser.editFromTextBox(this.DisplayForm.value).subscribe(result => this.treecomp.getTree());
  }

  /**
   * 
   * @param data The name and path of the file/folder clicked
   * 
   * Closes all the modals
   */
  closeModals(data: any){
    this.folderModal = false;
    this.showmodal = false;
  }

  /**
   * Logs out the user. The granted access token is deleted, and the user is redirected to the homepage
   */
  onLogout(): void {
    this.logser.logout().subscribe(
      _ => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/homepage/']);
      }
    );
  }

  /**
   * 
   * @param files The file list from the form for uploading file from computer
   * 
   * Sets the value of fileToUpload
   */
  setFile(files: FileList) {
      this.fileToUpload = files.item(0);
  }

  /**
   * Passes the file uploaded from the computer to the backend for storage. Also displays the uploaded file in the editor
   */
  handleFileInput() {
    if (this.treecomp.fileno == 10) {
      alert ('Maximum file limit of 10 files has already been reached!')
      return;
    }
    this.FileForm.get('content').setValue(this.fileToUpload);
    this.FileForm.get('language').setValue(this.FileForm.get('file_name').value.split('.').pop())
    const formData = new FormData();
    formData.append('path', this.FileForm.get('path').value)
    formData.append('file_name', this.FileForm.get('file_name').value)
    formData.append('language', this.FileForm.get('language').value)
    formData.append('content', this.FileForm.get('content').value)
      var nm: string;
      nm = this.FileForm.get("file_name").value
      if(nm.search('/')!=-1){
        confirm("Do not add / in the name")
      }
      else{
      return this.fileser.postFile(formData).subscribe(
	  result=> {
      if(result["status"]=="File exists!"){
        confirm("File already exists!")
      }
      else{
        let fr = new FileReader();
        fr.onload = (e) => {
          this.text = fr.result;
        }
        fr.readAsText(this.fileToUpload);
        this.mode = this.fileToUpload.name.split('.').pop();
        this.DisplayForm.get('path').setValue(this.FileForm.get('path').value);
        this.DisplayForm.get('name').setValue(this.FileForm.get('file_name').value)
        this.DisplayForm.get('content').setValue(this.FileForm.get('content').value)
        if (this.FileForm.get('language').value == 'cpp' || this.FileForm.get('language').value == 'h' || this.FileForm.get('language').value == 'c') this.mode = 'c_cpp';
	      else if (this.FileForm.get('language').value == 'py') this.mode = 'python';
        else if (this.FileForm.get('language').value == 'java') this.mode = 'java';
        else this.mode='javascript'
      }
	      this.showmodal=!this.showmodal;
        this.treecomp.getTree();
        this.folderModal = false;
      
    });
  }
  }

  /**
   * Passes the empty file to the backend for storage. Also opens the file in the editor
   * Creates an empty file in the frontend as well as the backend with the name given by the user as input
   */
  makeEmptyFile(): void {
    if (this.treecomp.fileno == 10) {
      alert ('Maximum file limit of 10 files has already been reached!')
      return;
    }
	  this.FileForm.get('language').setValue(this.FileForm.get('file_name').value.split('.').pop());
	  this.FileForm.get('content').setValue(null);
    if (this.FileForm.get('language').value == 'cpp' || this.FileForm.get('language').value == 'h' || this.FileForm.get('language').value == 'c') this.mode = 'c_cpp';
	  else if (this.FileForm.get('language').value == 'py') this.mode = 'python';
    else if (this.FileForm.get('language').value == 'java') this.mode = 'java';
    else this.mode='javascript';
	  this.DisplayForm.get('path').setValue(this.FileForm.get('path').value);
	  this.DisplayForm.get('content').setValue('');
	  this.DisplayForm.get('name').setValue(this.FileForm.get('file_name').value);
    var nm: string;
    nm = this.FileForm.get("file_name").value
    if(nm.search('/')!=-1){
      confirm("Do not add / to the name")
    }
    else{
	    this.fileser.uploadFromTextBox(this.FileForm.value).subscribe(
	        result => {
            if(result["status"]=="File exists!") confirm("File already exists!")
	    	    this.showmodal=!this.showmodal;
	    	    this.treecomp.getTree();
	        });
     }
  }

  /**
   * 
   * @param data A JSON object containing the name and the path of the chosen file/folder passed from try.component.ts
   * 
   * Displays the chosen file in the text editor. Displays 'Is a folder!' if the chosen element is a folder.
   */
  getFile(data: any){
    var name = data["name"];
    var path = data["path"];
    this.DisplayForm.get("name").setValue(name);
    this.DisplayForm.get("path").setValue(path);
    this.fileser.getFile(name,path).subscribe(result=>{
      this.text=result.lines;
      if (name.split('.').pop() == 'cpp' || name.split('.').pop() == 'c' || name.split('.').pop() == 'h') this.mode = 'c_cpp';
	    else if (name.split('.').pop() == 'py') this.mode = 'python';
	    else if (name.split('.').pop() == 'java') this.mode = 'java';
	    else this.mode='javascript';
    });
  }

  /**
   * Sends the filename and the input to the backend for processing, and displays the output in the Output textbox
   */
  run(){
    this.RunForm.get('Filename').setValue(this.DisplayForm.get('name').value)
    this.RunForm.get('Language').setValue(this.DisplayForm.get('name').value.split('.').pop())
    this.RunForm.get('path').setValue(this.DisplayForm.get('path').value)
    this.RunForm.get('Output').setValue('')
    this.fileser.runFromTextbox(this.RunForm.value).subscribe(result=>{
      this.RunForm.get('Output').setValue(result["out"]);
    })
  }
    
  /**
   * Downloads the currently opened file to the user's machine
   */
  downloadFile(data: any) {
    var name = data["name"];
    var path = data["path"];
    var txt: string;
    this.fileser.getFile(name,path).subscribe(result=>{
      txt=result.lines;
    });
    if(txt=="undefined") txt=""
    var blob = new Blob([txt], { type: 'text/file' });
    var url = window.URL.createObjectURL(blob);
    fileSaver(blob,name);
    window.open(url);
  }

  /**
   * Adds a new folder to the backend, with the change being reflected in the file tree
   */
  addNewFolder(){
    if(this.newName.search('/')!=-1){
      confirm("Do not add / to the name")
    }
    else{
      this.fileser.addFolder(this.newFolder+'/'+this.newName).subscribe(result => {
        if(result["status"]=="already exists!") confirm("this folder already exists!")
        this.folderModal = !this.folderModal;
        this.treecomp.getTree();
        this.showmodal = false;
      });
    }
  }

  /**
   * 
   * @param data A JSON object containing the name and path of the chosen file/folder
   * 
   * Sets the text in the editor to denote that the current file was deleted
   */
  deleteText(data: any){
    if(this.DisplayForm.get("name").value==data["name"]){
      if(this.DisplayForm.get("path").value==data["path"]){
        this.text = "This file was deleted :( Please choose another file! Running this file may give errors!"
      }
    }
  }
}
