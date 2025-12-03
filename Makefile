.PHONY: bump-patch bump-minor bump-major release

# Get current version from package.json
VERSION := $(shell node -p "require('./package.json').version")

# Bump patch version (1.0.0 -> 1.0.1)
bump-patch:
	@echo "Current version: $(VERSION)"
	@npm version patch --no-git-tag-version
	@NEW_VERSION=$$(node -p "require('./package.json').version") && \
		sed -i '' 's/"version": "$(VERSION)"/"version": "'$$NEW_VERSION'"/' manifest.json && \
		echo "Bumped to version: $$NEW_VERSION"

# Bump minor version (1.0.0 -> 1.1.0)
bump-minor:
	@echo "Current version: $(VERSION)"
	@npm version minor --no-git-tag-version
	@NEW_VERSION=$$(node -p "require('./package.json').version") && \
		sed -i '' 's/"version": "$(VERSION)"/"version": "'$$NEW_VERSION'"/' manifest.json && \
		echo "Bumped to version: $$NEW_VERSION"

# Bump major version (1.0.0 -> 2.0.0)
bump-major:
	@echo "Current version: $(VERSION)"
	@npm version major --no-git-tag-version
	@NEW_VERSION=$$(node -p "require('./package.json').version") && \
		sed -i '' 's/"version": "$(VERSION)"/"version": "'$$NEW_VERSION'"/' manifest.json && \
		echo "Bumped to version: $$NEW_VERSION"

# Create git tag and push it
release:
	@echo "Creating tag v$(VERSION)..."
	@git add package.json manifest.json
	@git commit -m "chore: bump version to $(VERSION)" || true
	@git tag -a "v$(VERSION)" -m "Release v$(VERSION)"
	@git push origin HEAD
	@git push origin "v$(VERSION)"
	@echo "Tag v$(VERSION) created and pushed!"

# Bump patch and create tag in one command
release-patch: bump-patch release

# Bump minor and create tag in one command
release-minor: bump-minor release

# Bump major and create tag in one command
release-major: bump-major release

