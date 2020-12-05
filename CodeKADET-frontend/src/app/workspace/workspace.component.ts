import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from '../file.service';
import { LoginService } from '../login.service';
import {  Router } from '@angular/router';
import { Location } from '@angular/common';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
// import * as ace from 'ace-builds/src-noconflict/ace';
    // ace.config.set('basePath', '');
    // ace.config.set('modePath', '');
    // ace.config.set('themePath', '');

    interface User_Id {
      id: string;
    }
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  @ViewChild('editor') editor;
  text: string | ArrayBuffer = '';
  mode: string = 'py';
  fileToUpload: File = null;
  items=[];
  id: string = '';
  textboxfile: string = '';

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
    description: new FormControl(''),
    file_name: new FormControl(''),
    path: new FormControl(''),
  })

    // constructor(private file:FileService, private route: ActivatedRoute, private location: Location) { }
    constructor(private fileser:FileService, private logser: LoginService, private router: Router, private location: Location) { }


  ngOnInit(): void {}

  onSubmit(): void {
    console.log('Submitted!');
  }
  showmodal=false;
  modalview(){
    this.showmodal=!this.showmodal;
    console.log(this.showmodal);
  }
  showwhat=true;
  empty(){
    this.showwhat=true;
  }
  comp(){
    this.showwhat=false;
  }

  onSave(): void {
      console.log('started upload');
      this.FileForm.get('file_name').setValue(this.textboxfile);
      this.FileForm.get('language').setValue(this.textboxfile.split('.').pop());
      this.FileForm.get('description').setValue('None');
	this.FileForm.get('content').setValue(this.text);
	this.fileser.editFromTextBox(this.FileForm.value).subscribe(
	    result => console.log(result)
	);
  }


  onLogout(): void {
    let obj: User_Id = { id: this.id };
    console.log(obj);
    this.logser.logout(obj).subscribe(
      _ => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/homepage/']);
      }
    );
  }

    handleFileInput(files: FileList) {
      this.fileToUpload = files.item(0);
      console.log('started upload');
      this.mode = this.fileToUpload.name.split('.').pop();
      console.log('Mode is ' + this.mode);
      let fr = new FileReader();
      fr.onload = (e) => {
	  console.log('File has been read');
	  this.text = fr.result;
      }
      fr.readAsText(this.fileToUpload);
      this.FileForm.get('content').setValue(this.fileToUpload);
      const formData = new FormData();
      formData.append('path', this.FileForm.get('path').value)
      formData.append('file_name', this.FileForm.get('file_name').value)
      formData.append('language', this.FileForm.get('language').value)
      formData.append('content', this.FileForm.get('content').value)
      formData.append('description', this.FileForm.get('description').value)
      return this.fileser.postFile(this.FileForm.value).subscribe(
	  result=> console.log(result)
      )
  }

    makeEmptyFile(): void {
      console.log('started upload');
  //     this.FileForm.get('file_name').setValue(this.textboxfile);
  //     this.FileForm.get('language').setValue(this.textboxfile.split('.').pop());
  //     this.FileForm.get('description').setValue('None');
  this.FileForm.get('content').setValue(null);
  console.log(this.FileForm.value);
	this.fileser.uploadFromTextBox(this.FileForm.value).subscribe(
	    result => console.log(result)
	);
    }
    run(){
      console.log('running///////////')
      this.RunForm.get('Filename').setValue(this.FileForm.get('file_name').value)
      this.RunForm.get('Language').setValue(this.FileForm.get('file_name').value.split('.').pop())
      this.RunForm.get('path').setValue(this.FileForm.get('path').value)
      console.log(this.RunForm.value)
      this.fileser.runFromTextbox(this.RunForm.value).subscribe(result=>{
        this.RunForm.get('Output').setValue(result["out"]);
        console.log("Compiling and running the code .......");
        console.log(result);
      })
      console.log("done")
    }
    
}
