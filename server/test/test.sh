HOST="localhost:3000"

printf 'Getting users\n'
curl $HOST/users

printf '\n\nGetting user keys\n'
curl $HOST/users/keys/0?keys=test_key,test_other_key

printf '\n\nSetting user keys\n'
curl -X POST $HOST/users/keys/0 -d '{"here":"there"}' -H"content-type: application/json"

printf "\n\nSetting user notifications\n"
curl -X POST $HOST/users/notifications/0 -H"content-type: application/json" -d '{"rid": "test_rid", "alert": "test_alert", "sms": false, "email": false}'

printf "\n\nSetting user notifications\n"
curl -X POST $HOST/users/roles/0 -H"content-type: application/json" -d '{"role": "manager"}'

printf "\n\nSetting user permissions\n"
curl -X POST $HOST/users/permissions/0 -H"content-type: application/json" -d '{"rid":"test_rid", "read": true, "write": false}'


printf "\n\nCreating Device\n"
curl -X POST $HOST/devices/create -H"content-type: application/json" -d '{"rid":"test_rid", "read": true, "write": false}'





printf '\n'
