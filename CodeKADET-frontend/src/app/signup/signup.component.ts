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
  signupForm = this.fb.group({
    username: ['', Validators.required],
    password1: ['', Validators.required],
    password2: ['', Validators.required],
  })
  constructor(private fb: FormBuilder, private login: LoginService, private router: Router) { }
  ngOnInit(): void {
  }

  onSubmit(): void {
    // console.log(this.signupForm.value);
    if (this.signupForm.value.password1 != this.signupForm.value.password2)
      alert("Please Confirm the Password again");  
    else{ 
      this.login.signup(this.signupForm.value).subscribe( details => 
        {
          console.log(details);
          if (details['Status']=="Registration Successful!"){
            alert("User Registered! Proceed with Login :)");
            // this.router.navigate(['/homepage/']);
          }
          else if (details['Status']=="User Registered Already!"){
            alert("User Already Exists :P Try logging in!");        
          }
          
        });

    }
    
    // return this.logser.checkdets(this.signupForm.values);
  }

}
