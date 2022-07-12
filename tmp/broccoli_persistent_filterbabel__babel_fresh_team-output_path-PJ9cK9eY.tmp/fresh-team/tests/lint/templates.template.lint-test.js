define('fresh-team/tests/lint/templates.template.lint-test', [], function () {
  'use strict';

  QUnit.module('TemplateLint');

  QUnit.test('fresh-team/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'fresh-team/templates/application.hbs should pass TemplateLint.\n\nfresh-team/templates/application.hbs\n  2:4  error  Incorrect indentation for `<img>` beginning at L2:C4. Expected `<img>` to be at an indentation of 2 but was found at 4.  block-indentation\n  3:4  error  Incorrect indentation for `<span>` beginning at L3:C4. Expected `<span>` to be at an indentation of 2 but was found at 4.  block-indentation\n  2:4  error  img tags must have an alt attribute  img-alt-attributes\n  2:4  error  Self-closing a void element is redundant  self-closing-void-elements\n');
  });
});