#!/bin/bash

# - START SCRIPT FOR OPHELIA STORE BOT - \\

echo "[ - START - ] Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "[ - START - ] Build successful! Starting bot..."
    npm start
else
    echo "[ - ERROR - ] Build failed!"
    exit 1
fi
