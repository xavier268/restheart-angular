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
  private _user: string = null;
  private _roles: string[];
  private _token: string = null;
  //public BASEURL: String = "https://localhost:4443"; // debug : testing CORS ...
  public BASEURL: string = "";


  constructor(private http: Http) { }

  // Logging out (client level only).
  public clear() {
    this._token = this._user = this._roles = null;
    console.log("Logged out");
  }

  // Logout (server level)
  public logout() {
    if (this._user == null || this._token == null) {
      console.log("Trying to logout, but you're not even logged in !");
      return;
    }
    let headers: Headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(this._user + ':' + this._token));
    let options = new RequestOptions({ headers: headers });;
    console.log("Preparing to logout from server");
    this.http.delete(this.BASEURL + "/_authtokens/" + this._user, options)
      .subscribe(
      // resp handelr
      (res) => {
        this.clear();
        console.log("You're logged out !");
      },
      // error handler
      (err) => {
        this.clear();
        console.log("Error while logging out !");
      }
      );

  }

  // If sucessful, login extract roles, user, and token
  public login(user: string, password: string) {

    let headers: Headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(user + ':' + password));
    let options = new RequestOptions({ headers: headers });;
    console.log("Preparing to login");
    this.clear(); // As a security measure - pending server response.
    this.http.get(this.BASEURL + "/_logic/roles/" + user, options)
      .subscribe(
      // Response handler
      (res) => {
        console.log("Res"); console.log(res);
        if (res != null && res.status == 200) {
          let data = res.json();
          console.log("data");
          console.log(data);
          console.log("Login request returned : ");
          console.log(data);
          this._user = user;
          this._roles = data.roles;
          this._token = res.headers.get('Auth-Token');
          console.log("Setting user : ", this._user);
          console.log("Setting roles : ", this._roles);
          console.log("Setting token : ", this._token);
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
  public getUser(): string {
    return this._user;
  }

  // Get the roles
  public getRoles(): string[] {
    return this._roles;
  }


}
