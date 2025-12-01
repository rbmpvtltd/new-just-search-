#!/bin/sh

# Color codes
YELLOW="\033[33m"
GREEN="\033[32m"
CYAN="\033[36m"
NC="\033[0m"

cleanup() {
    echo "${YELLOW}Setting java version 17${NC}"
    echo "${YELLOW}Enter your password${NC}"
    java-17

    echo "${YELLOW}[INFO] Cleaning temp build files...${NC}"

    tmpdir="$HOME/eas-build-tmp"

    if [ ! -d "$tmpdir" ]; then
        mkdir -p "$tmpdir"
        echo "${GREEN}[OK] Created temp directory $tmpdir.${NC}"
    fi

    cd "$tmpdir" || exit 1

    if [ "$(ls -A "$tmpdir" 2>/dev/null)" ]; then
        rm -rf "$tmpdir"/*
        echo "${GREEN}[OK] Temp directory cleared.${NC}"
    else
        echo "${CYAN}[SKIP] Temp directory already empty.${NC}"
    fi

    cd "$HOME" || exit 1

    if [ -d "$HOME/.gradle/caches" ]; then
        rm -rf "$HOME/.gradle/caches"
        echo "${GREEN}[OK] Removed .gradle.${NC}"
    else
        echo "${CYAN}[SKIP] .gradle not found.${NC}"
    fi
}

usage() {
    echo "Usage:"
    echo "  ./build.sh <platform> <profile>"
    echo ""
    echo "Platforms: android | ios"
    echo "Profiles : development | preview | production"
    exit 1
}

# Require 2 args
if [ $# -lt 2 ]; then
    usage
fi

platform="$1"
profile="$2"
mydir="$(pwd)"

# Validate platform
if [ "$platform" = "android" ] || [ "$platform" = "ios" ]; then

    # Validate profile
    case "$profile" in
        development|preview|production)
            cleanup
            cd "$mydir" || exit 1
            TMPDIR="$HOME/eas-build-tmp" eas build --platform "$platform" --clear-cache --local --profile="$profile"
            ;;
        *)
            usage
            ;;
    esac

else
    usage
fi
