define('ember-popper/components/ember-popper', ['exports', 'ember-popper/components/ember-popper-base'], function (exports, _emberPopperBase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberPopperBase.default.extend({
    /**
     * The element the popper will target.
     * @argument
     * @type(Element)
     */
    popperTarget: null,

    // ================== LIFECYCLE HOOKS ==================

    init() {
      this.id = this.id || `${Ember.guidFor(this)}-popper`;
      this._super(...arguments);
    }
  });
});