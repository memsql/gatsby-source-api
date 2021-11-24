# gatsby-source-api

A gatsby plugin that enables fetching JSON data from an external REST API.
Responses are converted to graphql nodes which can then be accessed via
Gatsby's graphql API. Optionally, a schema can be provided to ensure graphql will
not fail in the event the API fails to return data.

Note that the plugin is data/API agnostic but it is only designed to work
correctly with JSON data. So although the plugin can query data of any response
type, you can expect non-deterministic behaviour if you attempt to create
non-JSON graphql nodes. If your API does not return JSON data, you can either use
the `serialize` or `serializeAll` callback functions (see below for details) to
transform your data into a valid JSON format so that it can be read by the
graphql node creator successfully.

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

### Multiple Instances
Do you need to request data from more than one API? Use multiple instances of the
plugin. Each instance is self contained. The only thing to remember is that each
instance of the plugin must have a unique `name` field.

```javascript
// gatsby-config.js
module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-api",
            options: {
                name: "http-api",
                endpoint: "http://httpbin.org/get",
            },
        },
        {
            resolve: "gatsby-source-api",
            options: {
                name: "github-repos",
                endpoint: "https://api.github.com/repos/gatsby",
            },
        },
    ],
};
```

### Multiple Requests to the Same API
Do you need to make multiple requests to the same API? You can specify an array
of `requests` where each request is an object containing any of the
parameters allowed in the root `options` object. You can alternatively use
`options.getRequests()` to programmatically generate the request objects used to
generate source nodes.

```javascript
// gatsby-config.js
const repositoryNames = [
    ["gatsbyjs", "gatsby"],
    ["facebook", "react"],
    ["microsoft", "TypeScript"],
];

module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-api",
            options: {
                name: "github-repos",
                fetchOptions: {
                    headers: {
                        authorization: "token <github_token>"
                    }
                },
                requests: repositoryNames.map(([orgName, repoName]) => ({
                    endpoint: `https://api.github.com/${orgName}/${repoName}`;
                })),
            },
        },
    ],
};
```

### Dynamic Request Options
Do you need to programmatically create one or more request option objects? For example, do
you need to login to your API before using it? You can use `options.getRequest()`
or `options.getRequests()` to create a RequestOptions object or a set of
RequestOptions objects (respectively) dynamically.

```javascript
// gatsby-config.js
const sources = ["blog", "events"];

module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-api",
            options: {
                name: "my-custom-api",
                getRequest: async () => {
                    const token = await myCustomAPI.login();
                    return {
                        fetchOptions: {
                            endpoint: myCustomAPI.blogEndpoint,
                            headers: {
                                authorization: `Bearer ${token}`,
                            },
                        },
                    };
                },
            },
        },
        // ========
        //    OR
        // ========
        {
            resolve: "gatsby-source-api",
            options: {
                name: "my-custom-api",
                getRequests: async () => {
                    return Promise.all(
                        sources.map(async source => {
                            const token = await myCustomAPI[source].login();
                            return {
                                fetchOptions: {
                                    endpoint: myCustomAPI[source].endpoint,
                                    headers: {
                                        authorization: `Bearer ${token}`,
                                    },
                                },
                            };
                        })
                    );
                },                
            },
        },
    ],
};
```

### Use a Custom Fetch Implementation
Do you want a third-party library to handle fetching data for you? You can use
`options.fetch()` to customize how the fetch works in any way you want. The
resulting data will be processed by this plugin the same way as every other
request that this plugin handles. Use this if you want to continue using
advanced features like `options.requests` or `options.getRequests` but don't
want to have to install yet another plugin to handle third-party fetching
use-cases.

For example, lets say you want to fetch class data from [this](https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0) example Google
Sheet using the Google Sheets API stored within the `googleapis` library. Using
a custom fetch function, you can fetch the data yourself but then allow the
plugin to handle creating graphql nodes for you. This example also shows how to
`serialize` the return data such that it is stored as an array of objects instead
of the default google sheet format (which returns an array of arrays).

```javascript
// gatsby-config.js
const { google } = require("googleapis");

module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-api",
            options: {
                name: "sheets",
                fetch: async () => {
                    const auth = new google.auth.GoogleAuth({
                        keyFile: "/path/to/you/service-acc/credentials.json",
                        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
                    });

                    const sheets = google.sheets({
                        version: "v4",
                        auth,
                    });

                    // https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
                    return sheets.spreadsheets.values.get({
                        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
                        range: "Class Data!A2:F31",
                    })
                },
                serialize: ({ data: rows }) => {
                    return rows.map(row => {
                        const [name, gender, class_level, home_state, major, activity] = row;
                        return {
                            name,
                            gender,
                            class_level,
                            home_state,
                            major,
                            activity,
                        };
                    });
                },
            },
        },
    ],
};
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
    options like headers, authentication details, post data, query params etc... See the
    list of available options in the [got
    package](https://www.npmjs.com/package/got)

  * `fetchOptions.endpoint <string|URL>`
    * See endpoint description above. If both `endpoint` and this option are set,
      this option will override the root `endpoint` option above.

  * `fetchOptions.method <oneOf(head|options|get|post)>`
    * Default: `get`

* `fetch <(request: RequestOptions, pluginContext: PluginContext) => array|object>`
  * A custom fetch function to replace the default fetch implementation.
    Can be used to fetch from other sources such as GraphQL or use third-party
    libraries to fetch data for you.
    
* `entryPoint <string|(string|number)[]>`
  * A path to the data returned by the API. See
    [lodash's get path](https://lodash.com/docs/4.17.15#get) syntax for more
    examples of what the path should look like

* `serialize <(response: FetchResponse, request: RequestOptions, pluginContext: PluginContext) => array|object>`
  * Modifies the response data written to graphql nodes.

* `metadata <object>`
  * Any additional metadata to pass along with the request's configuration
    options. The metadata is not used by the fetch function. Use `fetchOptions`
    to pass additional options to the fetch request. This can be useful when
    using one of the `serialize` functions as the metadata is exposed along
    with the response in the serializer.

* `schema <Schema | (request: RequestOptions, pluginContext: PluginContext) => Schema>`
  * Optionally provide one or more schema(s) that denote the shape of the data
    returned by your API call. This is useful if you know you will need to query
    for fields that may not always be present in the queried data. See the
    [schema data type](#schema) for more details or see Gatsby's [full schema
    explaination](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createTypes)
    for an in-depth guide for how the schema works
  * Optionally you can provide a function that resolves to a valid schema parameter

* `listKey <string>`
  * A string that is used as a node name in the case that the API returns a
    nested array or an array of primitives. In most cases, this will not be used
    as most rest APIs will return an array of objects or a single object. Will
    use the request's `name` if not set.

* `typePrefix <string>`
  * A prefix applied to the graphql node name such that the node appears as
    `<typePrefix><name>` (without carrets).
  * Default: `"external"`

* `killOnRequestError <boolean>`
  * Whether to throw an error in the case of a failed request. This is useful
    if you want to combine the result of multiple requests in the serialized
    output and it is ok if one or more of the individual requests fail.
  * Default: `true`

### General Options

* `requests <RequestOptions[]>`
  * An array of request options which can be used to make multiple requests to
    same set of fetch or sheet options. Accepts an array of objects whose
    properties can be found in [#RequestOptions](#request-options) above. Every request requires a
    unique `name` property and should either have differeing endpoints,
    fetchOptions or sheetOptions. Each request's options
    will be merged with the root plugin options. Should not be used with
    `getRequest` or `getRequests`

* `getRequest <(pluginOptions: PluginOptions, pluginContext: PluginContext) => RequestOptions>`
  * Allows an asynchronous function to get the request configuration options to
    use. The request requires a unique `name` property.
    The request's options will be merged with the root plugin options. Should return
    a single request object. Should not be used with `requests` or `getRequests` 

* `getRequests <(pluginOptions: PluginOptions, pluginContext: PluginContext) => RequestOptions[]>`
  * Allows an asynchronous function to get an array of request configuration
    options. Every request requires a
    unique `name` property and should either have differeing endpoints,
    fetchOptions or sheetOptions.
    Applies the same merging as the `requests` option. Should not be used with
    `requests` or `getRequest` 
  
* `serializeAll <(responses: NonSerializedResponseContext[], pluginContext: PluginContext) => array|object>`
  * Modifies the response data that is written to JSON. The first argument contains an array of all the
    responses for each request made. Should only be used when multiple requests
    have been made, otherwise use `serialize`.

## Object Types

#### `PluginContext`
Contains all of the helpers included in the Gatsby Node API helpers [gatsby
context](https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/)
in addition to the following:

* `instance <string>`
  * A colorized string containing the plugin name and the name of the
    current request. Can be used in logging messages.

#### `Fetch Response`
Contains the original request, the response's headers and data and the serialized output of
`entryPoint`, `serialize()` or `serializeAll()`. The data that gets written to
gatsby nodes is the final result of the `serialized` key. If no `serialize()`
function is provided, `serialized` will be filled in for youtypes based on the
body of the original response.

```typescript
type SimpleResponse = Record<string, unknown>
type SerializedResponse = SimpleResponse[] | SimpleResponse;

interface SerializedResponseContext {
    request: RequestOptions;
    response: {
        headers: ResponseHeaders,
        data: ResponseData;
    },
    serialized: SerializedResponse
}
```

#### `Schema`
The provided schema gets fed directly to Gatsby's `createTypes()` helper which
accepts schemas in a number of different data formats. We recommend you check out
the following Gatsby documentation on Gatsby Schemas for help on creating your
own schema for this plugin.

- [createTypes()](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createTypes)
- [Schema Customization](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/)

The following is the type definition for the allowed values of `Schema` as
definied by Gatsby's `createTypes` helper function.

```typescript
type Schema =
      | string
      | GraphQLOutputType
      | GatsbyGraphQLType
      | Array<string | GraphQLOutputType | GatsbyGraphQLType>;
```

## Examples

TODO

## Possible Future Features

-   Support a login request that can obtain an OAuth token or similar
    - This is currently possible using the `getRequest()` function
-   Support paginated requests where the user defines a key that should be used as
    a pagination token and automatically fetches X pages up to a user specified amount
