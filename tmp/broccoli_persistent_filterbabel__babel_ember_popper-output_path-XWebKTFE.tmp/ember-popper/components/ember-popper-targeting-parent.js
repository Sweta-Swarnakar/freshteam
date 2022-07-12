define('ember-popper/components/ember-popper-targeting-parent', ['exports', 'ember-popper/components/ember-popper-base', 'ember-popper/templates/components/ember-popper-targeting-parent'], function (exports, _emberPopperBase, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberPopperBase.default.extend({
    layout: _emberPopperTargetingParent.default,

    // ================== LIFECYCLE HOOKS ==================

    init() {
      this.id = this.id || `${Ember.guidFor(this)}-popper`;
      this._parentFinder = self.document ? self.document.createTextNode('') : '';
      this._super(...arguments);
    },

    didInsertElement() {
      this._super(...arguments);
      this._initialParentNode = this._parentFinder.parentNode;
    },

    /**
     * Used to get the popper target whenever updating the Popper
     */
    _getPopperTarget() {
      return this._initialParentNode;
    }
  });
});