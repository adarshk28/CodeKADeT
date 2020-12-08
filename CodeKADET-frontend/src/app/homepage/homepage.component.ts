import { Component, OnInit } from '@angular/core';
import { ParticlesConfig } from './particles-config';

declare let particlesJS: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  constructor() { }
  particleJS: any;
  
  /**
   * True if login component is being displayed, false if signup component is being displayed
   */
  isLogin=true;

   /**
    * Calls invokeParticles on initialization of page
    */
  ngOnInit(): void {
    this.invokeParticles();
  }

  /**
   * Function to call the particles.js functionality
   */
  public  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }

  /**
   * Toggles the value of isLogin to swtich between login and signup components
   */
  switch() {
    this.isLogin = !this.isLogin;
  }
}
