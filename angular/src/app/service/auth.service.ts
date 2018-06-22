import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  user:any;
  authtoken:any;

  constructor(
    private http:Http,
  ) { }
  registerUser(user){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post("http://localhost:3000/register",user,{headers:headers}).map(res=>res.json());
  };

  loginUser(user){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post("http://localhost:3000/login",user,{headers:headers}).map(res=>res.json());
  };

  storeData(token,userdata){
    localStorage.setItem("tokenid",token);
    localStorage.setItem("user",JSON.stringify(userdata));
    this.authtoken = token;
    this.user = userdata;
  };

getprofile(){
  this.fetchtoken();
  let headers = new Headers();
  headers.append('Authorization',this.authtoken);
  headers.append('content-Type','application/json');
  return this.http.get("http://localhost:3000/profile",{headers:headers}).map(res=>res.json());
  
};
fetchtoken(){
  const token = localStorage.getItem("tokenid");
  this.authtoken = token;
};

logOut(){

  this.fetchtoken();
  let headers = new Headers();
  headers.append('Authorization',this.authtoken);
  headers.append('content-Type','application/json');
  this.authtoken = null;
  this.user = null;
  localStorage.clear();
  return this.http.get("http://localhost:3000/logout",{headers:headers}).map(res=>res.json()); 
}

loggedIn(){
  return tokenNotExpired('tokenid');
  
}

}
