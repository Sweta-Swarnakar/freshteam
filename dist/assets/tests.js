'use strict';

define('fresh-team/tests/lint/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/ls-adapter.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'adapters/ls-adapter.js should pass ESLint\n\n335:33 - \'LSAdapter\' is not defined. (no-undef)');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('models/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/user.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/users.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/users.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ls-serializer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ls-serializer.js should pass ESLint\n\n');
  });
});
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
define('fresh-team/tests/lint/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/ls-adapter.js-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/ls-adapter.js-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/user-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/serializers/application.js-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/application.js-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/serializers/ls-serializer.js-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/ls-serializer.js-test.js should pass ESLint\n\n');
  });
});
define('fresh-team/tests/test-helper', ['fresh-team/app', 'fresh-team/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('fresh-team/tests/unit/adapters/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Adapter | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let adapter = this.owner.lookup('adapter:application');
      assert.ok(adapter);
    });
  });
});
define('fresh-team/tests/unit/adapters/ls-adapter.js-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Adapter | ls adapter.js', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let adapter = this.owner.lookup('adapter:ls-adapter.js');
      assert.ok(adapter);
    });
  });
});
define('fresh-team/tests/unit/models/user-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | user', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = store.createRecord('user', {});
      assert.ok(model);
    });
  });
});
define('fresh-team/tests/unit/routes/users-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | users', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:users');
      assert.ok(route);
    });
  });
});
define('fresh-team/tests/unit/serializers/application.js-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Serializer | application.js', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let serializer = store.serializerFor('application.js');

      assert.ok(serializer);
    });

    (0, _qunit.test)('it serializes records', function (assert) {
      let store = this.owner.lookup('service:store');
      let record = store.createRecord('application.js', {});

      let serializedRecord = record.serialize();

      assert.ok(serializedRecord);
    });
  });
});
define('fresh-team/tests/unit/serializers/ls-serializer.js-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Serializer | ls serializer.js', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let serializer = store.serializerFor('ls-serializer.js');

      assert.ok(serializer);
    });

    (0, _qunit.test)('it serializes records', function (assert) {
      let store = this.owner.lookup('service:store');
      let record = store.createRecord('ls-serializer.js', {});

      let serializedRecord = record.serialize();

      assert.ok(serializedRecord);
    });
  });
});
define('fresh-team/config/environment', [], function() {
  var prefix = 'fresh-team';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('fresh-team/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
