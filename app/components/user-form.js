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

    setAvatar(avatar) {

      var input = document.querySelector(".upload").files[0];
      var path = (window.URL || window.webkitURL).createObjectURL(input);
      
    
      //  var image = document.querySelector(".upload").files[0];
        
      // if(!image)
      // {
      //   return
      // }
      // else{
      //   var reader = new FileReader();

      //   reader.onload = function (e) {
      //       var showImage = document.querySelector(".choose-avatar")
      //       showImage.src = e.target.result;
            
          
      // }
     
      // set(this, "userData.img_url", image);

      set(this, "userData.img_url", path)
  }


    ,

    save(userData) {

      userData.save();
      window.alert("User added succesfully");

    },

  }



});



