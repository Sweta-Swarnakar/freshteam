/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Component from '@ember/component';
import {set} from '@ember/object';

export default Component.extend({

  classNames: ["slide-add-emp-div"],
  teams: ['Freshteam', 'Freshdesk', 'Freshservice'],
  selectedTeam: 'Freshteam',



  actions:
  {
    chooseTeam(team) {

      set(this,'selectedTeam', team);

    },

      save(userData) {

        userData.save();
        
      },
     
    }

  

});



