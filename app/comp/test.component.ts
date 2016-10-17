import { Component } from '@angular/core';
import { Request, RequestMethod } from '@angular/http';
import { AuthService } from "../serv/auth.service";

@Component({
  // Specifing moduleId let's the template paths be relative.
  // It needs special script (fake module) declaration in the index.
  moduleId: module.id,

  selector: 'my-test',
  templateUrl: "test.html"
})
export class TestComponent {

  nbUsers = 0;


  // Inject login service
  constructor(public auth: AuthService) {
  }

  public login(user: String, password: String) {
    console.info("Login method called");
    this.auth.login(user, password);
  }

  public logout() {
    this.auth.logout();
  }

  public countUsers() {
    console.info("Preparing to list users (must be loggedIn");
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
  console.info("Error counting users");
  console.log(err);
  this.nbUsers = 0;
}
    );

  }

}
