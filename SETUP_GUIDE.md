# 🛠️ Initial Setup Guide for @sanphandinh/vn-lunar

This guide will help you set up the automated npm publishing workflow for your Vietnamese Lunar Calendar library.

## 📋 Prerequisites

- ✅ GitHub repository already exists
- ✅ NPM account created
- ✅ Admin access to the GitHub repository
- ✅ **pnpm** installed locally (`npm install -g pnpm`)

## 🎯 Step 1: Generate NPM Token

### 1.1 Login to NPM
```bash
npm login
```

### 1.2 Generate Automation Token
1. Go to [NPM Account Settings](https://www.npmjs.com/settings)
2. Click on **"Access Tokens"**
3. Click **"Generate New Token"**
4. Select **"Automation"** as token type
5. Give it a descriptive name (e.g., "vn-lunar-github-actions")
6. Copy the generated token immediately (you won't see it again!)

## 🔐 Step 2: Add GitHub Repository Secrets

### 2.1 Navigate to Repository Settings
1. Go to your GitHub repository: https://github.com/sanphandinh/vn-lunar
2. Click on **Settings** tab
3. In the left sidebar, click on **"Secrets and variables"** → **"Actions"**

### 2.2 Add NPM Token
1. Click **"New repository secret"**
2. Name: `NPM_TOKEN`
3. Secret: Paste your NPM automation token
4. Click **"Add secret"**

### 2.3 Verify Secrets
You should now see:
- **NPM_TOKEN** (your npm automation token)
- **GITHUB_TOKEN** (automatically provided by GitHub)

## ✅ Step 3: Verify Setup

### 3.1 Test Package Contents
```bash
# In your local repository
pnpm run build
pnpm pack  # Creates tarball and shows what will be published
# Verify the output shows expected files, then clean up
rm *.tgz
```

### 3.2 Create Test Release Branch
```bash
# Create a test release for version 1.0.1
git checkout -b release/1.0.1

# Make a small change (e.g., update README)
echo "# Test change" >> README.md

# Commit and push
git add README.md
git commit -m "chore: test release setup"
git push origin release/1.0.1
```

### 3.3 Create Test Pull Request
1. Go to GitHub repository
2. Click **"Compare & pull request"** for your new branch
3. Create PR against `main` branch
4. Add description like "Testing automated release setup"
5. **DO NOT MERGE YET** - wait for verification

### 3.4 Check GitHub Actions
1. Go to **Actions** tab in your repository
2. You should see workflows running:
   - **Build and Test** (on every push)
   - **Release and Publish to NPM** (only when PR is merged and starts with `release/`)

## 🚀 Step 4: First Real Release (Optional)

### 4.1 If Test Looks Good
If the workflows are running successfully:
1. Merge the test PR
2. The release workflow should automatically:
   - Update version to 1.0.1
   - Publish to npm
   - Create GitHub Release
   - Comment on the PR

### 4.2 Verify Published Package
Check if your package appears at: https://www.npmjs.com/package/@sanphandinh/vn-lunar

## 🔧 Step 5: Configure Local NPM (Optional)

### 5.1 Login Locally
```bash
npm login
# Enter your npm credentials
```

### 5.2 Verify Package Info
```bash
npm view @sanphandinh/vn-lunar
```

### 5.3 Test Local Development with pnpm
```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build project
pnpm build
```

## 📋 Troubleshooting

### Common Issues

#### 1. NPM Token Not Working
```
Error: 403 Forbidden - You do not have permission to publish @sanphandinh/vn-lunar
```
**Solution**:
- Verify NPM token has correct permissions
- Ensure you're logged into the correct NPM account that owns the scoped package
- Check if package name is available

#### 2. GitHub Actions Not Triggering
```
No workflows running after PR creation
```
**Solution**:
- Verify branch name starts with `release/`
- Check that PR is targeting the `main` branch
- Ensure PR is merged (not just opened)

#### 3. Build Failures
```
npm run build fails in CI but works locally
```
**Solution**:
- Run `npm ci` instead of `npm install` locally to test
- Check Node.js version compatibility
- Verify all dependencies are in package.json

#### 4. Version Conflicts
```
Error: Version X.Y.Z already exists
```
**Solution**:
- Use a different version number
- Check existing tags: `git tag`
- Check npm registry: `npm view @sanphandinh/vn-lunar versions --json`

#### 5. pnpm Lockfile Issues
```
ERR_PNPM_NO_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is absent
```
**Solution**:
- Regenerate lockfile: `rm pnpm-lock.yaml && pnpm install`
- Check pnpm version compatibility
- Ensure lockfile is committed to git

### Recovery Commands
```bash
# Reset to a known good state
git checkout main
git branch -D release/X.Y.Z

# Remove local tags (if needed)
git tag -d vX.Y.Z
git push origin --delete vX.Y.Z

# Unpublish a broken version (emergency only)
npm unpublish @sanphandinh/vn-lunar@X.Y.Z --force
```

## 📚 Additional Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)

### Best Practices
- Always test release branches locally
- Use conventional commit messages for semantic releases
- Keep CHANGELOG.md updated for major/minor releases
- Monitor releases for any issues

### Security
- Never commit NPM tokens to your repository
- Use automation tokens with minimal required permissions
- Rotate tokens periodically for security

---

## 🎉 Setup Complete!

Once you've completed these steps, your repository is ready for automated npm publishing. Here's what happens next:

1. **Every Push**: Tests run automatically
2. **PR Merged with `release/` branch**: Package is published to npm
3. **Normal commits to main**: Semantic release handles patch versions
4. **Monitoring**: Check Actions tab for real-time status

For detailed release workflows, see [RELEASE_GUIDE.md](./RELEASE_GUIDE.md).

Need help? Check:
- 🐛 [GitHub Issues](https://github.com/sanphandinh/vn-lunar/issues)
- 💬 [GitHub Discussions](https://github.com/sanphandinh/vn-lunar/discussions)