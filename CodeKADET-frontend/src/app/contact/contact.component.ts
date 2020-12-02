import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  value1: String;
  value2: String;

  constructor() {
    this.value1='9911933299';
    this.value2='7380086948'
   }

  ngOnInit(): void {
  }

}
