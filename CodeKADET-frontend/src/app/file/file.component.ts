import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Fileclass } from './fileclass';
import { FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { Binary } from '@angular/compiler';
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  constructor(private fileser: FileService, private route: ActivatedRoute, private location: Location,private fb: FormBuilder) { }

  // newfile: Fileclass={file_name:"",language:"",content:"",description:"nothing"};
  
  // FileForm = this.fb.group({
  //   file_name: ['', Validators.required],
  //   language: ['', Validators.required],
  //   content:['', Validators.required],
  //   description:['not filling now', Validators.required]
  // })
    FileForm = new FormGroup({
	file_name: new FormControl(''),
	language: new FormControl(''),
	content: new FormControl(''),
	description: new FormControl('not filling now'),
    })

  fileToUpload: File = null;
  private id: number = 0;
  name: string;
  content: string //| ArrayBuffer;
  language: string;
  ngOnInit(): void {}

  onChange(): void {
    console.log('Uploaded succesfully');
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
      formData.append('language', this.FileForm.get('file_name').value)
      formData.append('content', this.FileForm.get('content').value)
      formData.append('description', this.FileForm.get('description').value)
      return this.fileser.postFile(formData).subscribe(
	  result=> console.log(result)
      )
  }
  // handleFileInput(files: FileList) {
  //   this.fileToUpload = files.item(0);
  //   console.log('started upload');
  //   // console.log(this.fileToUpload);

  //   this.name = this.fileToUpload.name ;
    

  //   if(this.name.substr(this.name.length - 3)=="cpp")  this.language="cpp";
  //   else if (this.name.substr(this.name.length - 2)=="py")  this.language="python";

  //     this.FileForm.get('content').setValue(
  //     let str = '';
  //   let fileReader = new FileReader();
  //   fileReader.onload = (e) => {
  // 	let str: string = fileReader.result.toString();
  // 	console.log(str);
  // 	this.FileForm.get('content').setValue(str);
  // 	this.FileForm.get('file_name').setValue(this.name);
  // 	this.FileForm.get('language').setValue(this.language);
    
  // 	console.log(this.FileForm.value)
    
  // 	console.log(this.FileForm.get('content').value);
  // 	return this.fileser.postFile(this.FileForm.value).subscribe(
  // 	    result => console.log(result)
  // 	);
  //   }
  //   fileReader.readAsText(this.fileToUpload);
  //   // this.FileForm.patchValue({
  //   //   content: this.content as string
  //   // });
  //   // this.FileForm.patchValue({file_name: this.name});
  //   // this.FileForm.patchValue({language: this.language});
  //     // this.FileForm.get('content').setValue(this.content);
  //   // console.log(this.newfile);

    

  // }

  // uploadFileToActivity() {
  //   this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
  //     console.log('Uploaded')
  //   }, error => {
  //     console.log(error);
  //   }
  //   );
  // }
}
