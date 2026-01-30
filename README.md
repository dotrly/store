# Relay Store

The official app repository for the Relay ecosystem. This repository manages app binaries, assets, and the master `index.json` catalog.

## How it Works (Automated GitOps)

This store uses an automated ingestion pipeline. Developers do not edit `index.json` directly. Instead, they submit apps to the `publish/` folder, and our automation handles the rest.

### 1. Contribution Flow
1. **Develop**: Build your app using the Relay SDK.
2. **Package**: Run `relay publish` in your app directory.
    *   **Naming Policy**: Your bundle ID must follow the pattern `com.[github-username].[app-name]`.
    *   *Example*: `com.jaseunda.terminal`
3. **Submit**: Open a Pull Request adding your folder to the `publish/` directory.

### 2. Automated Processing
When a PR is merged into `main`, a GitHub Action runs the `scripts/process.js` script which:
*   **Validates**: Checks that the bundle ID matches the required pattern. Non-compliant submissions are automatically rejected.
*   **Organizes**: Moves files from `publish/` to the permanent `apps/` and `assets/` directories.
*   **Updates Catalog**: Automatically updates the master `index.json` with your app's metadata.
*   **Cleanup**: Deletes the source `publish/` folder to keep the repo clean.

## Directory Structure
*   `publish/`: Staging area for new submissions (cleared automatically).
*   `apps/`: Permanent storage for `.rly` bundles, organized by category.
*   `assets/`: Icons and screenshots for the Store UI.
*   `scripts/`: Automation scripts (e.g., `process.js`).
*   `index.json`: The authoritative catalog used by the Relay Shell.

## Verification & Security
All apps submitted via the `publish/` folder undergo:
1. **Header Validation**: Ensuring the binary matches the manifest.
2. **Permission Check**: Verifying that declared permissions match the code's auto-detected requirements.
3. **Sandbox Enforcement**: Apps are encrypted and run in the Relay secure runtime.

## Contributing
We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed instructions on how to submit apps and improve the store.

## License
The store infrastructure is licensed under MIT. Individual apps are subject to the licenses specified by their respective creators. 

See [LICENSE](./LICENSE) for full details.

---
*Built for the next generation of professional tools.*
