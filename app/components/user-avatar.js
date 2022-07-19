import Component from '@ember/component';
import { computed } from '@ember/object';


export default Component.extend({

   classNames: ['circle-div'],

  randomColor: computed(function(){
      
    var colors = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'violet', 'pink', 'coral'];

    return `${colors[Math.floor(Math.random() * colors.length)]}`

  }),
  
 firstChar: computed('user', function()
 {
    let users = this.user;
     return users.first_name[0];
 })
  

});








