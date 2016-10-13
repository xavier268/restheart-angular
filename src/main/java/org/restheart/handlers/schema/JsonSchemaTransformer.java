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
package org.restheart.handlers.schema;

import com.google.common.collect.Lists;
import io.undertow.server.HttpServerExchange;
import java.util.List;
import org.bson.BsonDocument;
import org.bson.BsonObjectId;
import org.bson.BsonString;
import org.bson.BsonValue;
import org.bson.types.ObjectId;
import org.restheart.hal.metadata.singletons.Transformer;
import org.restheart.handlers.RequestContext;
import org.restheart.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Andrea Di Cesare {@literal <andrea@softinstigate.com>}
 */
public class JsonSchemaTransformer implements Transformer {
    static final Logger LOGGER = LoggerFactory
            .getLogger(JsonSchemaTransformer.class);

    private static final BsonString $SCHEMA
            = new BsonString("http://json-schema.org/draft-04/schema#");

    @Override
    public void transform(HttpServerExchange exchange,
            RequestContext context,
            final BsonValue contentToTransform,
            BsonValue args) {
        BsonDocument content
                = context.getContent().asDocument();

        BsonDocument _contentToTransform
                = contentToTransform.asDocument();

        if (context.getType() == RequestContext.TYPE.SCHEMA) {
            if (context.getMethod() == RequestContext.METHOD.GET) {
                unescapeSchema(_contentToTransform);
            } else if (context.getMethod() == RequestContext.METHOD.PUT
                    || context.getMethod() == RequestContext.METHOD.PATCH) {

                // generate id as specs mandates
                SchemaStoreURL uri = new SchemaStoreURL(
                        context.getDBName(),
                        context.getDocumentId());

                content.put("id", new BsonString(uri.toString()));

                // escape all $ prefixed keys
                escapeSchema(_contentToTransform);

                // add (overwrite) $schema field
                _contentToTransform.put("_$schema", $SCHEMA);
            }
        } else if (context.getType() == RequestContext.TYPE.SCHEMA_STORE) {
            if (context.getMethod() == RequestContext.METHOD.POST) {
                // generate id as specs mandates
                BsonValue schemaId;

                if (!content.containsKey("_id")) {
                    schemaId = new BsonObjectId(new ObjectId());
                    content.put(
                            "id",
                            schemaId);
                } else {
                    schemaId = content.get("_id");
                }

                SchemaStoreURL uri = new SchemaStoreURL(
                        context.getDBName(),
                        schemaId);

                content.put("id", new BsonString(uri.toString()));

                // escape all $ prefixed keys
                escapeSchema(_contentToTransform);

                // add (overwrite) $schema field
                _contentToTransform.put("_$schema", $SCHEMA);
            } else if (context.getMethod() == RequestContext.METHOD.GET) {
                // apply transformation on embedded schemas

                if (_contentToTransform.containsKey("_embedded")) {

                    BsonValue _embedded = _contentToTransform
                            .get("_embedded");

                    if (_embedded.isDocument()
                            && _embedded.asDocument()
                            .containsKey("rh:schema")) {

                        // execute the logic on children documents
                        BsonValue docs = _embedded
                                .asDocument()
                                .get("rh:schema");

                        if (docs.isArray()) {
                            docs.asArray().stream()
                                    .filter(doc -> {
                                        return doc.isDocument();
                                    })
                                    .forEach((doc) -> {
                                        unescapeSchema(doc.asDocument());
                                    });
                        }
                    }
                }
            }
        }
    }

    public static void escapeSchema(BsonDocument schema) {
        BsonValue escaped = JsonUtils.escapeKeys(schema, false);

        if (escaped.isDocument()) {
            List<String> keys = Lists.newArrayList(schema.keySet().iterator());

            keys.stream().forEach(f -> schema.remove(f));

            schema.putAll(escaped.asDocument());
        }
    }

    public static void unescapeSchema(BsonDocument schema) {
        BsonValue unescaped = JsonUtils.unescapeKeys(schema);

        if (unescaped.isDocument()) {
            List<String> keys = Lists.newArrayList(schema.keySet().iterator());

            keys.stream().forEach(f -> schema.remove(f));

            schema.putAll(unescaped.asDocument());
        }
    }
}
