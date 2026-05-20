import { getInput, getBooleanInput, info, debug, setOutput, setFailed } from '@actions/core'
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'child_process';

try {
  const tag = getInput('tag')
  const packagePath = getInput('path')
  const commit = getBooleanInput('commit')
  const branchToPush = getInput('branch_to_push')

  const parsedTag = tag.replace('v', '')

  info(`Parsing tag ${tag} to ${parsedTag}!`)

  const packageString = readFileSync(packagePath, {
    encoding: 'utf-8',
  })

  const packageJson = JSON.parse(packageString)

  packageJson['version'] = parsedTag

  writeFileSync(packagePath, JSON.stringify(packageJson, undefined, 2))

  if (commit === true) {
    debug(
      execSync(
        `git config --global user.email "github-actions[bot]@users.noreply.github.com"`
      )
    )
    debug(execSync(`git config --global user.name "github-actions[bot]"`))

    debug(execSync(`git add .`))
    debug(
      execSync(`git commit -m "bump-version: bump version to '${parsedTag}'"`)
    )
    debug(
      execSync(
        `git push origin ${branchToPush} -f || git checkout -b ${branchToPush} && git push origin ${branchToPush}`
      )
    )

    info('commited the version with success!')
  } else {
    info('will not commit!')
  }

  setOutput('parsed-tag', parsedTag)
} catch (error) {
  setFailed(error.message)
}
