define('ember-bootstrap/components/base/bs-form/element/control/radio', ['exports', 'ember-bootstrap/components/base/bs-form/element/control', 'ember-bootstrap/templates/components/bs-form/element/control/radio'], function (exports, _control, _radio) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _control.default.extend({
    layout: _radio.default,
    tagName: '',

    /**
     * @property inline
     * @type {Boolean}
     * @default false
     * @public
     */
    inline: false
  });
});