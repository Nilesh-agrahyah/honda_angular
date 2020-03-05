import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder, FormGroup} from '@angular/forms';
import {LoginServices} from './shared/services/login.services';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'myapp';
  frmGrpNumber:FormGroup;
  frmGrpOTP:FormGroup;
  frmGrpMPIN:FormGroup;

  client_id;
  response_type;
  redirect_uri;
  scope;
  state;

  currentNumber;

  isNumberVerified = false;
  numberNotVerified = false;
  otpNotVerified = false;
  mpinNotVerified = false;
  isOTPVerified = false;
  isOTPExpired = false;

  attempts = 5;

  constructor(private fb: FormBuilder, private services: LoginServices, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.client_id = params['client_id'];
      this.response_type = params['response_type'];
      this.redirect_uri = params['redirect_uri'];
      this.scope = params['scope'];
      this.state = params['state'];

      this.frmGrpNumber = this.fb.group({
        'primaryMobileNo': ['', [Validators.required, Validators.minLength(10)]],
        'clientId':`${this.client_id}`,
        'scope': `${this.scope}`,
        'state':`${this.state}`,
        'responseType': `${this.response_type}`,
        'redirectURI': `${this.redirect_uri}`
      });

      /* console.log({
        c: this.client_id,
        res: this.response_type,
        red: this.redirect_uri,
        scope: this.scope,
        state: this.state
      }); */
    });

    this.frmGrpOTP = this.fb.group({
      'otp': ['', [Validators.required, Validators.minLength(4)]]
    });

    this.frmGrpMPIN = this.fb.group({
      'mpin': ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  postPrimaryNo(data){
    this.currentNumber = data.primaryMobileNo;
    console.log(data);
    this.services.primaryNumberVerify(data).subscribe(item => {
      if(item.status == true){
        this.isNumberVerified = true;
      }
      else{
        this.numberNotVerified = true;
      } 
      
    });
  }

  postOTP(data){
    this.services.OTPVerify(data).subscribe((item:any) => {
      console.log(item);
      if(item.status == true){
        this.isOTPVerified = true;
      }
      else if(item.status == false && item.otpExpired == false){
        this.isOTPVerified = false;
        this.otpNotVerified = true;
        this.attempts--;
      }
      else{
        this.isOTPExpired = true;
        this.otpNotVerified = false;
        this.attempts = 5;
      }
      
    })
  }

  postMPIN(data){
    this.services.mpinVerify(data).subscribe((item:any) => {
      if(item.status == true){
        this.mpinNotVerified = false;
        window.location.href = `${item.authURL}`;
      }
      else{
        this.mpinNotVerified = true;
      }
    })
  }
}
