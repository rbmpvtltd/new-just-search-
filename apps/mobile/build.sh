#!/usr/bin/env bash

# Function to clean temp and gradle files
cleanup() {
	echo -e "\033[33mSetting java version 17\033[0m"
	echo -e "\033[33mEnter your password\033[0m"
	java-17
	echo -e "\033[33m[INFO] Cleaning temp build files...\033[0m"

	cd ~/eas-build-tmp || exit 1
	if [ "$(ls -A . 2>/dev/null)" ]; then
		rm -rf ./*
		echo -e "\033[32m[OK] Temp directory cleared.\033[0m"
	else
		echo -e "\033[31m[SKIP] Temp directory already empty.\033[0m"
	fi
	cd ~ || exit 1

	if [ -d ".gradle" ]; then
		rm -rf .gradle
		echo -e "\033[32m[OK] Removed .gradle.\033[0m"
	else
		echo -e "\033[31m[SKIP] .gradle not found.\033[0m"
	fi
}

# Print usage helper
usage() {
	echo "Usage:"
	echo "  ./build.sh <platform> <profile>"
	echo ""
	echo "Platforms: android | ios"
	echo "Profiles : development | preview | production"
	exit 1
}

# Ensure at least 2 arguments
if [ $# -lt 2 ]; then
	usage
fi

platform=$1
profile=$2

# Validate platform and profile
case $platform in
android | ios)
	case $profile in
	development | preview | production)
		cleanup
		cd ~/Project/OldJustSearch/OldJSExpo || exit 1
		TMPDIR=~/eas-build-tmp eas build --platform "$platform" --clear-cache --local --profile="$profile"
		java-24
		;;
	*)
		usage
		;;
	esac
	;;
*)
	usage
	;;
esac
