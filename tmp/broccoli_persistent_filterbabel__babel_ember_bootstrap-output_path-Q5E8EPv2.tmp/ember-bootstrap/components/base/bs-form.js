define('ember-bootstrap/components/base/bs-form', ['exports', 'ember-bootstrap/templates/components/bs-form'], function (exports, _bsForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _bsForm.default,
    tagName: 'form',
    classNameBindings: ['layoutClass'],
    attributeBindings: ['_novalidate:novalidate'],
    ariaRole: 'form',

    /**
     * Bootstrap form class name (computed)
     *
     * @property layoutClass
     * @type string
     * @readonly
     * @protected
     *
     */

    /**
     * Set a model that this form should represent. This serves several purposes:
     *
     * * child `Components.FormElement`s can access and bind to this model by their `property`
     * * when the model supports validation by using the [ember-validations](https://github.com/dockyard/ember-validations) mixin,
     * child `Components.FormElement`s will look at the validation information of their `property` and render their form group accordingly.
     * Moreover the form's `submit` event handler will validate the model and deny submitting if the model is not validated successfully.
     *
     * @property model
     * @type Ember.Object
     * @public
     */
    model: null,

    /**
     * Set the layout of the form to either "vertical", "horizontal" or "inline". See http://getbootstrap.com/css/#forms-inline and http://getbootstrap.com/css/#forms-horizontal
     *
     * @property formLayout
     * @type string
     * @public
     */
    formLayout: 'vertical',

    /**
     * Check if validating the model is supported. This needs to be implemented by another addon.
     *
     * @property hasValidator
     * @type boolean
     * @readonly
     * @protected
     */
    hasValidator: false,

    /**
     * The Bootstrap grid class for form labels. This is used by the `Components.FormElement` class as a default for the
     * whole form.
     *
     * @property horizontalLabelGridClass
     * @type string
     * @default 'col-md-4'
     * @public
     */
    horizontalLabelGridClass: 'col-md-4',

    /**
     * @property elementComponent
     * @type {String}
     * @private
     */
    elementComponent: 'bs-form/element',

    /**
     * @property groupComponent
     * @type {String}
     * @private
     */
    groupComponent: 'bs-form/group',

    /**
     * `isSubmitting` is `true` after `submit` event has been triggered and until Promise returned by `onSubmit` is
     * fulfilled. If `validate` returns a Promise that one is also taken into consideration.
     *
     * If multiple concurrent submit events are fired, it stays `true` until all submit events have been fulfilled.
     *
     * @property isSubmitting
     * @type {Boolean}
     * @readonly
     * @private
     */
    isSubmitting: false,

    /**
     * `isSubmitted` is `true` if last submission was successful.
     * A change to any form element resets it's value to `false`.
     *
     * If not using `Components.FormElement`, `resetSubmissionState` action must be triggered on each change to reset
     * form's submission state.
     *
     * @property isSubmitted
     * @type {Boolean}
     * @private
     */
    isSubmitted: false,

    /**
     * `isRejected` is `true` if last submission was rejected.
     * A submission is considered as rejected if form is invalid as well as if `onSubmit` rejects.
     * A change to any form element resets it's value to `false`.
     *
     * If not using `Components.FormElement`, `resetSubmissionState` action must be triggered on each change to reset
     * form's submission state.
     *
     * @property isRejected
     * @type {Boolean}
     * @private
     */
    isRejected: false,

    /**
     * Count of pending submissions.
     *
     * @property pendingSubmissions
     * @type {Integer}
     * @private
     */
    pendingSubmissions: 0,

    /**
     * If set to true pressing enter will submit the form, even if no submit button is present
     *
     * @property submitOnEnter
     * @type boolean
     * @default false
     * @public
     */
    submitOnEnter: false,

    /**
     * Controls if `onSubmit` action is fired concurrently. If `true` submitting form multiple
     * times will not trigger `onSubmit` action if a Promise returned by previous submission is
     * not settled yet.
     *
     * Droping a submission also prevents rerunning validation and `onBefore` hook.
     *
     * @property preventConcurrency
     * @type Boolean
     * @default false
     * @public
     */
    preventConcurrency: false,

    /**
     * If true, after successful validation and upon submitting the form, all current element validations will be hidden.
     * If the form remains visible, the user would have to focus out of elements of submit the form again for the
     * validations to show up again, as if a fresh new form component had been rendered.
     *
     * @property hideValidationsOnSubmit
     * @type {Boolean}
     * @default false
     * @public
     */
    hideValidationsOnSubmit: false,

    /**
     * If set to true novalidate attribute is present on form element
     *
     * @property novalidate
     * @type boolean
     * @default null
     * @public
     */
    novalidate: false,

    _novalidate: Ember.computed('novalidate', function () {
      return this.get('novalidate') === true ? '' : undefined;
    }),

    /**
     * Validate hook which will return a promise that will either resolve if the model is valid
     * or reject if it's not. This should be overridden to add validation support.
     *
     * @method validate
     * @param {Object} model
     * @return {Promise}
     * @public
     */
    validate(model) {}, // eslint-disable-line no-unused-vars

    /**
     * @property showAllValidations
     * @type boolean
     * @default undefined
     * @private
     */
    showAllValidations: undefined,

    /**
     * Action is called before the form is validated (if possible) and submitted.
     *
     * @event onBefore
     * @param { Object } model  The form's `model`
     * @public
     */
    onBefore(model) {}, // eslint-disable-line no-unused-vars

    /**
     * Action is called when submit has been triggered and the model has passed all validations (if present).
     *
     * @event onSubmit
     * @param { Object } model  The form's `model`
     * @param { Object } result The returned result from the validate method, if validation is available
     * @public
     */
    onSubmit(model, result) {}, // eslint-disable-line no-unused-vars

    /**
     * Action is called when validation of the model has failed.
     *
     * @event onInvalid
     * @param { Object } model  The form's `model`
     * @param { Object } error
     * @public
     */
    onInvalid(model, error) {}, // eslint-disable-line no-unused-vars

    /**
     * Submit handler that will send the default action ("action") to the controller when submitting the form.
     *
     * If there is a supplied `model` that supports validation (`hasValidator`) the model will be validated before, and
     * only if validation is successful the default action will be sent. Otherwise an "invalid" action will be sent, and
     * all the `showValidation` property of all child `Components.FormElement`s will be set to true, so error state and
     * messages will be shown automatically.
     *
     * @method submit
     * @private
     */
    submit(e) {
      if (e) {
        e.preventDefault();
      }

      if (this.get('preventConcurrency') && this.get('isSubmitting')) {
        return;
      }

      this.set('isSubmitting', true);
      this.incrementProperty('pendingSubmissions');

      let model = this.get('model');

      this.get('onBefore')(model);

      Ember.RSVP.resolve(this.get('hasValidator') ? this.validate(this.get('model')) : null).then(record => {
        return Ember.RSVP.resolve().then(() => {
          if (this.get('hideValidationsOnSubmit') === true) {
            this.set('showAllValidations', false);
          }
          return this.get('onSubmit')(model, record);
        }).then(() => {
          if (!this.get('isDestroyed')) {
            this.set('isSubmitted', true);
          }
        }, () => {
          if (!this.get('isDestroyed')) {
            this.set('isRejected', true);
          }
        });
      }, error => {
        this.set('showAllValidations', true);

        return Ember.RSVP.resolve().then(() => {
          return this.get('onInvalid')(model, error);
        }).finally(() => {
          if (!this.get('isDestroyed')) {
            this.set('isRejected', true);
          }
        });
      }).finally(() => {
        if (!this.get('isDestroyed')) {
          if (this.get('pendingSubmissions') === 1) {
            this.set('isSubmitting', false);
          }

          this.decrementProperty('pendingSubmissions');

          // reset forced hiding of validations
          if (this.get('showAllValidations') === false) {
            this.set('showAllValidations', undefined);
          }
        }
      });
    },

    keyPress(e) {
      let code = e.keyCode || e.which;
      if (code === 13 && this.get('submitOnEnter')) {
        this.triggerSubmit();
      }
    },

    triggerSubmit() {
      let event = document.createEvent('Event');
      event.initEvent('submit', true, true);
      this.get('element').dispatchEvent(event);
    },

    actions: {
      change(value, model, property) {
        (true && !(Ember.isPresent(model) && Ember.isPresent(property)) && Ember.assert('You cannot use the form element\'s default onChange action for form elements if not using a model or setting the value directly on a form element. You must add your own onChange action to the form element in this case!', Ember.isPresent(model) && Ember.isPresent(property)));

        if (typeof model.set === 'function') {
          model.set(property, value);
        } else {
          Ember.set(model, property, value);
        }
      },

      resetSubmissionState() {
        this.set('isSubmitted', false);
        this.set('isRejected', false);
      }
    }
  });
});