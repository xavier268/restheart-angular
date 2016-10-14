/*
 * 
 * (c) Xavier Gandillot <xavier@gandillot.com> 2016
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.twiceagain.handlers.logic;

import io.undertow.server.HttpServerExchange;
import java.util.Map;
import org.restheart.handlers.PipedHttpHandler;
import org.restheart.handlers.RequestContext;
import org.restheart.handlers.applicationlogic.ApplicationLogicHandler;
import org.restheart.handlers.injectors.BodyInjectorHandler;

/**
 * Wrapper to inject bodycontent from BodyInjectorHandler before processing.
 * @author xavier
 */
public class MyLogicHandler extends ApplicationLogicHandler {

    private static BodyInjectorHandler INJECTOR;
    private static MyLogicHandlerInternal HANDLER;
    
    public MyLogicHandler(PipedHttpHandler next, Map<String, Object> args) {
        super(next, args);
        HANDLER = new MyLogicHandlerInternal(next, args);
        INJECTOR = new BodyInjectorHandler(HANDLER); 
        System.out.printf("\n*** Construncting %s ***\n", this.getClass());
    }

    @Override
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {      
        // Calling just injector will trigger MyLogicHandlerInternal because
        // chaining was done when constructing.
        INJECTOR.handleRequest(exchange, context);
        
    }
    
}
