/* eslint-disable no-console */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Component from '@ember/component';
import { set, get } from '@ember/object';


export default Component.extend({

  classNames: ["slide-add-emp-div"],
  teams: ['Freshteam', 'Freshdesk', 'Freshservice'],
  selectedTeam: 'Freshteam',




  converImageToBase64() {
    let image = document.querySelector(".upload").files[0];


    const reader = new FileReader();

    return new Promise(resolve => {
      reader.onload = ev => {
        resolve(ev.target.result)
      }
      reader.readAsDataURL(image)
    })

  },



  actions:
  {
    chooseTeam(team) {
      set(this, 'userData.team', team);
    },
    setAvatar() {

      get(this, 'converImageToBase64')().then((result) => {

        set(this, "userData.img_url", result);
      }, (error) => {
        console.log(error);
      })
    },

    save(userData) {


      userData.validate()
        .then(({ validations, }) => {
          if (validations.get('isValid')) {
            userData.save()
              //       window.alert("User added succesfully")
              .then(() => this.set('showSaved', true));
          }
        })

    },

    discardJunk(userData) {

      if (userData.isNew == false && userData.hasDirtyAttributes == true) {
        userData.rollbackAttributes()
      }
      else {
        userData.deleteRecord();
      }


    }

  }
});



