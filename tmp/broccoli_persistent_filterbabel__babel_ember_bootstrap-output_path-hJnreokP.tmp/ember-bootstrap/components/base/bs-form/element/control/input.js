define('ember-bootstrap/components/base/bs-form/element/control/input', ['exports', 'ember-bootstrap/components/base/bs-form/element/control', 'ember-bootstrap/mixins/control-attributes'], function (exports, _control, _controlAttributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const allowedTypes = new Map();
  function canUseType(type) {
    if (typeof document !== 'object' || typeof document.createElement !== 'function') {
      // consider all types as supported if running in an
      // environment that doesn't support DOM
      return true;
    }

    if (!allowedTypes.has(type)) {
      try {
        let inputElement = document.createElement('input');
        inputElement.type = type;
        allowedTypes.set(type, true);
      } catch (error) {
        allowedTypes.set(type, false);
      }
    }

    return allowedTypes.get(type);
  }

  /**
  
   @class FormElementControlInput
   @namespace Components
   @extends Components.FormElementControl
   @private
   */
  exports.default = _control.default.extend(_controlAttributes.default, {
    attributeBindings: ['value', 'type', 'placeholder', 'controlSize:size', 'minlength', 'maxlength', 'min', 'max', 'pattern', 'accept', 'autocomplete', 'autocapitalize', 'autocorrect', 'autosave', 'inputmode', 'multiple', 'step', 'spellcheck'],
    classNames: ['form-control'],

    /**
     * @property type
     * @type {String}
     * @public
     */
    type: Ember.computed({
      get() {
        return 'text';
      },
      set(key, value) {
        // fallback to 'text' if value is empty
        if (Ember.isEmpty(value)) {
          return 'text';
        }

        // IE 11 throws if setting an unsupported type via DOM.
        // We guard against that behaviour by testing if user
        // agent throws on setting the provided type.
        // This is inspired by input helper shipped with Ember.js:
        // https://github.com/emberjs/ember.js/blob/30137796af42c63b28ead127cba0e43e45a773c1/packages/%40ember/-internals/glimmer/lib/components/text_field.ts#L93-L115
        if (!canUseType(value)) {
          return 'text';
        }

        return value;
      }
    }),

    change(event) {
      this.get('onChange')(event.target.value);
    },

    input(event) {
      this.get('onChange')(event.target.value);
    }

  });
});