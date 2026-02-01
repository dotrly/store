import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_DIR = path.resolve(__dirname, '..');
const PUBLISH_DIR = path.join(STORE_DIR, 'publish');
// const APPS_DIR = path.join(STORE_DIR, 'apps'); // DEPRECATED: Storage moved to Releases
// const ASSETS_DIR = path.join(STORE_DIR, 'assets'); // DEPRECATED: Storage moved to Releases
const INDEX_FILE = path.join(STORE_DIR, 'index.json');

// RESERVED NAMESPACES
const RESERVED = ['com.relay', 'com.dotrly'];

function isValidBundleId(id) {
    // Pattern: com.[github-username].[app-name]
    const pattern = /^com\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/;
    if (!pattern.test(id)) return false;

    // Ownership Verification:
    // In CI, we check if the person submitting the PR matches the bundleId owner.
    const actor = process.env.GITHUB_ACTOR;
    const owner = id.split('.')[1];

    if (actor && owner && actor !== owner && !['dotrly', 'relay-bot'].includes(actor)) {
        console.warn(`⚠️ Warning: Actor "${actor}" does not match owner "${owner}" for bundle ID "${id}"`);
    }

    return true;
}

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
        console.log(`Checking ${bundleId}...`);

        // 1. Validate Bundle ID Pattern
        if (!isValidBundleId(bundleId)) {
            console.error(`❌ DENIED: Bundle ID "${bundleId}" does not follow the required pattern com.[github-username].[app-name]`);
            // fs.rmSync(path.join(PUBLISH_DIR, bundleId), { recursive: true, force: true });
            continue;
        }

        const subDir = path.join(PUBLISH_DIR, bundleId);
        const manifestPath = path.join(subDir, 'manifest.json');

        if (!fs.existsSync(manifestPath)) {
            console.error(`❌ Missing manifest.json for ${bundleId}`);
            continue;
        }

        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        // Ensure manifest ID matches folder name
        if (manifest.id !== bundleId && manifest.bundleId !== bundleId) {
            console.error(`❌ DENIED: Manifest ID does not match submission folder name "${bundleId}"`);
            continue;
        }

        const category = manifest.category || 'Utilities';
        const version = manifest.version || '1.0.0';

        // 2. [SIMULATED] Move App Bundle to GitHub Release
        // In production, this would upload the file to `gh release create <tag> ...`
        const bundlePath = path.join(subDir, 'app.rly');
        if (fs.existsSync(bundlePath)) {
            // RELEASE STRATEGY: One release per app version
            // Tag: com.user.app-v1.0.0
            const releaseTag = `${bundleId}-v${version}`;

            console.log(`[CDN] Creating Release "${releaseTag}"...`);
            console.log(`[CDN] Uploading app.rly to Release "${releaseTag}"...`);

            manifest.sizeBytes = fs.statSync(bundlePath).size;
            manifest.downloadUrl = `https://github.com/dotrly/store/releases/download/${releaseTag}/app.rly`;
        }

        // 3. [SIMULATED] Move Assets to GitHub Release
        const files = fs.readdirSync(subDir);
        for (const file of files) {
            if (file.startsWith('icon.')) {
                console.log(`[CDN] Uploading ${file} to GitHub Release...`);
                // RELEASE URL FORMAT: https://github.com/dotrly/store/releases/download/com.user.app-v1.0.0/icon.png
                manifest.iconUrl = `https://github.com/dotrly/store/releases/download/${bundleId}-v${version}/${file}`;
            }

            if (file === 'screenshots' && fs.statSync(path.join(subDir, file)).isDirectory()) {
                const screenshotFiles = fs.readdirSync(path.join(subDir, file));
                manifest.screenshots = [];
                for (const screenshot of screenshotFiles) {
                    console.log(`[CDN] Uploading screenshot ${screenshot} to GitHub Release...`);
                    manifest.screenshots.push(`https://github.com/dotrly/store/releases/download/${bundleId}-v${version}/${screenshot}`);
                }
            }
        }

        // 4. Update Index Entry
        const existingIndex = apps.findIndex(a => a.bundleId === bundleId || a.id === bundleId);
        const appEntry = { ...manifest, bundleId };

        if (existingIndex > -1) {
            // Update existing
            apps[existingIndex] = { ...apps[existingIndex], ...appEntry };
            console.log(`✓ ${bundleId} updated.`);
        } else {
            // Add new
            apps.push(appEntry);
            console.log(`✓ ${bundleId} added.`);
        }

        // 5. Cleanup
        fs.rmSync(subDir, { recursive: true, force: true });
    }

    fs.writeFileSync(INDEX_FILE, JSON.stringify({ version: "1.0", apps }, null, 2));
    console.log('Store index updated successfully.');
}

processStore();
