import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
//import EmberObject from '@ember/object';
import { set } from '@ember/object';

module('Integration | Component | user-avatar', function (hooks) {
  setupRenderingTest(hooks);

  // test('it renders img when a user with avatar is passed', async function(assert) {
  //   let store = ;
  //   this.user = this.store.createRecord('user', {
  //     firstName: '',
  //     avatar: ''
  //   })

  //   await render(hbs`{{user-avatar user=user}}`);



  //});


  hooks.beforeEach(function () {
    this.store = this.owner.lookup('service:store');
    this.user = this.store.createRecord('user', {

      img_url: 'fake.png',
      first_name: 'test-first_name',
      last_name: 'test-last_name',
      email: 'test-email',
      team: 'test-team',
      joiningDate: 'test-date'

    });
  });


 test('it renders img when a user with avatar is passed', async function(assert) {
  set(this, 'user.img_url', null); 
  await render(hbs`{{user-avatar user = this.user}}`);
  
  assert.dom('[data-test-id="user-avatar"]').doesNotExist('The img tag does not exist');
  assert.dom('[data-test-id="no-user-avatar"]').exists();

});
});
