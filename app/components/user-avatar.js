import Component from '@ember/component';


export default Component.extend({

   
    init() {
        this._super(...arguments);
        this.set('errors', []);
      

      
  var data = Object.keys(this.attrs).map(k => this[k]) 


    let temp = data[0];
    let firstChar = temp[0];
    console.log(firstChar);
    }

});








