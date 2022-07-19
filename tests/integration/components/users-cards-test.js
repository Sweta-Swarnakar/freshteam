import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | users-cards', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("I can view the users", async function (assert) {

    this.users = this.server.createList('user', 15);
    await render(hbs`{{users-cards model=this.users}}`);

    assert.dom(".card").exists({ count: 15 }, 'shows 15 data')
  });

  test("I can view details of card ", async function (assert) {

    this.users = this.server.createList('user', 15);
    await render(hbs`{{users-cards model=this.users.firstObject}}`);

    assert.dom('.circle-div').exists('the circle is present');
    assert.dom('strong.name').hasText(this.users.name);
    assert.dom('p.email').hasText(this.users.email);

  });
});