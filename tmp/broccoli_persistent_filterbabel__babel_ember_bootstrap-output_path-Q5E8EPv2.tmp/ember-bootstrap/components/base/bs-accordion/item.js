define('ember-bootstrap/components/base/bs-accordion/item', ['exports', 'ember-bootstrap/mixins/type-class', 'ember-bootstrap/templates/components/bs-accordion/item'], function (exports, _typeClass, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_typeClass.default, {
    layout: _item.default,

    /**
     * Add additional binding to mark the entire component area disabled
     */
    classNameBindings: ['disabled'],
    /**
     * The title of the accordion item, displayed as a .panel-title element
     *
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * The value of the accordion item, which is used as the value of the `selected` property of the parent [Components.Accordion](Components.Accordion.html) component
     *
     * @property value
     * @public
     */
    value: Ember.computed.oneWay('elementId'),

    /**
     * @property selected
     * @private
     */
    selected: null,

    /**
     * @property titleComponent
     * @type {String}
     * @private
     */
    titleComponent: 'bs-accordion/item/title',

    /**
     * @property bodyComponent
     * @type {String}
     * @private
     */
    bodyComponent: 'bs-accordion/item/body',

    /**
     * @property collapsed
     * @type boolean
     * @readonly
     * @private
     */
    collapsed: Ember.computed('value', 'selected', function () {
      return this.get('value') !== this.get('selected');
    }).readOnly(),

    /**
     * @property active
     * @type boolean
     * @readonly
     * @private
     */
    active: Ember.computed.not('collapsed'),

    /**
     * @property disabled
     * @type boolean
     * @public
     */
    disabled: false,

    /**
     * Reference to the parent `Components.Accordion` class.
     *
     * @property accordion
     * @private
     */
    accordion: null,

    /**
     * @event onClick
     * @public
     */
    onClick() {}

  });
});