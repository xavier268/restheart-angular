// Secured authentication access service
// Transparently managed the authorization token

"use strict";

import { Injectable }     from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

  // Internal state to ckeck if logged
  private _user: String = null;
  private _roles: String[];
  private _token: String = null;


  constructor(private http: Http) { }

  // Logging out (client level).
  public logout() {
    this._token = this._user = this._roles = null;
    console.info("Logged out");
  }

  // If sucessful, login extract roles, user, and token
  public login(user: String, password: String) {

    let headers: Headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(user + ':' + password));
    let options = new RequestOptions({ headers: headers });;
    console.info("Preparing to login"); // TODO - WORKS UNTIL HERE THEN ???!!!
    this.logout(); // As a security measure - pending server response.
    this.http.get("/_logic/roles/" + user, options)
      .subscribe(
      // Response handler
      (res) => {
        console.info("Res"); console.info(res);
        if (res != null && res.status == 200) {
          let data = res.json();
          console.info("data");
          console.info(data);
          console.info("Login request returned : ");
          console.info(data);
          this._user = user;
          this._roles = data.roles;
          this._token = res.headers.get('Auth-Token');
          console.info("Setting user : ", this._user);
          console.info("Setting roles : ", this._roles);
          console.info("Setting token : ", this._token);
        } else {
          console.error("Invalid authentication credentials");
        }
      },
      (error) => {
        // Error handler
        console.error("Error during login");
        console.error(error);
      });
  }

  // Are we already logged ?
  public isLogged(): boolean {
    return !(this._user == null);
  }

  // Get user name, or null if not logged
  public getUser(): String {
    return this._user;
  }

  // Get the roles
  public getRoles(): String[] {
    return this._roles;
  }


}
