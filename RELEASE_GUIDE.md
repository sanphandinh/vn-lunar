# 🚀 Release Guide for @sanphandinh/vn-lunar

This guide explains the automated release process for publishing the Vietnamese Lunar Calendar library to NPM.

## 📋 Overview

We use a sophisticated automated release system that supports multiple publishing strategies:

1. **PR-Based Releases** (Recommended for major/minor versions)
2. **Semantic Releases** (Recommended for patch versions)
3. **Manual Releases** (Emergency releases only)

## 🔄 PR-Based Release Process (Recommended)

### Step 1: Create a Release Branch
```bash
# For version 1.1.0
git checkout -b release/1.1.0
```

### Step 2: Make Your Changes
- Add your features or bug fixes
- Update changelog if needed
- Ensure all tests pass

### Step 3: Create Pull Request
- Push your release branch
- Create a PR against `main` branch
- The PR title should be descriptive (optional)
- Include detailed description of changes

### Step 4: Automagic Happens! 🪄
Once the PR is merged:
1. ✅ CI/CD pipeline runs automatically
2. ✅ Version is extracted from branch name (`release/1.1.0`)
3. ✅ Package.json is updated
4. ✅ Git tag is created (`v1.1.0`)
5. ✅ Package is published to NPM
6. ✅ GitHub Release is created
7. ✅ Success comment is posted on PR

## 🤖 Semantic Release Process (For Patch Versions)

### Automatic Patch Releases
Semantic release automatically handles patch versions when:
- Commits follow conventional commit format
- No release branch is used
- Changes are merged directly to main

### Commit Message Format
```bash
# Features (minor version)
git commit -m "feat: add new Vietnamese festival detection"

# Bug fixes (patch version)
git commit -m "fix: resolve leap month calculation error"

# Breaking changes (major version)
git commit -m "feat!: redesign LunarCalendar API"
```

### Automatic Process
1. 📝 Commit analysis determines version bump
2. 📦 Changelog is generated
3. 🏷️ Git tag is created
4. 📤 Package is published to NPM
5. 📋 GitHub Release is created

## 📦 Publishing Requirements

### Repository Secrets (Setup Required)
Before releases work, you need to configure these secrets in your GitHub repository:

1. **NPM_TOKEN**
   - Get from [NPM Account Settings](https://www.npmjs.com/settings)
   - Generate a new automation token
   - Add as repository secret with `read` and `publish` permissions

2. **GITHUB_TOKEN** (Automatically provided)
   - No setup required - GitHub provides this

### Package Configuration
Your package.json is already configured:
```json
{
  "name": "@sanphandinh/vn-lunar",
  "publishConfig": {
    "access": "public"
  }
}
```

## 🎯 Version Management Strategy

### Version Numbering
- **Major (X.0.0)**: Breaking changes, API redesigns
- **Minor (X.Y.0)**: New features, enhancements
- **Patch (X.Y.Z)**: Bug fixes, minor improvements

### Recommended Strategy
1. **Major/Minor**: Use PR-based releases (`release/X.Y.0`)
2. **Patch**: Use semantic releases (conventional commits)
3. **Emergency**: Manual releases (rare cases)

### Example Workflow
```bash
# Adding a new feature (minor version)
git checkout -b release/1.2.0
# ... make changes ...
git push origin release/1.2.0
# Create PR, merge when ready

# Fixing a bug (patch version)
git checkout main
# ... fix bug ...
git commit -m "fix: resolve date validation edge case"
git push origin main
# Automatic semantic release handles the rest
```

## 🧪 Pre-Release Validation

### Automated Checks
Every release pipeline runs:
- ✅ TypeScript compilation (`npm run type-check`)
- ✅ All tests (`npm run test:coverage`)
- ✅ Build process (`npm run build`)
- ✅ Package integrity validation

### Manual Validation
Before creating a release branch:
```bash
# Full validation
npm run pre-checks
npm run build
npm pack --dry-run  # Preview package contents
```

## 📊 Release Tracking

### Where to Find Releases
- **NPM Package**: https://www.npmjs.com/package/@sanphandinh/vn-lunar
- **GitHub Releases**: https://github.com/sanphandinh/vn-lunar/releases
- **Release Workflow**: Actions tab in GitHub

### Monitoring
- GitHub Actions provides real-time release status
- Success/failure notifications via GitHub
- NPM automatically updates package version

## 🚨 Troubleshooting

### Common Issues

#### NPM Authentication Error
```bash
Error: ENEEDAUTH: This command requires you to be logged in
```
**Solution**: Check that `NPM_TOKEN` secret is correctly configured

#### Build Failure
```bash
Error: TypeScript compilation failed
```
**Solution**: Check CI logs, fix type errors, run `npm run type-check` locally

#### Version Conflict
```bash
Error: Version X.Y.Z already exists
```
**Solution**: Use a new version number or check existing tags/releases

#### NPM Publish Failure
```bash
Error: 403 Forbidden - You do not have permission
```
**Solution**: Verify NPM token has correct permissions for scoped package

### Manual Recovery
If automated release fails:
1. 🛑 Stop any in-progress releases
2. 🔍 Identify and fix the issue
3. 🔄 Manually complete the release if needed:
   ```bash
   npm version X.Y.Z
   npm run build
   npm publish --access public
   git push --follow-tags
   ```

## 📝 Best Practices

### Before Release
- [ ] All tests passing locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for major/minor releases)
- [ ] Version follows semantic versioning
- [ ] Package.json fields are correct

### Release Process
- [ ] Use descriptive commit messages
- [ ] Include detailed PR descriptions
- [ ] Test release branch locally
- [ ] Monitor GitHub Actions during release

### Post-Release
- [ ] Verify package appears on NPM
- [ ] Check GitHub Release creation
- [ ] Update any dependent projects
- [ ] Monitor for any reported issues

## 🆘 Getting Help

### Resources
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)

### Contact
- 🐛 **Issues**: [GitHub Issues](https://github.com/sanphandinh/vn-lunar/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/sanphandinh/vn-lunar/discussions)
- 📧 **Maintainer**: sanphan.dinh@example.com

---

**Happy Releasing! 🚀**

Remember: Automated releases save time but require proper setup and monitoring. Always test thoroughly before merging release branches.