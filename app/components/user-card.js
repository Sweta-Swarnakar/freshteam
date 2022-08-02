/* eslint-disable no-console */
import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
    classNames: ['card'],
    popUp: false,

    actions: {

        initiateDel() {
            set(this, 'popUp', true);
        },
    }
});
