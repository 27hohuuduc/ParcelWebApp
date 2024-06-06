import { program } from 'commander';

const log = (...data: string[]): void => { console.log(...data); };

/*log(` ____                                    ___       ______                               ___              __              
/\\  _\`\\                                 /\\_ \\     /\\__  _\\                             /\\_ \\            /\\ \\__           
\\ \\ \\L\\ \\   __      _ __    ___      __ \\//\\ \\    \\/_/\\ \\/    ___     ___ ___    _____ \\//\\ \\     ____  \\ \\ ,_\\     __   
 \\ \\ ,__/ /'__\`\\   /\\\`'__\\ /'___\\  /'__\`\\ \\ \\ \\      \\ \\ \\  / '__\`\\ /' __\` __\`\\ /\\ '__\`\\ \\ \\ \\  / /'__\`\\ \\ \\ \\/   /'__\`\\ 
  \\ \\ \\/ /\\ \\L\\.\\_ \\ \\ \\/ /\\ \\__/ /\\  __/  \\_\\ \\_     \\ \\ \\ /\\  __/ /\\ \\/\\ \\/\\ \\\\ \\ \\L\\ \\ \\_\\ \\_\\ \\ \\L\\.\\_\\ \\ \\_ /\\  __/ 
   \\ \\_\\ \\ \\__/.\\_\\ \\ \\_\\ \\ \\____\\\\ \\____\\ /\\____\\     \\ \\_\\\\ \\____\\\\ \\_\\ \\_\\ \\_\\\\ \\ ,__/ /\\____\\\\ \\__/.\\_\\\\ \\__\\\\ \\____\\
    \\/_/  \\/__/\\/_/  \\/_/  \\/____/ \\/____/ \\/____/      \\/_/ \\/____/ \\/_/\\/_/\\/_/ \\ \\ \\   \\/____/ \\/__/\\/_/ \\/__/ \\/____/
                                                                                   \\ \\_\\                                      
                                                                                    \\/_/                                      `)*/


program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();