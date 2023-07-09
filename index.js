const core = require('@actions/core');
const path = require('path')
const fs = require ('fs');
const { execSync } = require('child_process')

try {
  const tag = core.getInput('tag');
  const commit = core.getBooleanInput('commit');

  const parsedTag = tag.replace('v', '')

  core.info(`Parsin tag ${tag} to ${parsedTag}!`);

  const packagePath = path.join('.', 'package.json')

  const packageString = fs.readFileSync(packagePath, {
    encoding: 'utf-8'
  })

  const packageJson = JSON.parse(packageString)
  
  packageJson['version'] = parsedTag

  fs.writeFileSync(packagePath, JSON.stringify(packageJson))
  
  if(commit === true){
    core.debug(execSync(`git add`))
    core.debug(execSync(`git commit -m "bump version to \"${parsedTag}\""`))
    core.debug(execSync('git push'))

    core.info('commited the version with success!')
  }else{
    core.info('will not commit!')
  }

  core.setOutput('parsed-tag', parsedTag);
} catch (error) {
  core.setFailed(error.message);
}