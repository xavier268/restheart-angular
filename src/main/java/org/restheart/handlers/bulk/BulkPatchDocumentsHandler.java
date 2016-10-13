/*
 * RESTHeart - the Web API for MongoDB
 * Copyright (C) SoftInstigate Srl
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
package org.restheart.handlers.bulk;

import io.undertow.server.HttpServerExchange;
import org.restheart.db.BulkOperationResult;
import org.restheart.db.DocumentDAO;
import org.restheart.handlers.PipedHttpHandler;
import org.restheart.handlers.RequestContext;

/**
 *
 * @author Andrea Di Cesare {@literal <andrea@softinstigate.com>}
 */
public class BulkPatchDocumentsHandler extends PipedHttpHandler {

    private final DocumentDAO documentDAO;

    /**
     * Creates a new instance of PatchDocumentHandler
     */
    public BulkPatchDocumentsHandler() {
        this(null, new DocumentDAO());
    }

    public BulkPatchDocumentsHandler(DocumentDAO documentDAO) {
        super(null);
        this.documentDAO = documentDAO;
    }
    
    public BulkPatchDocumentsHandler(PipedHttpHandler next) {
        super(next);
        this.documentDAO = new DocumentDAO();
    }
    
    public BulkPatchDocumentsHandler(PipedHttpHandler next, DocumentDAO documentDAO) {
        super(next);
        this.documentDAO = documentDAO;
    }

    /**
     *
     * @param exchange
     * @param context
     * @throws Exception
     */
    @Override
    @SuppressWarnings("unchecked")
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {
        BulkOperationResult result = this.documentDAO
                .bulkPatchDocuments(
                        context.getDBName(), 
                        context.getCollectionName(), 
                        context.getFiltersDocument(),
                        context.getShardKey(),
                        context.getContent().asDocument());

        context.setDbOperationResult(result);

        if (context.getWarnings() != null && !context.getWarnings().isEmpty()) {
            //sendWarnings(result.getHttpCode(), exchange, context);
        } else {
            exchange.setStatusCode(result.getHttpCode());
        }

        BulkResultRepresentationFactory bprf = new BulkResultRepresentationFactory();
        
        bprf.sendRepresentation(exchange, context, 
                bprf.getRepresentation(exchange, context, result));
        
        if (getNext() != null) {
            getNext().handleRequest(exchange, context);
        }

        exchange.endExchange();
    }
}
