/* eslint-disable no-console */
//import Component from '@ember/component';
import { set, get } from '@ember/object';
import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['card'],
    popUp: false,
    store: Ember.inject.service(),



    actions: {

        initiateDel() {
            if (this.popUp == false)
                set(this, 'popUp', true);
            else {
                set(this, 'popUp', false);
            }
        },

        async deleteUser(id) {
            set(this, "id", id);

            try {

                await get(this, "store").findRecord('user', id, { backgroundReload: false }).then((user) => {

                    user.deleteRecord();
                    user.save();
                  
                },
                    (error) => {
                        console.log(error);
                    })
    
               
            } catch (error) {
                console.log(error);
                
            }
            
            set(this, 'popUp', false);
            set(this, "isDeleted", true);

        }
    }
});
