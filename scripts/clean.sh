#!/bin/bash
shopt -s globstar
for file in ./**/*
do
    # check if the filename ends with .js or .js.map or .d.ts
    if [[ $file == *".js"* || $file == *".js.map"* || $file == *".d.ts"* ]]
    then
        if [[ $file == *".json"* || $file == *"node_modules"* ]]
        then
            # skip json files
            continue
        fi
        rm $file
        # remove the file
        echo "Removed $file"
    fi
done