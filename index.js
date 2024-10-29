const app = require("./sync_app.js");

const webGenerator = require("./website_generator.js");
webGenerator.generate_website_from_markdown_files();


app();