import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    // return this.logser.checkdets(this.loginForm.values);
  }

}
