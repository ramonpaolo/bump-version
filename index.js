const core = require('@actions/core');
const path = require('path')
const fs = require ('fs');

try {
  // `who-to-greet` input defined in action metadata file
  const tag = core.getInput('tag');
  const parsedTag = tag.replace('v', '')

  core.info(`Parsin tag ${tag} to ${parsedTag}!`);

  const packagePath = path.join('.', 'package.json')

  const packageString = fs.readFileSync(packagePath, {
    encoding: 'utf-8'
  })

  const packageJson = JSON.parse(packageString)
  
  packageJson['version'] = parsedTag

  fs.writeFileSync(packagePath, JSON.stringify(packageJson))

  core.info(packageJson)
  
  core.setOutput("parsed-tag", parsedTag);
} catch (error) {
  core.setFailed(error.message);
}