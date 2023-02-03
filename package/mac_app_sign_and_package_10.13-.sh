#!/bin/sh --
#
# This script signs and packages a Mac OS X application bundle.
# The final package will be created as ../dist/|APP_NAME|-|VERSION|-setup-MacOS.pkg.
#
# Requirements for this script are:
#
#   User must specify the application bundle name without extension: (example -a "MyApplication")
#     IMPORTANT: Application bundle must exist in folder noted below
#   User must specify the package version: (example: "-v 1.0.56")
#   
#   All other parameters are optional: (FTDI driver installer, restart requirement, developer identities, deploy package request)
#
#   These files and folders must exist in the paths show below (in relation to this script's folder):
#      ./drivers/FTDIUSBSerialDriver.kext
#      ../dist/|application_bundle_name|.app
#
#   To update the driver, 
#      - download and install driver (from http://www.ftdichip.com/Drivers/VCP.htm)
#        - select the currently supported Mac OS X VCP driver from that page (i.e. x64 (64-bit))
#        - or use: http://www.ftdichip.com/Drivers/VCP/MacOSX/FTDIUSBSerialDriver_v2_4.2.dmg
#        - install FTDI's driver package onto the development Mac OS X system
#      - copy the FTDIUSBSerialDriver.kext from /Library/Extensions/ to the ../drivers/ folder
#
#   The ../dist/|application_bundle_name|.app will be modified by this script to digitally sign it with the default or optional
#       application developer identity certificate
#

usage()
{
cat << EOF
Usage: $0 OPTIONS

This script signs an application bundle and builds a signed installation package.

OPTIONS:
    -h  show usage
    -a  (REQUIRED) application bundle name
        - example: -a "MyApplication"
    -v  (REQUIRED) version
        - example: -v 0.5.1
    -r  require restart after installation (applies only if FTDIUSBSerialDriver is included)
    -f  include FTDIUSBSerialDriver in the package
    -s  application developer identity certificate key
        - example: -s "Developer Identity" (default is "Developer ID Application")
    -t  installer developer identity certificate key
        - example: -t "Developer Identity" (default is "Developer ID Installer")
    -d  use deployment identifier (default is: com.test.ParallaxInc, deploy is: com.ParallaxInc.|APP_NAME|)

    examples: $0 -a "MyApplication" -v 1.0.56 -d
              $0 —a "MyApplication" -v 1.0.56 -r -f -s "Developer ID Application" -t "Developer ID Installer" -d

EOF
}

#
# Resource paths
#
RESOURCES="./mac-resources/"
DISTRIBUTION="../dist/"

#
# Default installation locations
#
# note: the FTDI kext used to be in "/System/Library/Extensions/" per Apple's previous suggestion (before Mavericks?)
FTDIDRIVER_DEST_DIR="/Library/Extensions/"
DEFAULT_APP_DIR="/Applications/"

#
# Default component names
#
FTDIDRIVER=FTDIUSBSerialDriver
FTDIDRIVER_KEXT=${FTDIDRIVER}.kext

#
# Modified temporary distro xml
#
# note: will contain copied or sed-modified version of template DistributionXXXX.xml
DIST_DST=DistributionMOD.xml

#
# initialize input options with default values
#
APP_NAME=
VERSION=
APP_IDENTITY="Developer ID Application"
INST_IDENTITY="Developer ID Installer"
REQUIRE_RESTART_TEXT="requireRestart"
RESTART=false
DEPLOY=false
FTDI=false

#
# get parms as flags or as requiring arguments
#
while getopts "ha:v:rfs:t:d" OPTION
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
        r)
            if [[ $OPTARG =~ ^[0-9]+$ ]]
            then
                RESTART=$OPTARG
            elif [[ $OPTARG =~ ^-, ]]
            then
                RESTART=true
                let OPTIND=$OPTIND-1
            else
                RESTART=true
            fi
            ;;
        f)
            if [[ $OPTARG =~ ^[0-9]+$ ]]
            then
                FTDI=$OPTARG
            elif [[ $OPTARG =~ ^-, ]]
            then
                FTDI=true
                let OPTIND=$OPTIND-1
            else
                FTDI=true
            fi
            ;;
        s)
            APP_IDENTITY=$OPTARG
            ;;
        t)
            INST_IDENTITY=$OPTARG
            ;;
        d)
            if [[ $OPTARG =~ ^[0-9]+$ ]]
            then
                DEPLOY=$OPTARG
            elif [[ $OPTARG =~ ^-, ]]
            then
                DEPLOY=true
                let OPTIND=$OPTIND-1
            else
                DEPLOY=true
            fi
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
echo "----------------RECIPE----------------"
echo "* Processing target: \"${DISTRIBUTION}${APP_NAME}.app\""
echo "* As build version: \"${VERSION}\""
echo "* Using application identity: \"${APP_IDENTITY}\""
echo "* Using installer identity: \"${INST_IDENTITY}\""
if [[ $RESTART == true ]]
then
    echo "* Restart required after installation"
else
    echo "* Restart NOT required after installation"
fi
if [[ ${FTDI} == true ]]
then
    echo "* FTDI kext WILL BE installed by this package"
else
    echo "* FTDI kext WILL NOT BE installed by this package"
fi

echo

#
# Use security utility to determine if the developer installation identity is valid
#
echo "Validating developer identity certificates..."
APP_SECUREID=`security find-certificate -c "$APP_IDENTITY" | grep labl`
INST_SECUREID=`security find-certificate -c "$INST_IDENTITY" | grep labl`
if [[ -n ${APP_SECUREID} ]]
then
    echo "  Found Application Identity: \"${APP_IDENTITY}\""
else
    echo "  [Error] Application Identity: \"${APP_IDENTITY}\" does not exist!"
    echo "          Use Keychain Access app to verify that you are using an authorized developer installation certificate..."
    echo "          i.e. search within Login Keychain 'My Certificates' Category for certificate, for example: 'Developer ID Application'"
    echo
    exit 1
fi
if [[ -n ${INST_SECUREID} ]]
then
    echo "  Found Installer Identity: \"${INST_IDENTITY}\""
else
    echo "  [Error] Installer Identity: \"${INST_IDENTITY}\" does not exist!"
    echo "          Use Keychain Access app to verify that you are using an authorized developer installation certificate..."
    echo "          i.e. search within Login Keychain 'My Certificates' Category for certificate, for example: 'Developer ID Installer'."
    echo
    exit 1
fi

echo

#
# Set bundle version number (in Info.plist)
#
if [[ -e "${DISTRIBUTION}${APP_BUNDLE}" ]]
then
    if [[ -e "${DISTRIBUTION}${APP_BUNDLE}/Contents/Info.plist" ]]
    then
        if sed -i.bak s_\<string\>0.0.0\<\/string\>_\<string\>${VERSION}\<\/string\>_ "${DISTRIBUTION}${APP_BUNDLE}/Contents/Info.plist"
        then
            echo "Set bundle's Info.plist to version: \"${VERSION}\""
            rm "${DISTRIBUTION}${APP_BUNDLE}/Contents/Info.plist.bak"
        else
            echo "[Error] Could not set bundle's version in Info.plist."
            exit 1
        fi
    else
        echo "[Error] Application bundle does not include an Info.plist file."
        exit 1
    fi
else
    echo "[Error] Application bundle not found: ${DISTRIBUTION}${APP_BUNDLE}"
    exit 1
fi

echo

#
# Attempt to deeply codesign the app bundle
#
echo "Code signing the application bundle (without hardened runtime entitlements): ${DISTRIBUTION}${APP_BUNDLE} with identity: \"${APP_IDENTITY}\""
codesign -s "$APP_IDENTITY" --deep -f -v --timestamp "${DISTRIBUTION}${APP_BUNDLE}"
if [ "$?" != "0" ]; then
    echo "[Error] Codesigning the application bundle failed!" 1>&2
    exit 1    
fi

echo

#
# Verify that app is code-signed
# A properly signed app will contain a _CodeSignature directory and CodeResource file
#
echo "Validating application signature..."
if [[ -e "${DISTRIBUTION}${APP_BUNDLE}" ]]
then
    #
    # Found bundle
    #
    if [[ -e "${DISTRIBUTION}${APP_BUNDLE}/Contents/_CodeSignature/CodeResources" ]]
    then
        #
        # Found code signature, now we'll check validity
        # A single "-v" == "verify app signing", gives no result on valid app signing 
        #
        codesign -v "${DISTRIBUTION}${APP_BUNDLE}"
        if [ "$?" != "0" ]; then
            echo "  [Error] Application signature is invalid!" 1>&2
            exit 1
        else
            echo "  Verified ${DISTRIBUTION}${APP_BUNDLE} signature"
        fi
    else
        echo "  [Error] Application bundle is not signed."
        exit 1
    fi
fi

echo

#
# Developer PARALLAX_IDENTIFIER & FTDI_IDENTIFIER (package can be for testing or deployment)
#
if [[ $DEPLOY == true ]]
then
    PARALLAX_IDENTIFIER=com.ParallaxInc
    #   Will get modified to: "com.ParallaxInc.|APP_NAME|" below
    FTDI_IDENTIFIER=com.FTDI.driver
    #   Will get modified to: "com.FTDI.driver.FTDIUSBSerialDriver" below
    echo "Package’s CFBundleIdentifiers will be set for deployment"
else
    PARALLAX_IDENTIFIER=com.test.ParallaxInc
    #   Will get modified to: "com.test.ParallaxInc.|APP_NAME|" below
    FTDI_IDENTIFIER=com.test.FTDI.driver
    #   Will get modified to: "com.test.FTDI.driver.FTDIUSBSerialDriver" below
    echo "Package’s CFBundleIdentifiers will be set for testing"
fi

#
# touch the entire bundle directory to set most-recent mod dates
#
touch ${DISTRIBUTION}*

#
# If necessary, build the FTDIUSBSerialDriver.kext component package
#
if [[ ${FTDI} == true ]]
then
#   is the FTDI Driver kext available?
    if [[ -e ./drivers/${FTDIDRIVER_KEXT} ]]
    then
        echo; echo "Found FTDI USB Serial Driver kext"
        DIST_SRC=DistributionFTDI.xml
#
#       build the FTDI Driver component package
        echo; echo "Building FTDI USB Driver package..."
        pkgbuild    --root ./drivers/${FTDIDRIVER_KEXT} \
                    --identifier ${FTDI_IDENTIFIER}.${FTDIDRIVER} \
                    --timestamp \
                    --install-location ${FTDIDRIVER_DEST_DIR}${FTDIDRIVER_KEXT} \
                    --sign "$INST_IDENTITY" \
                    --version ${VERSION} \
                    ${DISTRIBUTION}FTDIUSBSerialDriver.pkg
    else
        echo "[Error] FTDI USB Serial Driver kext is missing. Please read $0 comments."
        exit 1
    fi
else
    DIST_SRC=Distribution.xml
fi

echo

#
# Build the application component package
#
echo "Building application package..."
pkgbuild --root "${DISTRIBUTION}${APP_BUNDLE}" \
         --identifier "${PARALLAX_IDENTIFIER}.${APP_NAME}" \
         --timestamp \
         --install-location "${DEFAULT_APP_DIR}${APP_BUNDLE}" \
         --sign "$INST_IDENTITY" \
         --version ${VERSION} \
         "${DISTRIBUTION}${APP_NAME}.pkg"

#
# Write a synthesized distribution xml directly (NO LONGER USED, BUT CAN PROVIDE A DISTRIBUTION XML FILE AS A TEMPLATE)
#
#productbuild --synthesize --sign "$INST_IDENTITY" --timestamp=none --package "${DISTRIBUTION}${APP_NAME}.pkg" --package ${DISTRIBUTION}FTDIUSBSerialDriver.pkg ${RESOURCES}${DIST_SRC}
#

#
# Modify the existing DistributionXXXX.xml only if requiredRestart is requested
#
if [[ ${FTDI} == true ]]
then
    if [[ ${RESTART} == true ]]
    then
	echo; echo "Modifying distribution xml to require restart..."
        sed "s/\"none\"\>FTDI/\"${REQUIRE_RESTART_TEXT}\"\>FTDI/g" ${RESOURCES}${DIST_SRC} > ${RESOURCES}${DIST_DST}
    else
        cat ${RESOURCES}${DIST_SRC} > ${RESOURCES}${DIST_DST}
    fi
else
    cat ${RESOURCES}${DIST_SRC} > ${RESOURCES}${DIST_DST}
fi

echo 

#
# Build the Product Installation Package
#
# note: $DIST_DST holds a copied or modified version of one of the 2 DistributionXXXX.xml files
#       The $DIST_DST contains installation options & links to resources for the product package
echo "Building installation package..."
productbuild    --distribution ${RESOURCES}${DIST_DST} \
                --resources ${RESOURCES} \
                --timestamp \
                --version $VERSION \
                --package-path ${DISTRIBUTION} \
                --sign "$INST_IDENTITY" \
                "${DISTRIBUTION}${APP_NAME}-${VERSION}-setup-MacOS.pkg"

echo

if [[ -e ${RESOURCES}${DIST_DST} ]]
then
    echo "Cleaning up temporary files..."   
    rm ${RESOURCES}${DIST_DST}
fi

echo
echo "Done!"
exit 0
