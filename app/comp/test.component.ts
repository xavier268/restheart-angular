import { Component } from '@angular/core';
import { AuthService } from "../serv/auth.service"

@Component({
  // Specifing moduleId let's the template paths be relative.
  // It needs special script (fake module) declaration in the index.
  moduleId: module.id,

  selector: 'my-test',
  templateUrl: "test.html"
})
export class TestComponent {


  // Inject login service
  constructor( public auth: AuthService) {
  }

  public login(user:String, password:String) {
    console.info("Login method called");
    this.auth.login(user, password);
  }

  public logout() {
    this.auth.logout();
  }

}
