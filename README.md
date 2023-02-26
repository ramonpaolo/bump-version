# Bump Version

This GitHub Actions, get the value of tag, and pass to the application, replacing the static version in `package.json`, automatically, without create a new commit and manually change the version.

This action, **works only** with push event of type **tags**

Example:
```yml
on:
  push:
    tags:
      - v*.*.*
```

If you use this action with a worflow that run without this trigger, this step will break.

## Supported Languages

At the moment, just support `package.json` that need exist in root folder

## Examples

```yml
name: Deploy Package to NPM

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish_npm:
    name: Publishing to NPM
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup NodeJs
        uses: actions/setup-node@v3
        with:
          node-version: x.y # Your version that you want use here
          registry-url: https://registry.npmjs.org/
                    
      - name: Install Packages
        run: yarn

      - name: Bump Version of package.json
        uses: ramonpaolo/bump-version@v1.0.0
        with: 
          tag: ${{ github.ref_name }} # Accessing the context and get the reference_name, that in this case, is the tag that you created(ex: v1.0.0)

      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }} # NPM Token necessary to deploy packages on pipelines CI/CD
```

## Input parameters
| Name       | Description              | Required |
| :--        | :--                      | :--      |
| tag        | The tag created(v.\*.\*.\*) | True     |

## Output parameters
| Name       | Description                   |
| :--        | :--                           |
| parsed-tag | v1.0.0(input) = 1.0.0(output) |