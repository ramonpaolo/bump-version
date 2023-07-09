# Bump Version

This GitHub Actions, get the value of tag, and pass to the application, replacing the static version in `package.json`, automatically, without create a new commit and manually change the version.

This action, **works only** with push event of type **tags**

Example:
```yml
on:
  push:
    tags:
      - 'v[1-9].[0-9].[0-9]'
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
      - 'v[1-9].[0-9].[0-9]'

jobs:
  publish_npm:
    name: Publishing to NPM
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup NodeJs
        uses: actions/setup-node@v3
        with:
          node-version: x.y # Version that you want use here
          registry-url: https://registry.npmjs.org/
                    
      - name: Install Packages
        run: yarn

      - name: Bump Version of package.json
        uses: ramonpaolo/bump-version@v1.0.0
        with: 
          tag: ${{ github.ref_name }} # Accessing the context and get the reference_name, that in this case, is the tag that you created(ex: v1.0.0)
          commit: true
          branch_to_push: 'master'

      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }} # NPM Token necessary to deploy packages on pipelines CI/CD
```

## Input parameters
| Name                  | Description                 | Required  | Default  |
| :--                   | :--                         | :--       | :--      |
| tag                   | The tag created(v.\*.\*.\*) | `true`    | "v1.0.0" |
| commit                | Commit the bump             | `false`   | `false`  |
| branch_to_push        | Who branch to push          | `false`   | "main"   |

## Output parameters
| Name       | Description                   |
| :--        | :--                           |
| parsed-tag | v1.0.0(input) = 1.0.0(output) |