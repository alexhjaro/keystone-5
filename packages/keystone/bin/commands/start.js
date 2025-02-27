const path = require('path');
const { executeDefaultServer, getEntryFileFullPath } = require('../utils');
const {
  DEFAULT_DIST_DIR,
  DEFAULT_PORT,
  DEFAULT_ENTRY,
  DEFAULT_CONNECT_TO,
} = require('../../constants');

module.exports = {
  // prettier-ignore
  spec: {
    '--port':       Number,
    '-p':           '--port',
    '--entry':      String,
    '--out':        String,
    '-o':           '--out',
    '--connect-to': String,
  },
  help: ({ exeName }) => `
    Usage
      $ ${exeName} start <dist> --port=3000

    Options
      --port, -p    Port to start on [${DEFAULT_PORT}]
      --entry       Entry file exporting keystone instance [${DEFAULT_ENTRY}]
      --connect-to  URI of database connection [${DEFAULT_CONNECT_TO}]
  `,
  exec: async (args, { exeName, _cwd = process.cwd() } = {}, spinner) => {
    process.env.NODE_ENV = 'production';

    const distDir = args._[1] || DEFAULT_DIST_DIR;

    spinner.text = 'Validating project entry file';
    const entryFile = await getEntryFileFullPath(args, { exeName, _cwd });
    spinner.succeed(`Validated project entry file ./${path.relative(_cwd, entryFile)}`);
    spinner.start(' ');
    return executeDefaultServer(args, entryFile, distDir, spinner);
  },
};
