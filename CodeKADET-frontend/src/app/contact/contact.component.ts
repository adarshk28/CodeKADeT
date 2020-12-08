import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { ParticlesConfig } from './particles-config';
declare let particlesJS: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  value1: String;
  value2: String;
  value3: String;
  value4: String;
  constructor() {
    this.value1='9911933299';
    this.value2='7380086948';
    this.value3='9619347875';
    this.value4='9137993242';
   }

   /**
    * Calls invokeParticles on initialization of page
    */
   ngOnInit(): void {
    this.invokeParticles();
  }

  /**
   * Function to call the particles.js functionality
   */
  public invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }

}
