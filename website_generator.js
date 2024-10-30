// loop over all markdown files in the sync folder
// and generate a website from them

// export enum ModelType {
// 	Note = 1,
// 	Folder = 2,
// 	Setting = 3,
// 	Resource = 4,
// 	Tag = 5,
// 	NoteTag = 6,
// 	Search = 7,
// 	Alarm = 8,
// 	MasterKey = 9,
// 	ItemChange = 10,
// 	NoteResource = 11,
// 	ResourceLocalState = 12,
// 	Revision = 13,
// 	Migration = 14,
// 	SmartFilter = 15,
// 	Command = 16,
// }

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const types = {
    '1': 'note',
    '2': 'folder',
    '3': 'setting',
    '4': 'resource',
    '5': 'tag',
    '6': 'noteTag',
    '7': 'search',
    '8': 'alarm',
    '9': 'masterKey',
    '10': 'itemChange',
    '11': 'noteResource',
    '12': 'resourceLocalState',
    '13': 'revision',
    '14': 'migration',
    '15': 'smartFilter',
    '16': 'command',
};

const md = new MarkdownIt('commonmark', {
    html: true,
});

const markdownFolder = path.join(__dirname, 'sync');
const websiteFolder = path.join(__dirname, 'public');

function generate_website_from_markdown_files() {

    const files = fs.readdirSync(markdownFolder);

    files.forEach(file => {
        // if file is not a markdown file, skip it
        if (!file.endsWith('.md')) return;
        const markdown = fs.readFileSync(path.join(markdownFolder, file), 'utf8');
        // loop backwards over the lines of the markdown file
        let markdownLines = markdown.split('\n');
        const meta = {};
        let cutOff = 0;
        for (let i = markdownLines.length - 1; i >= 0; i--) {
            cutOff = i;
            let kv = markdownLines[i].split(':');
            if (kv.length === 2) {
                meta[kv[0].trim()] = kv[1].trim();
            }
            if (kv.length === 1) {
                // return the rest of the lines
                break;
            }
        }
        markdownLines = markdownLines.slice(0, cutOff).join('\n');
        if (meta.type_ === '1') {
            
            // parse the markdown and generate an html file
            const result = md.render(markdownLines);
            const html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${file}</title>
                    </head>
                    <body>
                        ${result}
                    </body>
                </html>
            `;
            fs.writeFileSync(path.join(websiteFolder, file.replace('.md', '.html')), html);
        }
        
    }
    );
}

module.exports = {
    generate_website_from_markdown_files
};
