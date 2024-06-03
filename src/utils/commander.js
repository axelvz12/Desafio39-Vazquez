const { Command } = require('commander');

const program = new Command();

program
  .option('--mode <mode>', 'especificación de entorno', 'production')
  .parse(process.argv);

module.exports = { program };