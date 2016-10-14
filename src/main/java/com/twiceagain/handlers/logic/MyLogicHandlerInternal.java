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

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.Headers;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import org.bson.BsonValue;
import org.bson.Document;
import org.restheart.Bootstrapper;
import org.restheart.cache.Cache;
import org.restheart.cache.CacheFactory;
import org.restheart.cache.LoadingCache;
import org.restheart.db.MongoDBClientSingleton;
import org.restheart.handlers.PipedHttpHandler;
import org.restheart.handlers.RequestContext;
import org.restheart.handlers.applicationlogic.ApplicationLogicHandler;
import org.restheart.utils.HttpStatus;
import org.restheart.utils.ResponseHelper;

/**
 * Test db access from the logic handler. Do not call this class directly, if
 * the content needs to be set from the body of the request. @see MyLogicHandler
 *
 * @author xavier
 */
class MyLogicHandlerInternal extends ApplicationLogicHandler {

    private static MongoClient CLIENT;
    private static LoadingCache<String, Document> CACHE;

    public MyLogicHandlerInternal(PipedHttpHandler next, Map<String, Object> args) {
        super(next, args);

        System.out.printf("\n******Constructing %s with args = %s *******\n", this.getClass(), args);

        // Get client - mongo driver version 3.2
        CLIENT = MongoDBClientSingleton.getInstance().getClient();

        // Create auto-refreshing cache for the request
        CACHE = CacheFactory.createLocalLoadingCache(
                1,// cache size, 
                Cache.EXPIRE_POLICY.AFTER_WRITE,
                5000, // 5 seconds
                (String key) -> {
                    // Lamda to create content associated with key
                    System.out.printf("\n*** Constructing cache for key = %s***", key);
                    MongoCollection<Document> coll = CLIENT.getDatabase("auth").getCollection("users");
                    long nbusers = coll.count();

                    // Build Document for response
                    Document doc = new Document("countOfUsersInDatabase", nbusers)
                    .append(
                            "another", new Document(
                                    "mytest", new ArrayList<>()
                            ));
                    // And save it to cache
                    return doc;
                });

    }

    @Override
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {
        String answer;
        System.out.printf("\n******** the %s was called **********\n",this.getClass());
        System.out.printf("\n******** Mapped url = %s **********\n",context.getMappedRequestUri());
        System.out.printf("\n******** Method = %s **********\n",context.getMethod());
        System.out.printf("\n******** Raw uri (non mapped) = %s **********\n",context.getUri());
        
        
        switch (context.getMethod()) {

            case GET:

                // Get an optional result from the cache. 
                // If the data was read more than 5 secs ago, it gets reloaded first.
                Optional<Document> optDoc = CACHE.getLoading("alwaysthesamekeyhere");

                if (optDoc.isPresent()) {

                    Document doc = optDoc.get();
                    exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, "application/json");
                    exchange.getResponseSender().send(doc.toJson());
                    exchange.endExchange();

                } else {

                    answer = "Could not get the count of values ?!";
                    ResponseHelper.endExchangeWithMessage(
                            exchange,
                            context,
                            HttpStatus.SC_INTERNAL_SERVER_ERROR,
                            answer);
                }
                break;

            case POST:
                // Lets try to read from the request
                // Caution 1 : we do not get a 3.0 format Document,
                // but are getting a BsonValues instead.
                BsonValue content = context.getContent();

                // We can note that authenticated resquests have 
                // their Auth-Token headers added to the incoming request ...
                System.out.printf("\n***POSTED exchange : %s\n", exchange.toString());

                // Caution : the context.getContent() is read from the 
                // wrapper class (@see MyLogicHandler)
                System.out.printf("\n***POSTED exchange Content-Length : %s\n", exchange.getRequestContentLength());
                System.out.printf("\n***POSTED exchange Content from context : %s\n", content);

                Document doc = Document.parse(content.toString());
                System.out.printf("\n***Parsed content : %s***\n", doc);

                exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, "application/json");
                exchange.getResponseSender().send(doc.toJson());
                exchange.endExchange();

                break;
                
            case DELETE:
                
                // Shutting down server !!
                Bootstrapper.shutdown();
                
                // Need to close and finish request, or the server will wait
                exchange.setStatusCode(HttpStatus.SC_ACCEPTED);
                exchange.endExchange();

            default:
                // Send an error code
                exchange.setStatusCode(HttpStatus.SC_METHOD_NOT_ALLOWED);
                exchange.endExchange();
        }
    }

}
