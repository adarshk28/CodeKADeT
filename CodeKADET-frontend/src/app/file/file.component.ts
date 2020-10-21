import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  constructor() { }

  fileToUpload: File = null;

  ngOnInit(): void {
  }

  onChange(): void {
    console.log('Uploaded succesfully');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log('Uploaded successfully');
    console.log(this.fileToUpload);
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
