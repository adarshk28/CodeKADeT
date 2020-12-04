import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from '../file.service';
import { LoginService } from '../login.service';
import {  Router } from '@angular/router';
import { Location } from '@angular/common';
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
  text: string = '';
    fileToUpload: File = null;
  
  items=[];
  id: string = '';
  Form= new FormGroup({
    Language: new FormControl(''),
    Code: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
  });

  FileForm = new FormGroup({
    language: new FormControl(''),
    content: new FormControl(''),
    description: new FormControl(''),
    file_name: new FormControl(''),
  })

    // constructor(private file:FileService, private route: ActivatedRoute, private location: Location) { }
    constructor(private fileser:FileService, private logser: LoginService, private router: Router, private location: Location) { }


  ngOnInit(): void {}

  mode='python';
  onSubmit(): void {
    this.Form.get('Code').setValue(this.text);
    console.log(this.Form.value)
    console.log('Submitted!');
  }

  onSave(): void {
    this.Form.get('Code').setValue(this.text);
    console.log(this.Form.value)
      console.log('Saved!');
      this.FileForm.get('language').setValue(this.Form.get('Language').value);
      this.FileForm.get('content').setValue(this.text);
      this.FileForm.get('language').setValue(this.Form.get('Language').value);
      // this.fileser.editFromTextbox()
      
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
      this.FileForm.get('file_name').setValue(this.fileToUpload.name);
      this.FileForm.get('language').setValue(this.fileToUpload.name.split('.').pop());
      this.FileForm.get('content').setValue(this.fileToUpload);
      this.FileForm.get('description').setValue('None');
      const formData = new FormData();
      formData.append('file_name', this.FileForm.get('file_name').value)
      formData.append('language', this.FileForm.get('language').value)
      formData.append('content', this.FileForm.get('content').value)
      formData.append('description', this.FileForm.get('description').value)
      return this.fileser.postFile(formData).subscribe(
	  result=> console.log(result)
      )
  }

    textboxfile: string = '';
    makeEmptyFile() {
      console.log('started upload');
      this.FileForm.get('file_name').setValue(this.textboxfile);
      this.FileForm.get('language').setValue(this.textboxfile.split('.').pop());
      this.FileForm.get('description').setValue('None');
	this.FileForm.get('content').setValue(null);
	return this.fileser.uploadFromTextBox(this.FileForm.value).subscribe(
	    result => console.log(result)
	);
    }
    
}
