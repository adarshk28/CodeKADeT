import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  @ViewChild('editor') editor;
  text: string = '';
  Form= new FormGroup({
    Language: new FormControl(''),
    Code: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
  });

  constructor() { }
  private req: any
  data : any
  url: String='/fileupload/'
  ngOnInit(): void {
    // this.req=this.http.get(this.url).subscribe(data=>{
    //   console.log(data)
    //   this.data=data as [any]
    // })
  }
  
  // ngAfterViewInit() {
  //   console.log("Here");
  //   this.editor.setTheme('monokai');
  //   this.editor.getEditor().setOptions({
  //   });
  // }

  onSubmit(): void {
   
  }

  onSave(): void {
    this.Form.get('Code').setValue(this.text);
    console.log('Saved!');
  }
}
