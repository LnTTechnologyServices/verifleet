

function checkRpcOk(call) {
  return call.status === "ok"
}

function makeId(length: number)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function makeDevice(vendor: string) {
  return {
    name: "test_device_" + makeId(5),
    sn: "0",
    model: "test_model",
    vendor: vendor
  }
}

export {makeId, checkRpcOk, makeDevice};
