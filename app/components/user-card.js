/* eslint-disable no-console */
//import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import Ember from 'ember';
import { inject } from '@ember/service';

// eslint-disable-next-line ember/new-module-imports
export default Ember.Component.extend({
    classNames: ['card'],
    attributeBindings: ["data-test-id"],
    popUp: false,
    store: inject(),

    'data-test-id': computed('user', function () {


        return get(this, 'user.id');


    }),

    actions: {

        initiateDel() {
            if (this.popUp == false)
                set(this, 'popUp', true);
            else {
                set(this, 'popUp', false);
            }
        },

        deleteUser(user) {
            user.deleteRecord();
            user.save();
            set(this, 'popUp', false);

        }
    }
});
