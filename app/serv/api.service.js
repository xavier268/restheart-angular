// Secured api access service
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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var ApiService = (function () {
    function ApiService(http) {
        this.http = http;
        // Internal state to ckeck if logged
        this.loggedUser = null;
        this.loggedToken = null;
    }
    // Logging out (client level).
    ApiService.prototype.logout = function () {
        this.loggedToken = this.loggedUser = this.loggedRoles = null;
        console.info("Logged out");
    };
    // If sucessful, login extract roles, user, and token
    ApiService.prototype.login = function (user, password) {
        this.http.get("/_logic/roles/" + user)
            .subscribe(
        // Error handler
        function (error) {
            console.error("Error during login");
            console.error(error);
        }, 
        // Response handler
        function (res) {
            console.info("Login request returned : ");
            console.info(res);
            return res.json();
        });
    };
    ApiService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map