define('ember-bootstrap/components/bs-form/group', ['exports', 'ember-bootstrap/components/base/bs-form/group'], function (exports, _group) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _group.default.extend({
    classNames: ['form-group'],
    classNameBindings: ['isHorizontal:row'],

    /**
     * Indicates whether the form type equals `horizontal`
     *
     * @property isHorizontal
     * @type boolean
     * @private
     */
    isHorizontal: Ember.computed.equal('formLayout', 'horizontal').readOnly()
  });
});