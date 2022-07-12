define('ember-bootstrap/components/bs-form/element', ['exports', 'ember-bootstrap/components/base/bs-form/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _element.default.extend({
    init() {
      this._super(...arguments);
      this.set('doNotShowValidationForEventTargets', ['.input-group-append', '.input-group-prepend']);
    }
  });
});