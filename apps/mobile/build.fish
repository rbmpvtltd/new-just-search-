#!/usr/bin/env fish

# Function to clean temp and gradle files
function cleanup
    echo (set_color yellow)"Setting java version 17"(set_color normal)
    echo (set_color yellow)"Enter your password"(set_color normal)
    java-17
    echo (set_color yellow)"[INFO] Cleaning temp build files..."(set_color normal)

    cd ~/eas-build-tmp
    if test (count *) -gt 0
        rm -rf *
        echo (set_color green)"[OK] Temp directory cleared."(set_color normal)
    else
        echo (set_color red)"[SKIP] Temp directory already empty."(set_color normal)
    end
    cd ~

    if test -d .gradle
        rm -rf .gradle
        echo (set_color green)"[OK] Removed .gradle."(set_color normal)
    else
        echo (set_color red)"[SKIP] .gradle not found."(set_color normal)
    end
end

# Print usage helper
function usage
    echo "Usage:"
    echo "  ./build.fish <platform> <profile>"
    echo ""
    echo "Platforms: android | ios"
    echo "Profiles : developer | preview | production"
    exit 1
end

# Ensure at least 2 arguments
if test (count $argv) -lt 2
    usage
end

set platform $argv[1]
set profile $argv[2]

# Validate platform
switch $platform
    case android ios
        # Validate profile
        switch $profile
            case developer preview production
                cleanup
                cd ~/Project/JSExpo
                TMPDIR=~/eas-build-tmp eas build --platform $platform --clear-cache --local --profile=$profile
                java-24
            case '*'
                usage
        end
    case '*'
        usage
end
