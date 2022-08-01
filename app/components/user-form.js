/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Component from '@ember/component';
import { set } from '@ember/object';

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

      var input = document.querySelector(".upload").files[0];
      var path = (window.URL || window.webkitURL).createObjectURL(input);
      

      set(this, "userData.img_url", path)
  }


    ,

    save(userData) {

      userData.save();
      window.alert("User added succesfully");

    },

  }



});



