
const fs = require('fs');
const path = require('path');

const appsDir = path.resolve('apps');
const indexFile = path.resolve('index.json');

if (!fs.existsSync(appsDir)) {
    // If apps dir doesn't exist (fresh start), create it
    fs.mkdirSync(appsDir, { recursive: true });
}

const appFiles = fs.readdirSync(appsDir).filter(f => f.endsWith('.json'));
const apps = [];

console.log(`Found ${appFiles.length} app files. Building catalog...`);

for (const file of appFiles) {
    try {
        const content = fs.readFileSync(path.join(appsDir, file), 'utf8');
        const app = JSON.parse(content);
        apps.push(app);
    } catch (e) {
        console.error(`Error parsing ${file}: ${e.message}`);
    }
}

const catalog = {
    version: "1.0",
    apps: apps
};

fs.writeFileSync(indexFile, JSON.stringify(catalog, null, 2));
console.log(`Wrote ${apps.length} apps to index.json`);
