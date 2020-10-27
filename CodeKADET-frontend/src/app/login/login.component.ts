import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { LoginService } from '../login.service';
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
  constructor(private fb: FormBuilder,private login: LoginService) { }
  ngOnInit(): void {
    
  }
  
  onSubmit(): void {
    console.log(this.loginForm.value);
    //this.login.addpost(JSON.stringify(this.loginForm.value)).subscribe(details => {console.log(details)});
    // return this.logser.checkdets(this.loginForm.values);

  }

}
