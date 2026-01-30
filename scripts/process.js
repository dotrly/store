import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_DIR = path.resolve(__dirname, '..');
const PUBLISH_DIR = path.join(STORE_DIR, 'publish');
const APPS_DIR = path.join(STORE_DIR, 'apps');
const ASSETS_DIR = path.join(STORE_DIR, 'assets');
const INDEX_FILE = path.join(STORE_DIR, 'index.json');

function processStore() {
    console.log('Processing Store Submission...');

    if (!fs.existsSync(PUBLISH_DIR)) {
        console.log('No publish directory found.');
        return;
    }

    const submissions = fs.readdirSync(PUBLISH_DIR).filter(f => {
        return fs.statSync(path.join(PUBLISH_DIR, f)).isDirectory();
    });

    if (submissions.length === 0) {
        console.log('No new submissions to process.');
        return;
    }

    const indexData = fs.existsSync(INDEX_FILE) ? JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')) : { version: "1.0", apps: [] };
    const apps = indexData.apps;

    for (const bundleId of submissions) {
        console.log(`Processing ${bundleId}...`);
        const subDir = path.join(PUBLISH_DIR, bundleId);
        const manifestPath = path.join(subDir, 'manifest.json');

        if (!fs.existsSync(manifestPath)) {
            console.error(`Missing manifest.json for ${bundleId}`);
            continue;
        }

        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const category = manifest.category || 'Utilities';
        const version = manifest.version || '1.0.0';

        // 1. Move App Bundle
        const targetAppDir = path.join(APPS_DIR, category, bundleId);
        fs.mkdirSync(targetAppDir, { recursive: true });

        const bundlePath = path.join(subDir, 'app.rly');
        if (fs.existsSync(bundlePath)) {
            fs.copyFileSync(bundlePath, path.join(targetAppDir, `${version}.rly`));
            fs.copyFileSync(bundlePath, path.join(targetAppDir, `latest.rly`));
            manifest.sizeBytes = fs.statSync(bundlePath).size;
            manifest.downloadUrl = `https://raw.githubusercontent.com/dotrly/store/main/apps/${category}/${bundleId}/latest.rly`;
        }

        // 2. Move Assets
        const targetAssetDir = path.join(ASSETS_DIR, bundleId);
        fs.mkdirSync(targetAssetDir, { recursive: true });

        const files = fs.readdirSync(subDir);
        for (const file of files) {
            if (file.startsWith('icon.')) {
                fs.copyFileSync(path.join(subDir, file), path.join(targetAssetDir, file));
                manifest.iconUrl = `https://raw.githubusercontent.com/dotrly/store/main/assets/${bundleId}/${file}`;
            }
        }

        // 3. Update Index Entry
        const existingIndex = apps.findIndex(a => a.bundleId === bundleId || a.id === bundleId);
        const appEntry = { ...manifest, bundleId };

        if (existingIndex > -1) {
            apps[existingIndex] = { ...apps[existingIndex], ...appEntry };
        } else {
            apps.push(appEntry);
        }

        // 4. Cleanup
        fs.rmSync(subDir, { recursive: true, force: true });
        console.log(`✓ ${bundleId} processed and cleaned.`);
    }

    fs.writeFileSync(INDEX_FILE, JSON.stringify({ version: "1.0", apps }, null, 2));
    console.log('Store index updated successfully.');
}

processStore();
