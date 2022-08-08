import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click,typeIn} from '@ember/test-helpers';

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
      await render(hbs`{{users-cards model=this.users}}`);

      assert.dom('.circle-div').exists('the circle is present');
      let name = [this.users.firstObject.first_name, this.users.firstObject.last_name].join(' ');
      assert.dom('.name').hasTextContaining(name);
      assert.dom('.email').hasText(this.users.firstObject.email);
    });

    test("I can view filtered cards", async function (assert) {

      this.users = this.server.createList('user', 15);
      await render(hbs`{{users-cards model=this.users}}`);

      await click(".dropdown-toggle");

      await click('[data-test-id="Freshteam"]');

      let name = [this.users.firstObject.first_name, this.users.firstObject.last_name].join(' ');
      assert.dom('.name').hasTextContaining(name);
      assert.dom('.email').hasText(this.users.firstObject.email);
   });

   test("I can view sorted cards", async function (assert) {

    this.users = this.server.createList('user', 15);
    await render(hbs`{{users-cards model=this.users}}`);

    await click('[data-test-id="sort-click"]');

    await click('[data-test-id="first_name"]');

    let name = [this.users.firstObject.first_name, this.users.firstObject.last_name].join(' ');
    assert.dom('.name').hasTextContaining(name);
    assert.dom('.email').hasText(this.users.firstObject.email);
  });


  test("I can view searched cards", async function (assert) {

    this.users = this.server.createList('user', 15);

    await render(hbs`{{users-cards model=this.users}}`);

    await typeIn('input', '14');

    assert.dom(".card").exists({ count: 1 }, 'shows Person 1 card')
    let name = [this.users.lastObject.first_name, this.users.lastObject.last_name].join(' '); 
    assert.dom("strong.name").hasTextContaining(name);
    assert.dom('.email').hasText(this.users.lastObject.email);

  });

  test("I can see the users after deleting", async function (assert) {

    this.users = this.server.createList('user', 15);

    await render(hbs`{{users-cards model=this.users}}`);

    let id = this.users.firstObject.id;
    

    await click(`[data-test-id=${id}] .init-del`);
   
    await click(".del-confirm");
    assert.dom('.card').exists({ count: 14 }, 'shows 14 data')
  });
});