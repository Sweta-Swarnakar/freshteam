define('ember-bootstrap/utils/overrideable-cp', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = overrideableCP;


  /**
   * CP macro that created a regular computed property, which can be manually overriden.
   * This is needed after implicitly overrideable CPs have been deprecated:
   * https://deprecations-app-prod.herokuapp.com/deprecations/v3.x/#toc_computed-property-override
   *
   * @private
   */
  function overrideableCP() {
    let fn = Array.prototype.slice.call(arguments, -1)[0];
    let args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    (true && !(typeof fn === 'function') && Ember.assert('Last argument for overrideableCP must be a function', typeof fn === 'function'));


    return Ember.computed(...args, {
      get(key) {
        let overridden = this[`__${key}`];
        return overridden || fn.call(this);
      },
      set(key, value) {
        this[`__${key}`] = value;
        return value;
      }
    });
  }
});