import { Component, OnInit } from '@angular/core';
import { ParticlesConfig } from './particles-config';

declare let particlesJS: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  isLogin: boolean = true;
  constructor() { }
  particleJS: any;
  ngOnInit(): void {
    this.invokeParticles();
  }

  public  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }

  switch(): void {
    this.isLogin = !this.isLogin;
    console.log(this.isLogin);
  }
}
