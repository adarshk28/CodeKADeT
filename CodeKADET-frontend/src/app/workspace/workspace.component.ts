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
  
  items=[];
  id: string = '';
  Form= new FormGroup({
    Language: new FormControl(''),
    Code: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
  });

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


}
