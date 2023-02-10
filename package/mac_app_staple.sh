#!/bin/sh --
#
# This script staples a successfully notarized app ticket to an app package.
# Must be run on macOS Catalina (or later) with XCode installed.
#
# Requirements for this script are:
#
#   User must have successfully notarized the app first.
#   User must specify the application bundle name without extension: (example -a "MyApplication")
#     IMPORTANT: Packaged application bundle must exist in folder noted below
#   User must specify the package version: (example: -v 1.0.56)
#   
#   These files and folders must exist in the paths shown below (in relation to this script's folder):
#      ../dist/{APP_NAME}-{VERSION}-setup-MacOS.pkg
#

usage()
{
cat << EOF
Usage: $0 OPTIONS

This script staples a successfully notarized app ticket to a packaged macOS application.

OPTIONS:
    -h  show usage
    -a  (REQUIRED) application bundle name
        - example: -a "MyApplication"
    -v  (REQUIRED) version
        - example: -v 0.5.1

    examples: $0 -a "MyApplication" -v 1.0.56

EOF
}

#
# Resource path
#
DISTRIBUTION="../dist/"

#
# initialize input options with default values
#
APP_NAME=
VERSION=

#
# get parms as flags or as requiring arguments
#
while getopts "ha:v:" OPTION
do
    case $OPTION in
        h)
            usage; exit 1 ;;
        a)
            APP_NAME=$OPTARG
            ;;           
        v)
            VERSION=$OPTARG
            ;;
        ?)
            echo "[HALT] Misconfigured options - see usage notes"
            usage; exit  ;;
    esac
done

#
# Error if no application bundle name (-a bundle) was declared
#
if [[ -z $APP_NAME ]]
then
    echo "[HALT] No application bundle was declared - see usage notes for -a."
    echo
    usage
    exit 1
fi

#
# Error if no version (-v) option declared
#
if [[ -z $VERSION ]]
then
    echo "[HALT] No version option was declared - see usage notes for -v."
    echo
    usage
    exit 1
fi

#
# Error if no version string declared
#
if [ ${VERSION}X == X ]
then
    echo "[HALT] No version string was declared - see usage notes for -v."
    echo
    usage
    exit 1
fi

#
# Show Info
#
echo
echo "----- Stapling packaged app with notarization ticket -----"
echo
echo "Package: \"${DISTRIBUTION}${APP_NAME}-${VERSION}-setup-MacOS.pkg\""
echo

#
# Staple app package
#
xcrun stapler staple -v "${DISTRIBUTION}${APP_NAME}-${VERSION}-setup-MacOS.pkg"

echo
echo "Done!"
exit 0
