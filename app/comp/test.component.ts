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

  user: String;
  password: String;

  // Inject login service
  constructor(private auth: AuthService) {

  }

  public test() {
    console.info("Testing method called");
    console.info("User : " + this.user + " Password : " + this.password);
    this.auth.login(this.user, this.password);
  }

}
