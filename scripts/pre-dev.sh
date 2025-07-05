#!/usr/bin/env sh

set -e

if ! nc -z localhost 8080; then
    if [ "$(docker ps -aq -f name=badstu-v2-libsql)" ]; then
        printf "\e[34m  👀 Found existing stopped docker libsql container, starting it... \e[32m\e[0m\n\n"
        docker start badstu-v2-libsql >> /dev/null || { printf "\e[31m 🔥🔥🔥 Failed to start LibSQL container\n"; exit 1; }
        exit 0
    else
        printf "\e[33m  😲 No libsql image found! Starting libsql container... \e[32m\e[0m\n\n"
        yarn db:dev >> /dev/null || { printf "\e[31m 🔥🔥🔥 Failed to start LibSQL via Yarn\n"; exit 1; }
        exit 0
    fi
fi

printf "\e[32m  👍 LibSQL available. \e[32m\e[0m"
