/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Component from '@ember/component';
import { set, get } from '@ember/object';

export default Component.extend({

  classNames: ["slide-add-emp-div"],
  teams: ['Freshteam', 'Freshdesk', 'Freshservice'],
  selectedTeam: 'Freshteam',



  actions:
  {
    chooseTeam(team) {
      set(this, 'userData.team', team);
    },

    setAvatar() {
      
      const files = document.querySelector(".upload").files;
         if (!files || files.length==0)
              return;
         const file = files[0];
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => {
               document.querySelector(".avatar").src = reader.result;      
         };
    },

    save(userData) {

      userData.save();

    },

  }



});



