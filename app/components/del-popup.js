import Component from '@ember/component';
import { get, set } from '@ember/object';
import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['pop-up'],
    store: Ember.inject.service(),


    actions: {
        deleteUser(id) {
            get(this, "store").findRecord('user', id, { backgroundReload: false }).then((user) => {

                user.deleteRecord();
                user.get('isDeleted');
                user.save();
                window.location.reload();
            }, (error) => {
                console.log(error);
            })
        },

        stopDel(){
    
              set(this, 'pop', false); 
        }
    }
});
