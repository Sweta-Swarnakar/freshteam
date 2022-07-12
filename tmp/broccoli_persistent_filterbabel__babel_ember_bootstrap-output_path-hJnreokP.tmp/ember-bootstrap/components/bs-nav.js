define('ember-bootstrap/components/bs-nav', ['exports', 'ember-bootstrap/components/base/bs-nav'], function (exports, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsNav.default.extend({
    classNameBindings: ['stacked:flex-column', 'fill:nav-fill'],

    /**
      * Make the nav flex fill, see [bootstrap docs](http://getbootstrap.com/docs/4.1/components/navs/#fill-and-justify)
      *
      * @property fill
      * @type boolean
      * @default false
      * @public
      */
    fill: false

  });
});