#!/bin/bash

# Check if at least one argument was provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 file1.mp4 [file2.mp4 ...]"
    exit 1
fi

# Loop through all arguments
for file in "$@"; do
    if [ -f "$file" ]; then
        # Define output filename
        output_file="${file%.mp4}_comp.mp4"
        echo "Compressing and removing audio from: $file"
        ffmpeg -i "$file" -b:v 1000k -an -strict -2 "$output_file"
    else
        echo "File not found: $file"
    fi
done
