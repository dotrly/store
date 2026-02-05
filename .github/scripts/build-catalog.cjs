
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const appsDir = path.resolve('apps');
const indexFile = path.resolve('index.json');
const sigFile = path.resolve('index.sig');
const signingKey = process.env.RELAY_STORE_SIGNING_KEY || '';

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

const indexRaw = JSON.stringify(catalog, null, 2);
fs.writeFileSync(indexFile, indexRaw);
console.log(`Wrote ${apps.length} apps to index.json`);

if (signingKey) {
    try {
        const signature = crypto.sign(null, Buffer.from(indexRaw), signingKey).toString('base64');
        fs.writeFileSync(sigFile, signature);
        console.log('Wrote index.sig (signed)');
    } catch (e) {
        console.error(`Failed to sign index.json: ${e.message}`);
    }
} else {
    console.warn('RELAY_STORE_SIGNING_KEY not set. index.json is unsigned.');
}
