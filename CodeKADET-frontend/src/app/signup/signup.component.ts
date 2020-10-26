import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.signupForm.value);
    // return this.logser.checkdets(this.signupForm.values);
  }

}
