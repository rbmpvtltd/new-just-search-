#!/usr/bin/env fish

# Function to clean temp and gradle files
function cleanup
    echo (set_color yellow)"Setting java version 17"(set_color normal)
    echo (set_color yellow)"Enter your password"(set_color normal)
    java-17
    echo (set_color yellow)"[INFO] Cleaning temp build files..."(set_color normal)

    set tmpdir ~/eas-build-tmp
    if not test -d $tmpdir
        mkdir -p $tmpdir
        echo (set_color green)"[OK] Created temp directory $tmpdir."(set_color normal)
    end

    cd $tmpdir

    if test (count *) -gt 0
        rm -rf *
        echo (set_color green)"[OK] Temp directory cleared."(set_color normal)
    else
        echo (set_color cyan)"[SKIP] Temp directory already empty."(set_color normal)
    end
    cd ~

    if test -d .gradle/caches
        rm -rf .gradle/caches
        echo (set_color green)"[OK] Removed .gradle/caches"(set_color normal)
    else
        echo (set_color cyan)"[SKIP] .gradle/caches not found."(set_color normal)
    end
end

# Print usage helper
function usage
    echo "Usage:"
    echo "  ./build.fish <platform> <profile>"
    echo ""
    echo "Platforms: android | ios"
    echo "Profiles : development | preview | production"
    exit 1
end

# Ensure at least 2 arguments
if test (count $argv) -lt 2
    usage
end

set platform $argv[1]
set profile $argv[2]

set mydir (pwd)

# Validate platform
switch $platform
    case android ios
        # Validate profile
        switch $profile
            case development preview production
                notify-send "Build started"
                cleanup
                cd $mydir
                TMPDIR=~/eas-build-tmp eas build --platform $platform --clear-cache --local --profile=$profile
                java-24
                notify-send "Build complete"
            case '*'
                usage
        end
    case '*'
        usage
end
