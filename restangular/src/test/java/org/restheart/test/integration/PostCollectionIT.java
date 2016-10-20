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
package org.restheart.test.integration;

import com.eclipsesource.json.Json;
import com.eclipsesource.json.JsonObject;
import com.eclipsesource.json.JsonValue;
import com.mashape.unirest.http.Unirest;
import org.restheart.hal.Representation;
import static org.restheart.test.integration.HttpClientAbstactIT.adminExecutor;
import org.restheart.utils.HttpStatus;
import io.undertow.util.Headers;
import java.net.URI;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.fluent.Response;
import org.junit.Assert;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Andrea Di Cesare {@literal <andrea@softinstigate.com>}
 */
public class PostCollectionIT extends HttpClientAbstactIT {
    private final String DB = "test-post-collection-db";
    private final String COLL = "coll";

    private com.mashape.unirest.http.HttpResponse resp;

    public PostCollectionIT() {
    }

    @Test
    public void testPostCollection() throws Exception {
        Response response;

        // *** PUT tmpdb
        response = adminExecutor.execute(Request.Put(dbTmpUri).bodyString("{a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));
        check("check put db", response, HttpStatus.SC_CREATED);

        // *** PUT tmpcoll
        response = adminExecutor.execute(Request.Put(collectionTmpUri).bodyString("{a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));
        check("check put coll1", response, HttpStatus.SC_CREATED);

        response = adminExecutor.execute(Request.Post(collectionTmpUri).bodyString("{a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));
        check("check post coll1", response, HttpStatus.SC_CREATED);

        // *** POST tmpcoll
        response = adminExecutor.execute(Request.Post(collectionTmpUri).bodyString("{a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));
        HttpResponse httpResp = check("check post coll1 again", response, HttpStatus.SC_CREATED);

        Header[] headers = httpResp.getHeaders(Headers.LOCATION_STRING);

        assertNotNull("check loocation header", headers);
        assertTrue("check loocation header", headers.length > 0);

        Header locationH = headers[0];
        String location = locationH.getValue();

        URI createdDocUri = URI.create(location);

        response = adminExecutor.execute(Request.Get(createdDocUri).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));

        JsonObject content = JsonObject.readFrom(response.returnContent().asString());
        assertNotNull("check created doc content", content.get("_id"));
        assertNotNull("check created doc content", content.get("_etag"));
        assertNotNull("check created doc content", content.get("a"));
        assertTrue("check created doc content", content.get("a").asInt() == 1);

        String _id = content.get("_id").asObject().get("$oid").asString();
        String _etag = content.get("_etag").asObject().get("$oid").asString();

        // try to post with _id without etag  forcing checkEtag
        response = adminExecutor.execute(Request.Post(addCheckEtag(collectionTmpUri)).bodyString("{_id:{\"$oid\":\"" + _id + "\"}, a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));
        check("check post created doc without etag forcing checkEtag", response, HttpStatus.SC_CONFLICT);
        
        // try to post with wrong etag
        response = adminExecutor.execute(Request.Post(collectionTmpUri).bodyString("{_id:{\"$oid\":\"" + _id + "\"}, a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE).addHeader(Headers.IF_MATCH_STRING, "pippoetag"));
        check("check put created doc with wrong etag", response, HttpStatus.SC_PRECONDITION_FAILED);

        // try to post with correct etag
        response = adminExecutor.execute(Request.Post(collectionTmpUri).bodyString("{_id:{\"$oid\":\"" + _id + "\"}, a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE).addHeader(Headers.IF_MATCH_STRING, _etag));
        check("check post created doc with correct etag", response, HttpStatus.SC_OK);
        
        // try to post with _id without etag
        response = adminExecutor.execute(Request.Post(collectionTmpUri).bodyString("{_id:{\"$oid\":\"" + _id + "\"}, a:1}", halCT).addHeader(Headers.CONTENT_TYPE_STRING, Representation.HAL_JSON_MEDIA_TYPE));
        check("check post created doc without etag", response, HttpStatus.SC_OK);
    }
    
    @Before
    public void createTestData() throws Exception {
        // create test db
        resp = Unirest.put(url(DB))
                .basicAuth(ADMIN_ID, ADMIN_PWD)
                .asString();

        Assert.assertEquals("create db " + DB, org.apache.http.HttpStatus.SC_CREATED, resp.getStatus());

        // create collection
        resp = Unirest.put(url(DB, COLL))
                .basicAuth(ADMIN_ID, ADMIN_PWD)
                .asString();

        Assert.assertEquals("create collection " + DB.concat("/").concat(COLL), org.apache.http.HttpStatus.SC_CREATED, resp.getStatus());
    }

    @Test
    public void testPostDocumentDotNotation() throws Exception {
        resp = Unirest.post(url(DB, COLL))
                .basicAuth(ADMIN_ID, ADMIN_PWD)
                .header("content-type", "application/json")
                .body("{ '_id': 'docid1', 'doc.number': 1 }")
                .asString();

        Assert.assertEquals("check response status of create test data", org.apache.http.HttpStatus.SC_CREATED, resp.getStatus());

        resp = Unirest.get(url(DB, COLL, "docid1"))
                .basicAuth(ADMIN_ID, ADMIN_PWD)
                .asString();

        Assert.assertEquals("check response status of get test data", org.apache.http.HttpStatus.SC_OK, resp.getStatus());

        JsonValue rbody = Json.parse(resp.getBody().toString());

        Assert.assertTrue("check data to be a json object",
                rbody != null
                && rbody.isObject());

        JsonValue doc = rbody.asObject().get("doc");

        Assert.assertTrue("check data to have the 'doc' json object",
                doc != null
                && doc.isObject());

        JsonValue number = doc.asObject().get("number");

        Assert.assertTrue("check doc to have the 'number' property",
                number != null
                && number.isNumber()
                && number.asInt() == 1);
    }

    @Test
    public void testPostDocumentOperators() throws Exception {
        resp = Unirest.post(url(DB, COLL))
                .basicAuth(ADMIN_ID, ADMIN_PWD)
                .header("content-type", "application/json")
                .body("{ '_id': 'docid2', '$push': {'array': 'a'}, '$inc': { 'count': 100 }, '$currentDate': {'timestamp': true } }")
                .asString();

        Assert.assertEquals("check response status of create test data", org.apache.http.HttpStatus.SC_CREATED, resp.getStatus());

        resp = Unirest.get(url(DB, COLL, "docid2"))
                .basicAuth(ADMIN_ID, ADMIN_PWD)
                .asString();

        Assert.assertEquals("check response status of get test data", org.apache.http.HttpStatus.SC_OK, resp.getStatus());

        JsonValue rbody = Json.parse(resp.getBody().toString());

        Assert.assertTrue("check data to be a json object",
                rbody != null
                && rbody.isObject());

        JsonValue array = rbody.asObject().get("array");

        Assert.assertTrue("check data to have the 'array' array with one element",
                array != null
                && array.isArray()
                && array.asArray().size() == 1);

        JsonValue element = array.asArray().get(0);

        Assert.assertTrue("check array element to be the string 'a'",
                element != null
                && element.isString()
                && element.asString().equals("a"));

        JsonValue count = rbody.asObject().get("count");
        
        Assert.assertTrue("check count property to be 100",
                count != null
                && count.isNumber()
                && count.asInt() == 100);
        
        JsonValue timestamp = rbody.asObject().get("timestamp");
        
        Assert.assertTrue("check timestamp to be an object",
                timestamp != null
                && timestamp.isObject());
        
        JsonValue $date = timestamp.asObject().get("$date");
        
        Assert.assertTrue("check $date to be numeric",
                $date != null
                && $date.isNumber());
    }
}
