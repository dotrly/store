
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const INDEX_FILE = path.resolve('index.json');

async function publishDraftReleases() {
    console.log('🤖 Bot Publisher: Checking for Draft Releases to publish...');

    if (!fs.existsSync(INDEX_FILE)) {
        console.error('❌ index.json not found!');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    const apps = data.apps || [];

    for (const app of apps) {
        const bundleId = app.bundleId || app.id;
        const version = app.version;
        const tag = `${bundleId}-v${version}`;

        try {
            // Check release status
            const result = execSync(`gh release view "${tag}" --json isDraft,isPrerelease`, { stdio: 'pipe' }).toString();
            const { isDraft, isPrerelease } = JSON.parse(result);

            if (isDraft || isPrerelease) {
                console.log(`🚀 Promoting Release: ${tag} (Draft: ${isDraft}, Pre-release: ${isPrerelease})`);
                execSync(`gh release edit "${tag}" --draft=false --prerelease=false`, { stdio: 'inherit' });
                console.log(`✓ Published ${tag} as stable.`);
            }
        } catch (e) {
            // Release might not exist or error, simple ignore or debug log
            // console.debug(`Skipping ${tag}: ${e.message.split('\n')[0]}`);
        }
    }
    console.log('✨ All releases verified.');
}

publishDraftReleases();
