import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  Form= new FormGroup({
    Language: new FormControl(''),
    Code: new FormControl(''),
    Input: new FormControl(''),
    Output: new FormControl(''),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
