import { Component } from '@angular/core';
import { Request, RequestMethod } from '@angular/http';
import { AuthService } from "../serv/auth.service";

@Component({
  // Specifing moduleId let's the template paths be relative.
  // It needs special script (fake module) declaration in the index.
  moduleId: module.id,

  selector: 'login',
  templateUrl: "login.html"
})
export class LoginComponent {

  nbUsers = 0;
  public user: string;
  public password: string;


  // Inject login service
  constructor(public auth: AuthService) {
    this.user = this.auth.getUser();  // In case we return to the component after previous active login ...
  }

  public login() {
    console.log("Login method called");
    this.auth.login(this.user, this.password);
    this.password = null; // security ...
  }

  public logout() {
    this.auth.logout();
  }

  public countUsers() {
    console.log("Preparing to list users (must be loggedIn");
    this.auth.request(RequestMethod.Get, this.auth.BASEURL + "/rh/auth/users?count&pagesize=0" )
      .subscribe(
      // Data handler
      (res) => {
        let data = res.json();
        console.log(res);
        console.log( data);
        this.nbUsers = data._size;
      },
// err handlr
(err) => {
  console.log("Error counting users");
  console.log(err);
  this.nbUsers = 0;
}
    );

  }

}
