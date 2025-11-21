#!/bin/bash

# MarkSite Test Script
# Tests the basic functionality of MarkSite

echo "🧪 Testing MarkSite..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_command() {
    echo -n "Testing: $1... "
    if eval "$2" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
}

# Test 1: Check Node.js is installed
test_command "Node.js installed" "node --version"

# Test 2: Check dependencies can be installed
echo -n "Testing: npm install... "
if npm install > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 3: Check CLI executable exists
test_command "CLI executable exists" "test -f bin/marksite.js"

# Test 4: Check src files exist
test_command "Builder exists" "test -f src/builder.js"
test_command "Server exists" "test -f src/server.js"
test_command "Markdown parser exists" "test -f src/markdown.js"
test_command "Template renderer exists" "test -f src/template.js"
test_command "SEO module exists" "test -f src/seo.js"
test_command "Utils exists" "test -f src/utils.js"

# Test 5: Check theme files exist
test_command "Theme layout exists" "test -f themes/default/layout.ejs"
test_command "Theme index exists" "test -f themes/default/index.ejs"
test_command "Theme post exists" "test -f themes/default/post.ejs"
test_command "Theme page exists" "test -f themes/default/page.ejs"

# Test 6: Check documentation exists
test_command "README exists" "test -f README.md"
test_command "QUICKSTART exists" "test -f QUICKSTART.md"
test_command "USAGE_GUIDE exists" "test -f USAGE_GUIDE.md"
test_command "DEPLOYMENT exists" "test -f DEPLOYMENT.md"
test_command "FEATURES exists" "test -f FEATURES.md"

# Test 7: Create test site
echo -n "Testing: Creating test site... "
TEST_DIR="test-site-$$"
if node src/index.js init "$TEST_DIR" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
    
    # Test 8: Check test site structure
    test_command "Test site content dir" "test -d $TEST_DIR/content"
    test_command "Test site public dir" "test -d $TEST_DIR/public"
    test_command "Test site themes dir" "test -d $TEST_DIR/themes"
    test_command "Test site config" "test -f $TEST_DIR/config.yml"
    
    # Test 9: Build test site
    echo -n "Testing: Building test site... "
    cd "$TEST_DIR"
    if node ../src/index.js build > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        
        # Test 10: Check build output
        test_command "Build output exists" "test -d _site"
        test_command "Index page exists" "test -f _site/index.html"
        test_command "Sitemap exists" "test -f _site/sitemap.xml"
        test_command "RSS feed exists" "test -f _site/feed.xml"
        test_command "Robots.txt exists" "test -f _site/robots.txt"
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
    
    cd ..
    
    # Cleanup
    echo -n "Cleaning up test site... "
    rm -rf "$TEST_DIR"
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Summary
echo ""
echo "================================"
echo "Test Results:"
echo "================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✨${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed.${NC}"
    exit 1
fi

