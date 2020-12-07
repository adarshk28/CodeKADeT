import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  /** 
   * Form to get the signup details of the user 
   */
  signupForm = this.fb.group({
    username: ['', Validators.required],
    password1: ['', Validators.required],
    password2: ['', Validators.required],
  })

  /**
   * 
   * @param fb Object of class Formbuilder required to make the signup form
   * @param login Object of class LoginService to use methods to interact with backend 
   * @param router Object of class Router used to redirect pages when needed
   */
  constructor(private fb: FormBuilder, private login: LoginService, private router: Router) { }
  ngOnInit(): void {
  }

  /**
   * Registers the user in the backend if there is no such pre-existing account with the same username
   */
  onSubmit(): void {
    if (this.signupForm.value.password1 != this.signupForm.value.password2)
      alert("Please Confirm the Passwords again");  
    else{ 
      this.login.signup(this.signupForm.value).subscribe( details => 
        {
          if (details['Status']=="Registration Successful!"){
            alert("User Registered! Proceed with Login :)");
            window.location.href = './homepage';
          }
          else if (details['Status']=="User Registered Already!"){
            alert("User Already Exists :P Try logging in!");        
            window.location.href = './homepage';
          }
        });
    }
  }
}
