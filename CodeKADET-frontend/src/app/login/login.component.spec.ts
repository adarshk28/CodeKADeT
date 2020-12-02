import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //url: string = '/login/'
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
    constructor(private fb: FormBuilder,private login: LoginService, private router: Router) { }
  ngOnInit(): void {
    
  }
  
  onSubmit(): void {
    this.login.checkLogin(this.loginForm.value).subscribe(
	result => {
	    if (result['status'] == undefined)  
    this.router.navigate(['/workspace/' + result['username']]);
      else 
    alert("Please enter valid credentials");
	}
    );

  }
}
