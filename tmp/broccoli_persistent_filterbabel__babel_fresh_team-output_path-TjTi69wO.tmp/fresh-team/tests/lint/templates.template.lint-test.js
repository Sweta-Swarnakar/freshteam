define('fresh-team/tests/lint/templates.template.lint-test', [], function () {
  'use strict';

  QUnit.module('TemplateLint');

  QUnit.test('fresh-team/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'fresh-team/templates/application.hbs should pass TemplateLint.\n\n');
  });

  QUnit.test('fresh-team/templates/users.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'fresh-team/templates/users.hbs should pass TemplateLint.\n\n');
  });
});