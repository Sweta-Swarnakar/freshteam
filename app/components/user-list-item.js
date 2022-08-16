/* eslint-disable no-console */
//import Component from '@ember/component';
import { set, get, computed} from '@ember/object';
import Ember from 'ember';
import { inject } from '@ember/service';

// eslint-disable-next-line ember/new-module-imports
export default Ember.Component.extend({
  
    popUp: false,
    store: inject(),

    randomColor: computed(function(){
      
        var colors = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'violet', 'pink', 'coral'];
    
        return `${colors[Math.floor(Math.random() * colors.length)]}`
    
      }),
      
     firstChar: computed('user', function()
     {
        let users = this.user;
         return users.first_name[0];
     }),
      
    
  
    
 
    actions: {

        initiateDel() {
            if (this.popUp == false)
                set(this, 'popUp', true);
            else {
                set(this, 'popUp', false);
            }
        },

        deleteUser(user) {
            user.deleteRecord();
            user.save();
            set(this, 'popUp', false);

        }
    }
});

