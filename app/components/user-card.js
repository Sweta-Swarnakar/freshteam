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
            if(this.popUp == false)
            set(this, 'popUp', true);
            else{
                set(this, 'popUp', false);
            }
        },

        deleteUser(id) {
            get(this, "store").findRecord('user', id, { backgroundReload: false }).then((user) => {

                user.deleteRecord();
                user.get('isDeleted');
                user.save();
                set(this, 'popUp', false);
                window.location.reload();
            }, (error) => {
                console.log(error);
            })
        }
    }
});
