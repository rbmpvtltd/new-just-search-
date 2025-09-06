#!/usr/bin/env fish

# Function to clean temp and gradle files
function cleanup

    echo (set_color yellow)"Setting java version 17"(set_color normal)
    echo (set_color yellow)"Enter your password"(set_color normal)
    java-17
    echo (set_color yellow)"[INFO] Cleaning temp build files..."(set_color normal)

    # cd $mydir
    cp -r ./apps/mobile ~/eas-build-tmp

    cd ~/eas-build-tmp/tmp
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
                cleanup
                cd ~/eas-build-tmp/mobile
                yarn install
                TMPDIR=~/eas-build-tmp/tmp eas build --platform $platform --clear-cache --local --profile=$profile
                java-24
            case '*'
                usage
        end
    case '*'
        usage
end
