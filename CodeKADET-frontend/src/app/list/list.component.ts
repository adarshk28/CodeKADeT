import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  typesOfShoes: string[] = ['File0', 'Alaska.py', 'Denver.cpp', 'Kimberly.cpp', 'Tokyo.py'];
  newItem: any;
  addItems() {
    this.newItem = prompt("Enter new file name");
    this.typesOfShoes.push(this.newItem);
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
