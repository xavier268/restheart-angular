// Secured api access service
// Transparently managed the authorization token

"use strict";

import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';


@Injectable()
export class ApiService {

  // Internal state to ckeck if logged
  private loggedUser: String = null;
  private loggedRoles: String[];
  private loggedToken: String = null;


  constructor(private http: Http) { }

  // Logging out (client level).
  public logout() {
    this.loggedToken = this.loggedUser = this.loggedRoles = null;
    console.info("Logged out");
  }

  // If sucessful, login extract roles, user, and token
  public login(user: String, password: String) {

    this.http.get("/_logic/roles/" + user)
      .subscribe(
        // Error handler
        (error: any) => {
          console.error("Error during login");
          console.error(error);
        },
        // Response handler
        (res: Response) => {
      console.info("Login request returned : ");
      console.info(res);
      return res.json();
    });

  }



}
