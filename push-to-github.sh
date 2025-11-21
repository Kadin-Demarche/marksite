#!/bin/bash

# Script to push MarkSite to your GitHub repository

echo "🚀 MarkSite - GitHub Setup"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "❌ Git not initialized. Run: git init"
  exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " username

if [ -z "$username" ]; then
  echo "❌ Username cannot be empty"
  exit 1
fi

# Get repository name
read -p "Enter repository name (default: marksite): " repo
repo=${repo:-marksite}

echo ""
echo "📝 Updating package.json and README.md..."

# Update package.json
sed -i '' "s/yourusername/$username/g" package.json 2>/dev/null || sed -i "s/yourusername/$username/g" package.json

# Update README
sed -i '' "s/yourusername/$username/g" README.md 2>/dev/null || sed -i "s/yourusername/$username/g" README.md

echo "✓ Files updated"
echo ""
echo "🔗 Repository URL: https://github.com/$username/$repo"
echo ""
echo "Next steps:"
echo "1. Create a new repository at: https://github.com/new"
echo "   - Name: $repo"
echo "   - Don't initialize with README"
echo ""
echo "2. Run these commands:"
echo ""
echo "   git add ."
echo "   git commit -m 'Update repository URLs'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/$username/$repo.git"
echo "   git push -u origin main"
echo ""
echo "3. Add repository topics:"
echo "   static-site-generator, markdown, blog, github-pages, nodejs"
echo ""
echo "✨ Done! Your repository is ready to push."

