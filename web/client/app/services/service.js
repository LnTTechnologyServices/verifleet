// import Server as WebSocket from 'ws';

let WebSocket = require('ws');
class websocketserver {

    constructor() {
        "ngInject";
        this.gaugeData = {
            "max": this.max,
            "min": this.min,
            "value": 45
        }
        this.devicedata = [{}];
        // this.ws = new WebSocket("ws://localhost/ws");
        // this.ws = new WebSocket("wss://m2.exosite.com/ws");

        // this.ws.on("open", function() {
        //     alert("Socket has been opened!");
        //     this.ws.send(JSON.stringify({
        //         "auth": {
        //             "cik": "07b03708551eb9e995fbff5fcbb762cfa079f9ff"
        //         }
        //     }));
        // }, this);

        // this.ws.on("message", function(json_data, flags) {
        //     let orig_data = JSON.parse(json_data);
        //     let data = orig_data[0];

        //     if (data) {
        //         if (data.status === "ok") {
        //             if (data.result) {
        //                 alert(data);
        //                 //DGE data 
        //             }
        //         }
        //     }
        // });
    }
    get() {
            console.log("get Method");
            try {
                this.ws.send(JSON.stringify({
                    "calls": [{
                        "id": 131,
                        "procedure": "subscribe",
                        "arguments": [
                            "314e017e1857b14c8826264226ff7b98c3ed5f16", // 1 DGE
                            {
                                "since": 1464894020,
                                "subs_id": 20
                            }

                        ]
                    }]
                }));
            } catch (e) {
                console.log("error sending to ws: ", e);
            }
        }
        // validate() {
        //     console.log("Validate");
        //     this.dataStream.send(JSON.stringify({
        //         "auth": {
        //             "cik": "07b03708551eb9e995fbff5fcbb762cfa079f9ff"
        //         }
        //     }));
        // }

    initData(devices) {
        // alert(JSON.stringify(devices));
        let i = 0;
        for (i = 0; i < devices.length; i++) {
            let temp = {};
            temp.name = devices[i].name;
            temp.data = devices[i].data;
            this.devicedata.push(temp);
        }
    }

    getDGE(deviceName) {

        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });
            // alert(JSON.stringify(item));
            if (item)
                return item.data.dge[0].value.toFixed(2);
        } else
            alert(JSON.stringify(this.devicedata.length));

        return 0;
    }
    getDGEFilledperDay() {
        let i = 0,
            j = 0;
        let temp = 0;
        let result = [];
        for (i = 0; i < this.devicedata.length; i++) {
            // alert(this.devicedata[i].name);
            temp = this.getGasFilled(this.devicedata[i].name, 5);
            // alert(JSON.stringify(temp));
            if (Array.isArray(temp))
                for (j = 0; i < temp.length; j++) {
                    let data = { timestamp: temp[j].timestamp, value: temp[j].value };
                    if (result.length > 0) {
                        alert(data.timestamp);
                        let res = result.find(function(item) {

                            return new Date(data.timestamp).getDate() == item.timestamp.getDate();
                        });

                        if (res) {
                            res.value += data.value;
                        } else
                            result.push(data);

                    } else
                        result.push(data);
                }
        }
        //alert("result");
        //alert(JSON.stringify(result));
        return result;
    }
    getDistanceToEmpty(deviceName) {
        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                var ecu_data1 = item.data.ecu[0].value.replace(/\'/g, '\"');
                var ecu_data = JSON.parse(ecu_data1);
                var tot = ecu_data.average_fuel_economy * this.getDGE(deviceName)
                return tot.toFixed(2);
            }
        } else
            alert(JSON.stringify(this.devicedata.length));
        return 0;
    }
    getEngineHours(deviceName) {
        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                // alert(JSON.stringify(item.data.value))
                var ecu_data1 = item.data.ecu[0].value.replace(/\'/g, '\"');
                var ecu_data = JSON.parse(ecu_data1);
                var ecu_data2 = item.data.ecu.last().value.replace(/\'/g, '\"');
                var ecu_data3 = JSON.parse(ecu_data2);
                // alert(ecu_data.engine_hours + ":" + ecu_data3.engine_hours)
                var tot = ecu_data.engine_hours - ecu_data3.engine_hours;
                return tot.toFixed(2);
            }
        } else
            alert(JSON.stringify(this.devicedata.length));

        return 0;
    }
    getMilesDriven(deviceName) {

        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                // alert(JSON.stringify(item.data.value))
                var ecu_data1 = item.data.ecu[0].value.replace(/\'/g, '\"');
                var ecu_data = JSON.parse(ecu_data1);
                var ecu_data2 = item.data.ecu.last().value.replace(/\'/g, '\"');
                var ecu_data3 = JSON.parse(ecu_data2);
                // alert(ecu_data.engine_hours + ":" + ecu_data3.engine_hours)
                var tot = ecu_data.total_vehicle_distance_high_resolution - ecu_data3.total_vehicle_distance_high_resolution;
                return tot.toFixed(2);
            }
        }
        return 0;
    }
    getFaultCode(deviceName) {
        let j = 0;

        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                // alert(JSON.stringify(item.data.value))
                let i = 0;
                for (i = 0; i < item.data.ecu.length; i++) {
                    var ecu_data1 = item.data.ecu[i].value.replace(/\'/g, '\"');
                    var ecu_data = JSON.parse(ecu_data1);
                    if (ecu_data.red_stop_lamp_status == 1)
                        j++;
                }
            }
            return j;
        } else
            alert(JSON.stringify(this.devicedata.length));
        return "40";
    }
    getDGEperHours(deviceName) {
        let filled = 0;
        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                let initial = item.data.dge.last().value;
                let last = item.data.dge[0].value;
                let i = 0;
                for (i = 0; i < item.data.dge.length; i++) {
                    // console.log("i :" + item.data.dge[i].value + "-  i+1 :" + item.data.dge[i + 1].value + "--%  :" + ((item.data.dge[i].value * 20) / 100))
                    let dge = item.data.dge[i].value;
                    if ((dge[i + 1] - dge[i]) > ((dge[i] * 20) / 100)) {
                        filled = filled + (dge[i + 1] - dge[i]);
                    }
                    if (i == 12) { //TODO
                        break;
                    }
                    // console.log(i + ": PER  Hour" + initial + ":" + last + ":" + filled)
                }
                console.log("Result : PER  Hour" + initial + ":" + last + ":" + filled)
                    // alert(initial + ":" + filled + ":" + last);
                return (initial + filled - last).toFixed(2);
            }
        }
        return "0";
    }
    getTotalGasUsed(deviceName) {
        //getDGEperDay
        let filled = 0;
        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                if (item.data) {
                    let initial = item.data.dge.last().value;
                    let last = item.data.dge[0].value;
                    let i = 0;
                    for (i = 0; i < item.data.dge.length - 1; i++) {
                        // console.log("i :" + item.data.dge[i].value + "-  i+1 :" + item.data.dge[i + 1].value + "--%  :" + ((item.data.dge[i].value * 20) / 100))
                        if ((item.data.dge[i + 1].value - item.data.dge[i].value) > ((item.data.dge[i].value * 20) / 100)) {
                            filled = filled + (item.data.dge[i + 1].value - item.data.dge[i].value);
                        }

                        // console.log(i + " : PER  Day" + initial + ":" + last + ":" + filled)
                    }
                    return (initial + filled - last).toFixed(2);
                }
            }
        }
        return "0";
    }

    // Gas filled for last 15 day for Graph
    getGasFilled(deviceName, days) {
        //getDGEperDay
        let result = [];
        let filled = 0;
        let day = 0;
        if (this.devicedata) {
            let item = this.devicedata.find(function(device) {
                // alert(device.name + ":" + deviceName);
                return device.name == deviceName;
            });

            if (item) {
                if (item.data && item.data.dge) {
                    let initial = item.data.dge.last().value;
                    let last = item.data.dge[0].value;
                    let temp = -1;
                    let i = 0;
                    for (i = 0; i < item.data.dge.length - 1; i++) {
                        // console.log("i :" + item.data.dge[i].value + "-  i+1 :" + item.data.dge[i + 1].value + "--%  :" + ((item.data.dge[i].value * 20) / 100))
                        if ((item.data.dge[i + 1].value - item.data.dge[i].value) > ((item.data.dge[i].value * 20) / 100)) {
                            filled = filled + (item.data.dge[i + 1].value - item.data.dge[i].value);
                        }

                        if (new Date(item.data.dge[i].timestamp).getDate() != temp && temp != -1) {
                            result.push({ timestamp: this.convertDate(item.data.dge[i].timestamp), value: (initial + filled - last).toFixed(2) });
                            // day += 1;
                            // if (day >= days)
                            //     return result;
                        }
                        console.log(i + " : PER  Day" + (new Date(item.data.dge[i].timestamp).getDate()) + ":" + temp);
                        temp = new Date(item.data.dge[i].timestamp).getDate();
                    }
                    return result;
                }
            }
        }
        return "0";
    }
    convertDate(unix_timestamp) {
        var a = new Date(unix_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
}
export default websocketserver;