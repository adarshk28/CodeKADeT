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
  /**
   * The form containing the user's login details
   */
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  /**
   * The JWT authentication token obtained from the backend upon authentication of the user
   */
  token: string = '';

  /**
   * 
   * @param fb Object of class FileBuilder to make the form
   * @param login Object of class LoginService to use the methods to interact with  backend for login
   * @param router Object of class Router used for redirection of components
   */
  constructor(private fb: FormBuilder,private login: LoginService, private router: Router) { }

  /**
   * Mandatory function
   */
  ngOnInit(): void {
    
  }
  
  /**
   * Submits the user details for authentication to backend using login object. Redirects to workspace if the user is authenticated. 
   */
  onSubmit(): void {
    this.login.checkLogin(this.loginForm.value).subscribe(
      result => {
        localStorage.setItem("access_token", result['token'])
	      if (result['status'] == undefined) {
         this.router.navigate(['/workspace/']);
        }
        else{
          alert("Invalid username or password");
          window.location.href = './homepage';
        }
      });
  }
}
