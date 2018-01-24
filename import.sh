#!/bin/bash
max_concurrent=2
current_count=0
for x in ./test_users/*.json; do
    if test -f $x; then
        echo "Executing import script for file ${x}"
        node run.js $x &
        ((current_count++))
        if [ $current_count -eq $max_concurrent ]; then
            echo "Waiting for import scripts to finish"
            wait
            echo "Continue the import"
            current_count=0
        fi
    fi
done
