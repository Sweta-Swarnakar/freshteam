import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-card', function(hooks) {
  setupRenderingTest(hooks);

  // test('it renders', async function(assert) {
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.set('myAction', function(val) { ... });

  //   await render(hbs`{{user-card}}`);

  //   assert.equal(this.element.textContent.trim(), '');

  //   // Template block usage:
  //   await render(hbs`
  //     {{#user-card}}
  //       template block text
  //     {{/user-card}}
  //   `);

  //   assert.equal(this.element.textContent.trim(), 'template block text');
  // });

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


 test('if the all the elements are present or not', async function(assert) {
  // set(this, 'user.img_url', null); 
  await render(hbs`{{user-card user = this.user}}`);
  
  assert.dom('.circle-div').exists('the circle is present');
  assert.dom('strong.name').hasAnyText();
  assert.dom('p.email').hasAnyText();

});
});

// });
