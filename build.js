const fs = require("fs");
const slugify = require('slugify');

const MarkdownIt = require("markdown-it"),
    md = new MarkdownIt("commonmark", {
        html: true
    });

const syncPath = 'sync/';
const metaString = /^id: [a-z0-9]{32}/;
const splitProp = /:(.*)$/s

const websiteStructure = {};

const tags = {};

const tagLinks = []

const nodeTypes = {
    '1': 'note',
    '2': 'icon',
    '4': 'image',
    '5': 'tag',
    '6': 'tag-link',
    '13': 'diff'
}

function parseJoplin(note) {
    const meta = {};
    let metaStarted = false;
    let content = "";
    let title = "";
    note.split("\n").forEach((line) => {
        const matches = line.match(metaString);
        if (matches) metaStarted = true;
        if (metaStarted) {
            let props = line.split(splitProp);
            meta[props[0].trim()] = props[1].trim();
        } else {
            if (title === "") title = line;    
            content += line + "\n";
        }
    });
    meta.content = content;
    websiteStructure[meta.id] = meta;
}

fs.readdir(syncPath, {withFileTypes: true}, function (err, files) {
    files.forEach((file) => {
        if (!file.isFile()) return;
        const fileContent = fs.readFileSync(`${syncPath}${file.name}`, {encoding: 'utf-8'});
        parseJoplin(fileContent);
    });
    
    for (let id in websiteStructure) {
        const node = websiteStructure[id];

        switch (nodeTypes[node['type_']]) {
            case 'diff':
                break;
            case 'icon':
                break;
            case 'image':
                break;
            case 'note':
                break;
            case 'tag':
                tags[node.id] = node.content.trim();
                break;
            case 'tag-link':
                tagLinks.push(node)
                break;                    
        }
    }

    tagLinks.forEach((link) => {
        if (!websiteStructure[link.note_id].tags) {
            websiteStructure[link.note_id].tags = [];
        }
        websiteStructure[link.note_id].tags.push(tags[link.tag_id]);
    });

    for (let id in websiteStructure) {
        const node = websiteStructure[id];
        if (node['type_'] === '1') {
            if (node.tags) {
                let content = node.content.split(/\n(.*)/s);
                
                const filename = slugify(content[0], {
                    replacement: '_',
                    lower: true,
                    strict: true
                });
                fs.writeFileSync(`public/${filename}.html`, md.render(content[1]), {type:'utf8'});
            }
        }
    }
});