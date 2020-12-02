import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

    constructor(private file:FileService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
	this.getUser();
  }

    getUser(): void {
	const id = this.route.snapshot.paramMap.get('username');
	console.log(id);
	
    }
  
  // ngAfterViewInit() {
  //   console.log("Here");
  //   this.editor.setTheme('monokai');
  //   this.editor.getEditor().setOptions({
  //   });
  // }
  mode='c++';
  onSubmit(): void {
    this.Form.get('Code').setValue(this.text);
    console.log(this.Form.value)
    console.log('Submitted!');
  }

  onSave(): void {
    this.Form.get('Code').setValue(this.text);
    console.log(this.Form.value)
    console.log('Saved!');
  }
}
