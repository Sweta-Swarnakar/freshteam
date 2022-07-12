define('ember-bootstrap/components/bs-form/element/layout/horizontal', ['exports', 'ember-bootstrap/components/base/bs-form/element/layout/horizontal'], function (exports, _horizontal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _horizontal.default.extend({
    /**
     * Computed property that specifies the Bootstrap offset grid class for form controls within a horizontal layout
     * form, that have no label.
     *
     * @property horizontalInputOffsetGridClass
     * @type string
     * @readonly
     * @private
     */
    horizontalInputOffsetGridClass: Ember.computed('horizontalLabelGridClass', function () {
      if (Ember.isBlank(this.get('horizontalLabelGridClass'))) {
        return;
      }
      let parts = this.get('horizontalLabelGridClass').split('-');
      parts.splice(0, 1, 'offset');
      return parts.join('-');
    })
  });
});