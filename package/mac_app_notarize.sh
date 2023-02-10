#!/bin/sh --
#
# This script transmits a packaged macOS application to Apple for notarization.
# Must be run on macOS Catalina (or later) with XCode installed.
#
# Requirements for this script are:
#
#   User must specify the application bundle name without extension: (example -a "MyApplication")
#     IMPORTANT: Packaged application bundle must exist in folder noted below
#   User must specify the package version: (example: -v 1.0.56)
#   User must specify the Apple developer account: (example: -d "developer@domain.com")
#   
#   These files and folders must exist in the paths shown below (in relation to this script's folder):
#      ../dist/{APP_NAME}-{VERSION}-setup-MacOS.pkg
#

usage()
{
cat << EOF
Usage: $0 OPTIONS

This script transmits a packaged macOS application to Apple for notarization.

OPTIONS:
    -h  show usage
    -a  (REQUIRED) application bundle name
        - example: -a "MyApplication"
    -v  (REQUIRED) version
        - example: -v 0.5.1
    -d  (REQUIRED) developer account
        - example: -d "developer@domain.name"

    examples: $0 -a "MyApplication" -v 1.0.56 -d "developer@domain.name"

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
DEVELOPER_ACCOUNT=

#
# get parms as flags or as requiring arguments
#
while getopts "ha:v:d:" OPTION
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
        d)
            DEVELOPER_ACCOUNT=$OPTARG
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
# Error if no developer account (-d bundle) was declared
#
if [[ -z $DEVELOPER_ACCOUNT ]]
then
    echo "[HALT] No developer account was declared - see usage notes for -d."
    echo
    usage
    exit 1
fi

#
# Show Info
#
echo
echo "----- Transmitting packaged app to Apple for notarization -----"
echo "NOTE: use altool app password defined in Apple Developer Account"
echo
echo "Package: \"${DISTRIBUTION}${APP_NAME}-${VERSION}-setup-MacOS.pkg\""
echo
echo "... be patient - this will take a while ..."
echo

#
# Transmit app package for notarization
#
xcrun altool --notarize-app --primary-bundle-id "${APP_NAME}" --username "${DEVELOPER_ACCOUNT}" --file "${DISTRIBUTION}${APP_NAME}-${VERSION}-setup-MacOS.pkg"

echo
echo "If no errors reported (above), wait a few minutes and check ${DEVELOPER_ACCOUNT} email for notarization verdict."
echo "To see detailed report (after verdict), use: xcrun altool -u \"${DEVELOPER_ACCOUNT}\" --notarization-info <hash>"
echo 
echo "If \"successful\" vertict, staple notarization ticket to package: xcrun stapler staple -v ${DISTRIBUTION}${APP_NAME}-${VERSION}-setup-MacOS.pkg"
echo
echo "Done!"
exit 0
