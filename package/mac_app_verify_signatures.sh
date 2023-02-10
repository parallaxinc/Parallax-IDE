#!/bin/sh --
#
# This script verifies signatures of a macOS application bundle.
# The bundle verified is ../dist/|APP_NAME|.app 
#
# Requirements for this script are:
#
#   User must specify the application bundle name without extension: (example -a "MyApplication")
#     IMPORTANT: Application bundle must exist in folder noted below (in relation to this script's folder):
#      ../dist/|application_bundle_name|.app
#

usage()
{
cat << EOF
Usage: $0 OPTIONS

This script verifies signatures of a macOS application bundle.

OPTIONS:
    -h  show usage
    -a  (REQUIRED) application bundle name
        - example: -a "MyApplication"

    examples: $0 -a "MyApplication"

EOF
}

#
# Resource paths
#
# Notes: 
#   * All are paths relative to this script.
#   * NWJS_FW_LIBRARIES (NW.js Framework Libraries) is the path inside of APP_BUNDLE (defined later)
#
DISTRIBUTION="../dist/"
NWJS_FW="/Contents/Frameworks/nwjs Framework.framework/"
NWJS_FW_LIBRARIES="${NWJS_FW}Versions/Current/Libraries/"

#
# initialize input options with default values
#
APP_NAME=

#
# get parms as flags or as requiring arguments
#
while getopts "ha:" OPTION
do
    case $OPTION in
        h)
            usage; exit 1 ;;
        a)
            APP_NAME=$OPTARG
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
# Set bundle name
#
APP_BUNDLE=${APP_NAME}.app

#
# Announce purpose
#
echo
echo "Verify App Bundle Signatures"
echo

#
# Check code signature on application bundle's nwjs framework
#
echo "Checking code signature of nwjs framework within the application bundle: ${DISTRIBUTION}${APP_BUNDLE}"
codesign -vvvv --deep --strict "${DISTRIBUTION}${APP_BUNDLE}${NWJS_FW}nwjs Framework"
if [ "$?" != "0" ]; then
    echo "[Error] Code signature verification of nwjs framework failed!" 1>&2
    exit 1
fi

echo

#
# Check code signature on application bundle
#
echo "Checking code signature of the application bundle: ${DISTRIBUTION}${APP_BUNDLE}"
codesign -vvvv --deep --strict "${DISTRIBUTION}${APP_BUNDLE}"
if [ "$?" != "0" ]; then
    echo "[Error] Code signature verification of the application bundle failed!" 1>&2
    exit 1
fi

echo
echo "Done!"
exit 0
