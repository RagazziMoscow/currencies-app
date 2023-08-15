const path  = require("path");
const fs = require("fs");
const { argv } = require("yargs");

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = path.join(__dirname, "/../", "src/environments");
const targetFile = `environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   apiKey: "${process.env.API_KEY}"
};
`;
const isDirectoryExists = fs.existsSync(targetPath);

if (!isDirectoryExists) {
  fs.mkdirSync(targetPath);
}

// write the content to the respective file
fs.writeFile(path.join(targetPath, targetFile), environmentFileContent, function (err) {
  if (err) {
    console.log(err);
  }

  console.log(`Wrote variables to ${targetFile}`);
});
