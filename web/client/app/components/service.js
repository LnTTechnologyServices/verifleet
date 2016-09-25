class VfSharedService {

    constructor() {
        this.vechicleData = [];
         console.log("VfSharedService");
    }

    setVechicleData(data) {
        this.vechicleData = data;
    }

    getVechicleData() {
        return this.vechicleData;
    }
};

export default VfSharedService;