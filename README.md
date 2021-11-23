# gatsby-source-api

A gatsby plugin that enables fetching JSON data from an external rest API.
responses are converted to graphql nodes which can then be accessed via the
Gatsby's graphql API. Optionally, a schema can be provided to ensure graphql will
not fail in the event the API fails to return data.

Note that the plugin is data agnostic but it is only designed to work with
JSON data. So although the plugin can query data of any response type, you can
expect non-deterministic behaviour if you attempt to create non JSON graphql
nodes. If your API does not return JSON data, you can use one of the `serialize`
callback functions (see below for details) to modify your data such that it
can be read by the graphql node creator successfully.

## Usage

```javascript
// gatsby-config.js
module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-api",
            options: {
                name: "http-api",
                endpoint: "http://httpbin.org/get",
            }
        }
    ]
}
```

## Options

### Request Options

* `name <string>` - required
  * A unique name for the request. The graphQL node name will be the camelCase
    version of the name given. The name can optionally be used as a key in
    cases where the returned data is an array of primitives (see `listKey`).
    The name is also used in all logging and tracing outputs.

* `endpoint <string|URL>`
  * The API endpoint to use to obtain the JSON data.

* `fetchOptions <object>`
  * Any additional options to pass to the fetch request. This can include
    options like headers, auth details, post data, query params etc... See the
    list of available options in the [got
    package](https://www.npmjs.com/package/got)

  * `fetchOptions.endpoint <string|URL>`
    * See endpoint description above. If both `endpoint` and this option are set,
      this option will override the root `endpoint` option above.

  * `fetchOptions.method <oneOf(head|options|get|post)>`
    * default: `get`
    
* `entryPoint <string|(string|number)[]>`
  * A path to the data returned by the API. See
    [lodash's get path](https://lodash.com/docs/4.17.15#get) syntax for more
    examples of what the path should look like

* `serialize <(response: ResponseObject, pluginContext: PluginContext) => array|object>`
  * Modifies the response data written to graphql nodes.

* `metadata <object>`
  * Any additional metadata to pass along with the request's configuration
    options. The metadata is not used by the fetch function. Use `fetchOptions`
    to pass additional options to the fetch request. This can be useful when
    using one of the `serialize` functions as the metadata is exposed along
    with the response in the serializer.

* `schema <FieldType>`
  * Optionally provide a schema object that defines the shape and type
    of each property that retrieved from the API. This is useful if you know
    that the API request or serialized output won't contain all of the fields
    you will be querying for. See [Defining a Schema](#defining-a-schema) for
    more details.

* `listKey <string>`
  * A string that is used as a node name in the case that the API returns a
    nested array or an array of primitives. In most cases, this will not be used
    as most rest APIs will return an array of objects or a single object. Will
    use the request's `name` if not set.

* `typePrefix <string>`
  * A prefix applied to the graphql node name such that the node appears as
    `<typePrefix><name>` (without carrets).
  * Default: "external"

* `killOnRequestError <boolean>`
  * Whether to throw an error in the case of a failed request. This is useful
    if you want to combine the result of multiple requests in the serialized
    output and it is ok if one or more of the individual requests fail.

## General Options

* `requests <RequestOptions[]>`
  * An array of request options which can be used to make multiple requests to
    same set of fetch or sheet options. Accepts an array of objects whose
    properties can be found in #RequestOptions above. Every request requires a
    unique `name` property and should either have differeing endpoints,
    fetchOptions or sheetOptions. Each request's options
    will be merged with the root plugin options. Should not be used with
    `getRequest` or `getRequests`

* `getRequest <(pluginOptions, pluginContext: PluginContext) => RequestOptions>`
  * Allows an asynchronous function to get the request configuration options to
    use. The request requires a unique `name` property.
    The request's options will be merged with the root plugin options. Should return
    a single request object. Should not be used with `requests` or `getRequests` 

* `getRequests <(pluginOptions, pluginContext: PluginContext) => RequestOptions[]>`
  * Allows an asynchronous function to get an array of request configuration
    options. Every request requires a
    unique `name` property and should either have differeing endpoints,
    fetchOptions or sheetOptions.
    Applies the same merging as the `requests` option. Should not be used with
    `requests` or `getRequest` 
  
* `serializeAll <(responses: ResponseObject[], pluginContext: PluginContext) => array|object>`
  * Modifies the response data that is written to JSON. The first argument contains an array of all the
    responses for each request made. Should only be used when multiple requests
    have been made, otherwise use `serialize`.
* `contentDir <string>` - required
  * The directory to write the fetched JSON file to.

### Object Types

#### `PluginContext`
Contains all of the hepers included in the Gatsby Node API helpers [gatsby
context](https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/)
in addition to the following:

* `instance <string>`
  * A colorized string containing the plugin name and the name of the
    current request. Can be used in logging messages.

#### `ResponseObject`
Contains the request, response headers and data and the serialized output of
`entryPoint`, `serialize`

```typescript
interface ResponseObject {
    request: PluginOptions;
    response: {
        headers: ResponseHeaders,
        data: ResponseData;
    },
}
```

#### `FieldType`
Contains useful sample schema constants that can be used when defining a sample
schema using the `schema` request option

```javascript
FieldTypes.STRING
FieldTypes.INT
FieldTypes.FLOAT
FieldTypes.BOOL
FieldTypes.DATE
FieldTypes.shape()
FieldTypes.array()
```

## Examples

TODO

## Possible Future Features

-   Support a login request that can obtain an OAuth token or similar
-   Support paginated requests where the user defines a key that should be used as
    a pagination token and automatically fetches X pages up to a user specified amount
