// Secured authentication access service
// Transparently manage the authorization token
"use strict";
import { Injectable } from '@angular/core';
import { Http, Request, Headers, RequestOptions } from '@angular/http';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/observable/throw';
export var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        // Internal state to ckeck if logged
        this._user = null;
        this._token = null;
        //public BASEURL: String = "https://localhost:4443"; // debug : testing CORS ...
        this.BASEURL = "";
    }
    // Logging out (client level only).
    AuthService.prototype.clear = function () {
        this._token = this._user = this._roles = null;
        console.info("Logged out");
    };
    // Logout (server level)
    AuthService.prototype.logout = function () {
        var _this = this;
        if (this._user == null || this._token == null) {
            console.info("Trying to logout, but you're not even logged in !");
            return;
        }
        var headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(this._user + ':' + this._token));
        var options = new RequestOptions({ headers: headers });
        ;
        console.info("Preparing to logout from server");
        this.http.delete(this.BASEURL + "/_authtokens/" + this._user, options)
            .subscribe(
        // resp handelr
        function (res) {
            _this.clear();
            console.info("You're logged out !");
        }, 
        // error handler
        function (err) {
            _this.clear();
            console.info("Error while logging out !");
        });
    };
    // If sucessful, login extract roles, user, and token
    AuthService.prototype.login = function (user, password) {
        var _this = this;
        var headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(user + ':' + password));
        var options = new RequestOptions({ headers: headers });
        ;
        console.info("Preparing to login");
        this.clear(); // As a security measure - pending server response.
        this.http.get(this.BASEURL + "/_logic/roles/" + user, options)
            .subscribe(
        // Response handler
        function (res) {
            console.info("Res");
            console.info(res);
            if (res != null && res.status == 200) {
                var data = res.json();
                console.info("data");
                console.info(data);
                console.info("Login request returned : ");
                console.info(data);
                _this._user = user;
                _this._roles = data.roles;
                _this._token = res.headers.get('Auth-Token');
                console.info("Setting user : ", _this._user);
                console.info("Setting roles : ", _this._roles);
                console.info("Setting token : ", _this._token);
            }
            else {
                console.error("Invalid authentication credentials");
            }
        }, function (error) {
            // Error handler
            console.error("Error during login");
            console.error(error);
        });
    };
    // Generic request
    // If logged in, authentication token will be added
    AuthService.prototype.request = function (method, url) {
        var headers = new Headers();
        if (this.isLogged()) {
            headers.set('Authorization', 'Basic ' + btoa(this._user + ':' + this._token));
        }
        else {
            headers.set('No-Auth-Challenge', "true");
        }
        return this.http.request(new Request({
            "url": url,
            "method": method,
            "headers": headers
        }));
    };
    // Are we already logged ?
    AuthService.prototype.isLogged = function () {
        return !(this._user == null);
    };
    // Get user name, or null if not logged
    AuthService.prototype.getUser = function () {
        return this._user;
    };
    // Get the roles
    AuthService.prototype.getRoles = function () {
        return this._roles;
    };
    AuthService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AuthService.ctorParameters = [
        { type: Http, },
    ];
    return AuthService;
}());
//# sourceMappingURL=auth.service.js.map