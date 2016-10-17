// Secured authentication access service
// Transparently manage the authorization token

"use strict";

import { Injectable }     from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions, RequestOptionsArgs, RequestMethod } from '@angular/http';
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
  //public BASEURL: String = "https://localhost:4443"; // debug : testing CORS ...
  public BASEURL: String = "";


  constructor(private http: Http) { }

  // Logging out (client level only).
  public clear() {
    this._token = this._user = this._roles = null;
    console.info("Logged out");
  }

  // Logout (server level)
  public logout() {
    if (this._user == null || this._token == null) {
      console.info("Trying to logout, but you're not even logged in !");
      return;
    }
    let headers: Headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(this._user + ':' + this._token));
    let options = new RequestOptions({ headers: headers });;
    console.info("Preparing to logout from server");
    this.http.delete(this.BASEURL + "/_authtokens/" + this._user, options)
      .subscribe(
      // resp handelr
      (res) => {
        this.clear();
        console.info("You're logged out !");
      },
      // error handler
      (err) => {
        this.clear();
        console.info("Error while logging out !");
      }
      );

  }

  // If sucessful, login extract roles, user, and token
  public login(user: String, password: String) {

    let headers: Headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(user + ':' + password));
    let options = new RequestOptions({ headers: headers });;
    console.info("Preparing to login");
    this.clear(); // As a security measure - pending server response.
    this.http.get(this.BASEURL + "/_logic/roles/" + user, options)
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

  // Generic request
  // If logged in, authentication token will be added
  request(method: RequestMethod, url: string): Observable<Response> {
    let headers = new Headers();
    if (this.isLogged()) {
      headers.set('Authorization', 'Basic ' + btoa(this._user + ':' + this._token));
    } else {
      headers.set('No-Auth-Challenge', "true");
    }

    return this.http.request(
      new Request({
        "url": url,
        "method": method,
        "headers": headers
      })
    );
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
