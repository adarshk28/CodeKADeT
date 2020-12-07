import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from '../file.service';
import { LoginService } from '../login.service';
import {  Router } from '@angular/router';
import { Location } from '@angular/common';
import * as fileSaver from 'file-saver'
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements AfterViewInit {
  @ViewChild('editor') editor;
  @ViewChild('treecomp') treecomp;

  text: string | ArrayBuffer = '';
  mode: string = 'javascript';
  fileToUpload: File = null;
  items=[];
  id: string = '';
  textboxfile: string = '';
  newFolder: string;
  newName: string;
  user: string;
    formalName = {
	'c_cpp': 'C/C++',
	'python': 'Python',
	'java': 'Java',
	'javascript': 'Unsupported',
    };
    themes='monokai'
  RunForm= new FormGroup({
    Filename: new FormControl(''),
    Language: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
    path: new FormControl('')
  });

  FileForm = new FormGroup({
    language: new FormControl(''),
    content: new FormControl(''),
    file_name: new FormControl(''),
    path: new FormControl(''),
  })


  DisplayForm = new FormGroup({
    name: new FormControl(''),
    path: new FormControl(''),
    content: new FormControl('')
  })
  constructor(private fileser:FileService, private logser: LoginService, private router: Router, private location: Location) { 
    this.logser.getUser().subscribe(result => {
      console.log("user is :")
      console.log(result["user"])
      this.user = result["user"]
    });
  }

  // ngOnInit(): void {}
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
  changeTheme(){
    if(this.themes=='monokai')
    this.themes='clouds';
    else this.themes='monokai';
  }
  showmodal=false;
    modalview(data: any){
    var path = data["path"] +'/'+ data["name"];
    this.FileForm.get("path").setValue(path);
    if(this.folderModal) this.folderModal=false
    this.showmodal=!this.showmodal;
    console.log(this.showmodal);
  }

  folderModal = false;

  folderModalview(data: any){
    var path = data["path"] +'/'+ data["name"];
    this.newFolder = path;
    if(this.showmodal) this.showmodal=false
    this.folderModal = !this.folderModal;
  }
    closeModal(isInEmpty: boolean){
	if (isInEmpty) this.FileForm.get('path').setValue('.');
    this.showmodal = !this.showmodal;
  }

    closeFolderModal(isInEmpty: boolean){
	if (isInEmpty) this.newFolder='.';
    this.folderModal = !this.folderModal;
  }

  showwhat=true;
  empty(){
    this.showwhat=true;
  }
  comp(){
    this.showwhat=false;
  }
  theme(){
    this.themes='monokai'
  }

  onSave = () => {
      console.log('started upload');
      console.log('We are in onSave');
      console.log(this.DisplayForm.value);
	this.DisplayForm.get('content').setValue(this.text);
      if (this.DisplayForm.get('path').value == '') this.DisplayForm.get('path').setValue('.');
      //console.log(this.FileForm.value);
	this.fileser.editFromTextBox(this.DisplayForm.value).subscribe(
	    result => {
        console.log(result);
        this.treecomp.getTree();

      }
	);
  }

  closeModals(data: any){
    this.folderModal = false;
    this.showmodal = false;
  }

  onLogout(): void {
    this.logser.logout().subscribe(
      _ => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/homepage/']);
      }
    );
  }

    setFile(files: FileList) {
      this.fileToUpload = files.item(0);
  }

    handleFileInput() {
      console.log('started upload');
      this.mode = this.fileToUpload.name.split('.').pop();
      console.log('Mode is ' + this.mode);
      let fr = new FileReader();
      fr.onload = (e) => {
	  this.text = fr.result;
      }
      fr.readAsText(this.fileToUpload);
      this.FileForm.get('content').setValue(this.fileToUpload);
      this.FileForm.get('language').setValue(this.FileForm.get('file_name').value.split('.').pop())
      console.log(this.FileForm.value);
      const formData = new FormData();
      if (this.FileForm.get('language').value == 'cpp' || this.FileForm.get('language').value == 'h' || this.FileForm.get('language').value == 'c') this.mode = 'c_cpp';
	else if (this.FileForm.get('language').value == 'py') this.mode = 'python';
      else if (this.FileForm.get('language').value == 'java') this.mode = 'java';
      else this.mode='javascript'
      formData.append('path', this.FileForm.get('path').value)
      formData.append('file_name', this.FileForm.get('file_name').value)
      formData.append('language', this.FileForm.get('language').value)
      formData.append('content', this.FileForm.get('content').value)
      console.log(formData);
      this.DisplayForm.get('path').setValue(this.FileForm.get('path').value);
      this.DisplayForm.get('name').setValue(this.FileForm.get('file_name').value)
      this.DisplayForm.get('content').setValue(this.FileForm.get('content').value)

      console.log(this.DisplayForm.value)
      var nm: string;
      nm = this.FileForm.get("file_name").value
      if(nm.search('/')!=-1){
        console.log("no / allowed")
        confirm("Do not add / in the name")
      }
      else{
      return this.fileser.postFile(formData).subscribe(
	  result=> {
	      console.log(result);
	      this.showmodal=!this.showmodal;
        this.treecomp.getTree();
        this.folderModal = false;
    });
  }
  }

    makeEmptyFile(): void {
	console.log('started upload');
	this.FileForm.get('language').setValue(this.FileForm.get('file_name').value.split('.').pop())
	this.FileForm.get('content').setValue(null);
      if (this.FileForm.get('language').value == 'cpp' || this.FileForm.get('language').value == 'h' || this.FileForm.get('language').value == 'c') this.mode = 'c_cpp';
	else if (this.FileForm.get('language').value == 'py') this.mode = 'python';
      else if (this.FileForm.get('language').value == 'java') this.mode = 'java';
      else this.mode='javascript'
	this.DisplayForm.get('path').setValue(this.FileForm.get('path').value);
	this.DisplayForm.get('content').setValue('');
	this.DisplayForm.get('name').setValue(this.FileForm.get('file_name').value);
      console.log(this.FileForm.value);
      var nm: string;
      nm = this.FileForm.get("file_name").value
      console.log(nm)
      if(nm.search('/')!=-1){
        console.log("no / allowed")
        confirm("Do not add / to the name")
      }
      else{
	this.fileser.uploadFromTextBox(this.FileForm.value).subscribe(
	    result => {
		console.log(result);
		this.showmodal=!this.showmodal;
		this.treecomp.getTree();
	    });
    }
  }

    getFile(data: any){
      console.log("you want file: ")
      var name = data["name"]
      var path = data["path"]
      this.DisplayForm.get("name").setValue(name)
      this.DisplayForm.get("path").setValue(path)
      console.log(name)
      console.log(path)  
      this.fileser.getFile(name,path).subscribe(result=>{
        console.log("file obtained from backend")
        console.log(result)
        this.text=result.lines
	
          if (name.split('.').pop() == 'cpp' || name.split('.').pop() == 'c' || name.split('.').pop() == 'h') this.mode = 'c_cpp';
	else if (name.split('.').pop() == 'py') this.mode = 'python';
	  else if (name.split('.').pop() == 'java') this.mode = 'java';
	  else this.mode='javascript';
      })
    }



    run(){
      console.log('running///////////')
      console.log(this.DisplayForm.value)
      this.RunForm.get('Filename').setValue(this.DisplayForm.get('name').value)
      this.RunForm.get('Language').setValue(this.DisplayForm.get('name').value.split('.').pop())
      this.RunForm.get('path').setValue(this.DisplayForm.get('path').value)
      console.log(this.RunForm.value)
      this.fileser.runFromTextbox(this.RunForm.value).subscribe(result=>{
        this.RunForm.get('Output').setValue(result["out"]);
        console.log("Compiling and running the code .......");
        console.log(result);
      })
      console.log("done")
    }
    
    downLoadFile() {
      var blob = new Blob([this.text], { type: 'text/file' });
      var url = window.URL.createObjectURL(blob);
      fileSaver(blob,this.DisplayForm.get('name').value);
      window.open(url);

    }

    addNewFolder(){
      if(this.newName.search('/')!=-1){
        console.log('/ not allowed')
        confirm("Do not add / to the name")
      }
      else{
      this.fileser.addFolder(this.newFolder+'/'+this.newName).subscribe(result => {
        this.folderModal = !this.folderModal;
        console.log(result);
        this.treecomp.getTree();
        this.showmodal = false;
      })
    }
  }

    deleteText(data: any){
      console.log(data["name"])
      console.log(data["path"])
      if(this.DisplayForm.get("name").value==data["name"]){
        if(this.DisplayForm.get("path").value==data["path"]){
          this.text = "This was file was deleted :( Please choose another file! Running this file may give errors!"
        }
      }
    }


}
