import Component from '@ember/component';
import {set} from '@ember/object';

export default Component.extend({

    teams: ['Freshteam', 'Freshdesk', 'Freshservice'],
    team : 'Freshteam',

  
  
actions:
  {
    chooseTeam(team) {
        set(this, 'selectedTeam', team);
      }
  }
 
});


