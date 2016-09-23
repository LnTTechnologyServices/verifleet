class VfSharedService {

    constructor() {
        this.mem = [];
         console.log("VfSharedService");
        
    }

    setBarValue(data) {
        this.mem = data;
    }

    getBarValue() {
        return this.mem;
    }

     
   
};

export default VfSharedService;