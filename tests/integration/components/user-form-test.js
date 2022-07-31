import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, typeIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | user-form', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);




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


  test("all elements are present", async function (assert) {

    await render(hbs`{{user-form}}`);
    assert.dom(".user-input").exists({ count: 6 }, 'shows 6 inputs');
    assert.dom(".circle").exists('shows image tag')

  });

  // test("I can view 16 users", async function (assert) {

  //   this.users = this.server.createList('user', 15);
  //   await render(hbs`{{users-cards model=this.users}}`);
  //   await render(hbs`{{user-form  userData =this.user}}`)
 
  //   await typeIn('#firstName', 'Person 15');
  //   await typeIn('#email', 'Person@');
  //   await typeIn('#design', 'Frontend');
  //   await typeIn('#lastName', 'Title 15');
    
  //   await click(".apply");
    
  
  //   assert.dom(".card").exists({ count: 16 }, 'shows 16 data')
  // });
});
