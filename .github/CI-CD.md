# 🚀 CI/CD Pipeline Documentation

This project includes a comprehensive GitHub Actions pipeline for building, testing, and publishing the VS Code extension.

## 🔄 Workflows

### 1. Build and Package (`build.yml`)

**Triggers:** Push to main branches, pull requests, releases

**Features:**

- ✅ Multi-platform testing (Node.js 18.x & 20.x)
- 🏗️ Build verification using Bun
- 📦 VSIX package generation
- 🔍 TypeScript type checking
- 📤 Artifact upload for downloads
- 🚀 Automatic release asset upload
- 🌐 Marketplace publishing (on releases)

### 2. Testing (`test.yml`)

**Triggers:** Push to main branches, pull requests

**Features:**

- 🧪 Cross-platform testing (Ubuntu, Windows, macOS)
- 📋 Dependency caching for faster builds
- 🔍 Type checking validation
- 📦 VSIX packaging verification

### 3. Dependency Updates (`update-dependencies.yml`)

**Triggers:** Weekly schedule (Mondays 9 AM UTC), manual trigger

**Features:**

- 🔄 Automatic dependency updates
- 🏗️ Build verification after updates
- 📝 Automated pull request creation

## 🔧 Setup Requirements

### Secrets Configuration

For publishing to the VS Code Marketplace, add these secrets to your repository:

1. **`VSCE_PAT`** - Personal Access Token from Visual Studio Marketplace
   - Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
   - Generate a new Personal Access Token with **Marketplace (Manage)** scope
   - Add it as a repository secret

### Environment Protection

The publishing job uses a `marketplace` environment for additional security. Set up branch protection rules:

1. Go to Settings → Environments → Create `marketplace` environment
2. Add required reviewers for release approvals
3. Restrict to protected branches only

## 📦 Local Development

### Building

```bash
bun install
bun run build
```

### Packaging

```bash
bun run package
```

### Type Checking

```bash
bun run type-check
```

### Cleaning

```bash
bun run clean
```

## 🏷️ Release Process

1. Update version in `package.json`
2. Create a new release on GitHub
3. Pipeline automatically builds and publishes to marketplace
4. VSIX file is attached to the release

## 📊 Artifacts

- **VSIX Package**: Available for download from workflow runs
- **Build Output**: TypeScript compiled files and source maps
- **Release Assets**: VSIX files attached to GitHub releases

## 🔍 Troubleshooting

### Build Failures

- Check TypeScript compilation errors
- Verify all dependencies are properly installed
- Ensure Bun build script executes successfully

### Packaging Issues

- Review `.vscodeignore` file
- Check extension manifest (`package.json`)
- Verify entry point exists in `dist/extension.js`

### Publishing Problems

- Confirm `VSCE_PAT` secret is set correctly
- Check publisher name matches marketplace account
- Verify extension passes marketplace validation
