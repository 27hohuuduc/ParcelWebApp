import { program } from 'commander';
import intro from './intro';
import log from './log';
import fs from 'fs';
import pkg, { GitHubTreeUrl } from './env';

//intro()

program
  .name(pkg.displayName)
  .description(pkg.description)
  .version(pkg.version)
  .option('-ts, --typescript', 'Apply TypeScript pattern. (default is Javascript)', false)
  .option('-e, --eslint', 'Apply ESLint configuration. (default no)', false)
  .option('-f, --full-source', 'In Developing', false);

program.parse()

const opts = program.opts()

async () => {
    const result = await fetch(GitHubTreeUrl).then(res => res.text())
    console.log(result)
  }


// try {
//   fs.cpSync(__dirname + "/template", process.cwd(), { recursive: true })
// } catch (error) {
//   log("Unable to initialize resource")
// }
