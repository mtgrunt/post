#!/bin/bash
# Remove CRLF and replace with LF in all text files
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.toml" -o -name "*.json" \) -exec dos2unix {} \; 2>/dev/null || echo "Note: dos2unix not installed, trying alternative method..."

# Alternative method if dos2unix is not available
if ! command -v dos2unix &> /dev/null; then
    echo "Using sed to convert line endings..."
    find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.toml" -o -name "*.json" \) -exec sed -i 's/\r$//' {} \;
fi

echo "Line endings normalized!"
