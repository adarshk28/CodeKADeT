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
  token: string = '';
    constructor(private fb: FormBuilder,private login: LoginService, private router: Router) { }
  ngOnInit(): void {
    
  }
  
  onSubmit(): void {
    // this.login.getToken(this.loginForm.value).subscribe(
    //   result => localStorage.setItem("access_token", 'Bearer ' + result['token'])
    // );
    console.log('Obtained token'); 
    this.login.checkLogin(this.loginForm.value).subscribe(
      result => {
        console.log(result);
        localStorage.setItem("access_token", result['token'])
	      if (result['status'] == undefined) {
         this.router.navigate(['/workspace/']);
        }
        else{
          alert("Invalid username or password");
          window.location.href = './homepage';
        }
          
	    }
    );
}
}