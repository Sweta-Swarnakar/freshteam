import Component from '@ember/component';
import { computed } from '@ember/object';

/**
 * 1. Go through docs very well.
 * 2. Component lifecycle.
 * 3. How HBS and JS can work together.
 */

//'#' + Math.random().toString(16).substr(-6);  random colors

// classNames
// classNameBindings


export default Component.extend({

  // classNames: ['circle-div'],

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








