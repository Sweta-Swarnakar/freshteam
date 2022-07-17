import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
 import { render } from '@ember/test-helpers';
 import hbs from 'htmlbars-inline-precompile';

// import {
  
//   visit,
  
// } from '@ember/test-helpers'



module('Integration | Component | users-cards', function(hooks) {
  setupRenderingTest(hooks);

  test('should list available cards.', async function (assert) {
    

    await render(hbs`{{users-cards}}`);

   
      //await visit('/');
      assert.equal(this.element.querySelectorAll('.card').length, 15, 'should display 15 cards');
    });

});


// hooks.beforeEach(function () {
//   this.store = this.owner.lookup('service:store');
//   this.user = this.store.createRecord('user', {

//     img_url: 'fake.png',
//     first_name: 'test-first_name',
//     last_name: 'test-last_name',
//     email: 'test-email',
//     team: 'test-team',
//     joiningDate: 'test-date'

//   });

  

// });
