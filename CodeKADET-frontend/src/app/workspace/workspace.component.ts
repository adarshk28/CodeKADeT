import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from '../file.service'
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  @ViewChild('editor') editor;
  text: string = '';
  items=[];
  Form= new FormGroup({
    Language: new FormControl(''),
    Code: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
  });

  constructor(private file:FileService) { }

  ngOnInit(): void {
    this.file.getRequest()
  }
  
  // ngAfterViewInit() {
  //   console.log("Here");
  //   this.editor.setTheme('monokai');
  //   this.editor.getEditor().setOptions({
  //   });
  // }

  onSubmit(): void {
    this.Form.get('Code').setValue(this.text);
    console.log('Submitted!');
  }

  onSave(): void {
    this.Form.get('Code').setValue(this.text);
    console.log('Saved!');
  }
}
