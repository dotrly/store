# Relay Store

> **API-Only Repository**: This repository is designed for automated ingestion via the Relay CLI. Manual edits to the catalog or app folders are strictly prohibited and will be automatically rejected. Please use `relay publish` for all submissions.

The official app repository for the Relay ecosystem. This repository manages app binaries, assets, and the master `index.json` catalog.

## How it Works (Seamless Publishing)

The Relay Store uses a modern, "Git-less" submission flow. Developers do not need to clone this repository or edit files manually. Our automated **Relay Bot** handles all cataloging and PR management.

### 1. Contribution Flow
1.  **Prepare Assets**: Manage your app's presence in a local `store/` folder (description, icon, screenshots).
2.  **Verify Permissions**: Run `relay build`. Our system auto-detects used APIs to ensure metadata accuracy.
3.  **Authentication**: Ensure you are logged into the GitHub CLI (`gh auth login`). 
    > **Identity Matching**: Your GitHub username MUST match the namespace in your bundle ID (e.g., `@jaseunda` for `com.jaseunda.app`).
4.  **Publish**: Run `relay publish` in your project root.
    *   **Automated Submission**: The CLI bundles your app and assets into a submission package.
    *   **Bot-Generated PR**: Our Bridge Service verifies your identity and uses the **Relay Bot** to open a Pull Request on this repo.

### 3. Technical Guidelines & Efficiency
Relay is designed for extreme efficiency. Our benchmarks show that complex professional tools are significantly leaner in Relay than on traditional platforms.
*   **100MB Guideline**: While our storage engine supports virtually unlimited capacity, we recommend keeping app bundles below **100MB** for optimal performance.
*   **Platform Efficiency**: A typical 800MB app from the traditional App Store often yields a functionally identical experience at only **~2MB** in Relay.

---

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
