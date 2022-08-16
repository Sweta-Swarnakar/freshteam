import Route from '@ember/routing/route';
import {set, get} from '@ember/object';

export default Route.extend({
  queryParams: {
    isUserRoute: {
      refreshModel: true
    }
  },

setupController: function(controller, model) {
  
    controller.set('model', model);
    let value = get(this, 'params')
    controller.set('value', value);

    
  },
model(params) {
    
    set(this, 'params', params)
   
    

}

});
    
