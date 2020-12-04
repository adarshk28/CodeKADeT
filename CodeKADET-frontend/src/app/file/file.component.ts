import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Fileclass } from './fileclass';
import { FormBuilder, Validators } from '@angular/forms'
import { Binary } from '@angular/compiler';
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  constructor(private fileser: FileService, private route: ActivatedRoute, private location: Location,private fb: FormBuilder) { }

  newfile: Fileclass={file_name:"",language:"",content:"",description:"nothing"};
  
  FileForm = this.fb.group({
    file_name: ['', Validators.required],
    language: ['', Validators.required],
    content:['', Validators.required],
    description:['not filling now', Validators.required]
  })

  fileToUpload: File = null;
  private id: number = 0;
  name: string;
  content: string | ArrayBuffer;
  language: string;
  ngOnInit(): void {}

  onChange(): void {
    console.log('Uploaded succesfully');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log('started upload');
    // console.log(this.fileToUpload);

    this.name = this.fileToUpload.name ;
    

    if(this.name.substr(this.name.length - 3)=="cpp")  this.language="cpp";
    else if (this.name.substr(this.name.length - 2)=="py")  this.language="python";



    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      this.content = fileReader.result;
      console.log(this.content);

      // Object.assign(this.newfile,{file_name: this.fileToUpload.name},{content: fileReader.result},{language: this.language},{description: "Nothing"});
      // console.log(fileReader.result);
    }
    // fileReader.readAsText(this.fileToUpload);
    fileReader.readAsText(this.fileToUpload);
    
    this.FileForm.patchValue({
      content: this.content as string
    });
    this.FileForm.patchValue({file_name: this.name});
    this.FileForm.patchValue({language: this.language});
    
    console.log(this.FileForm.value)
    
    console.log(this.FileForm['content']);
    // console.log(this.newfile);

    return this.fileser.postFile(this.FileForm.value).subscribe(
      result => console.log(result)
    );
    

  }

  // uploadFileToActivity() {
  //   this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
  //     console.log('Uploaded')
  //   }, error => {
  //     console.log(error);
  //   }
  //   );
  // }
}
