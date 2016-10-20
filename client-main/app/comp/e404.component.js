import { Component } from '@angular/core';
export var E404Component = (function () {
    function E404Component() {
    }
    E404Component.decorators = [
        { type: Component, args: [{
                    // Specifing moduleId let's the template paths be relative.
                    // It needs special script (fake module) declaration in the index.
                    moduleId: module.id,
                    selector: 'e404',
                    template: "\n          <h1> This page does not exists </h1>\n          Message from the e404 component ...\n          "
                },] },
    ];
    /** @nocollapse */
    E404Component.ctorParameters = [];
    return E404Component;
}());
//# sourceMappingURL=e404.component.js.map