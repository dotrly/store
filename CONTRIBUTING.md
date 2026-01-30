# Contributing to Relay Store

Thank you for your interest in contributing to the Relay Store! This repository manages the app catalog for the Relay ecosystem.

## How to Contribute Apps

The Relay Store uses an automated GitOps workflow. You do not need to manually edit `index.json`.

### 1. Build & Package
In your app's root directory, run:
```bash
relay publish
```
This will:
- Validate your `.rly` bundle.
- Create a submission folder in `store/publish/[your-bundle-id]`.
- Generate a `manifest.json` with your app's metadata.

### 2. Submit a Pull Request
1. Fork this repository.
2. Add your `publish/[bundle-id]` folder to your fork.
3. Open a Pull Request to the `main` branch.

### 3. Automated Processing
Once your PR is merged, or pushed to `main`, our GitHub Action will:
- Move your app and assets to their permanent locations.
- Automatically update the central `index.json` catalog.
- Clean up the `publish/` directory.

## Bug Reports & Improvements
If you find an issue with the store scripts or documentation:
1. Open a GitHub Issue describing the bug or suggestion.
2. If you have a fix, feel free to open a PR.

## Security
If you discover a malicious app in the store or a security vulnerability in the scripts, please report it immediately via the **Security** tab or by opening a high-priority issue.

---
*Thank you for being part of the Relay community!*
