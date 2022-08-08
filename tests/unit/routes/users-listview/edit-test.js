import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | users-listview/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:users-listview/edit');
    assert.ok(route);
  });
});
