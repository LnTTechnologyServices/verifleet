APP=""
URL="wss://$APP.apps.exosite.io/debug"
echo "Connecting to $URL"
wscat -c $URL
