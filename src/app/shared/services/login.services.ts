
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class LoginServices {
    baseURL="https://alexa-oauth.herokuapp.com";
    private primaryNumberVerifyURL:string = `${this.baseURL}/honda/primary`;
    private OTPVerifyURL:string = `${this.baseURL}/honda/verifyOtp`;
    private mpinVerifyURL:string = `${this.baseURL}/honda/verifyMpin`;

    private Headers:HttpHeaders;

    constructor(private http: HttpClient){
        this.Headers = new HttpHeaders({'Content-Type': 'application/json'})
    }

    primaryNumberVerify(body):Observable<any>{
        return this.http.post(this.primaryNumberVerifyURL, JSON.stringify(body), {headers:this.Headers});
    };

    OTPVerify(data){
        return this.http.post(this.OTPVerifyURL, JSON.stringify(data), {headers:this.Headers});
    }

    mpinVerify(data){
        return this.http.post(this.mpinVerifyURL, JSON.stringify(data), {headers:this.Headers});
    }
    
}