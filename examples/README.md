# Gatsby-source-api Examples

### Github API Quota Limits

If you are working on an PR for gatsby-source-api and you are testing your
updates using the examples provided in this folder, you might be running into
Github API quota limitations.

To get around the limitation, you can provide your
own Github personal access token as an `environment variable` called
`GITHUB_TOKEN`. The examples will automatically use this token if it exists in
your environment.

You can find the steps for creating your own access token here:

https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

Once you have your token, you can create a `.env` file in the examples directory
and paste your token in there. You can use the following command to create the
file in the right place with the right syntax:

```bash
$ npm run examples-env
```

The resulting to file should look something like this (without the "<", and ">")
```
GITHUB_TOKEN=<token>
```
