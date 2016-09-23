APP=""
TYPE="GET"
API_AUTH_HEADER="authorization"
API_TOKEN="Bearer testAuthToken"

if [ -z "$1" ]; then
   ENDPOINT="devices"
elif [ "$1" == "ts" ]; then
    ENDPOINT="ts/debug"
    if [ "$2" != "" ]; then
        # add a limit
        ENDPOINT="$ENDPOINT/$2"
    fi;
elif [ "$1" == "query" ]; then
    if [ -z "$2" ]; then
        echo "Need to supply query";
        exit
    fi;
    ENDPOINT="ts/debug"
    TYPE="POST"
    HEADERS="Content-Type: application/json"
    BODY="{\"query\":\"$2\"}"
elif [ "$1" == "command" ]; then
    if [ -z "$2" ]; then
        echo "Need to supply query";
        exit
    fi;
    ENDPOINT="ts/command"
    TYPE="POST"
    HEADERS="Content-Type: application/json"
    BODY="{\"query\":\"$2\"}"
elif [ "$1" == "products" ]; then
    ENDPOINT="products"
elif [ "$1" == "users" ]; then
    ENDPOINT="users"
elif [ "$1" == "kv" ]; then
    if [ -z "$2" ]; then
        ENDPOINT="kv/debug"
    else 
        ENDPOINT="kv/get/$2"
    fi;
elif [ "$1" == "test" ]; then
    ENDPOINT="test"
else 
    ENDPOINT="$1"
fi;
URL="https://"$APP".apps.exosite.io/api/v1/$ENDPOINT"
if [ "$TYPE" == "GET" ]; then
    curl -H"$API_AUTH_HEADER:$API_TOKEN" $URL
else
    curl -XPOST $URL -H"$HEADERS" -H"$API_AUTH_HEADER:$API_TOKEN" -d"$BODY"
fi;
