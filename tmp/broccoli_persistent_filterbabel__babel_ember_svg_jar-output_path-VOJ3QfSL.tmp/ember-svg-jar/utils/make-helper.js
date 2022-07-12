define("ember-svg-jar/utils/make-helper", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = makeHelper;

  function makeHelper(helperFunc) {
    let helper;

    if (Ember.Helper && Ember.Helper.helper) {
      helper = Ember.Helper.helper(function (_ref, options) {
        let [assetId] = _ref;
        return helperFunc(assetId, options);
      });
    } else {
      helper = Ember.Handlebars.makeBoundHelper(function (assetId, options) {
        return helperFunc(assetId, options.hash || {});
      });
    }

    return helper;
  }
});