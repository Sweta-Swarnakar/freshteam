define('ember-bootstrap/components/bs-button', ['exports', 'ember-bootstrap/components/base/bs-button'], function (exports, _bsButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsButton.default.extend({
    type: 'secondary',

    /**
     * Property to create outline buttons (BS4+ only)
     *
     * @property disabled
     * @type boolean
     * @default false
     * @public
     */
    outline: false
  });
});