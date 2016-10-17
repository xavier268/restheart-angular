// Secured authentication access service
// Transparently managed the authorization token
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/observable/throw';
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        // Internal state to ckeck if logged
        this._user = null;
        this._token = null;
    }
    // Logging out (client level).
    AuthService.prototype.logout = function () {
        this._token = this._user = this._roles = null;
        console.info("Logged out");
    };
    // If sucessful, login extract roles, user, and token
    AuthService.prototype.login = function (user, password) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.set('Authorization', 'Basic ' + btoa(user + ':' + password));
        var options = new http_1.RequestOptions({ headers: headers });
        ;
        console.info("Preparing to login"); // TODO - WORKS UNTIL HERE THEN ???!!!
        this.logout(); // As a security measure - pending server response.
        this.http.get("/_logic/roles/" + user, options)
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
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map