class BigIconController {
  constructor() {
    "ngInject";
    this.name = 'bigIcon';
    this.colloroff = "#ECC800";
    this.coloron = "#424242";
    this.opacityoff = 54; //Represented in 0 - 100%
    this.opacityon = 100; //Represented in 0 - 100%
    this.state = "off";
  }

   /**Returns color of the icon based on current state. 
    * Binded to ng-style of nd-md-icon element. */
   get color()
   {
     switch (this.state) {
            case 'on':
            case '1':
                return this.coloron;
            case 'off':  
            case '0':
                return this.coloroff;
            default:                
                return this.coloroff;
        }
    }

   /**Return opacity level for the icon based on current state. 
    * Binded to ng-style of nd-md-icon element.*/
   get opacity()
   {
     switch (this.state) {
            case 'on':
            case '1':
                return this.opacityon;
            case 'off':  
            case '0':
                return this.opacityoff;
            default:                
                return this.opacityoff;
        }
    }

  $onChanges(changes) {
    if(changes.state) {
      this.state = changes.state.currentValue;
    }

     if(changes.coloron) {
      this.coloron = changes.coloron.currentValue;
    }

     if(changes.coloroff) {
      this.coloroff = changes.coloroff.currentValue;
    }
  }
}

export default BigIconController;