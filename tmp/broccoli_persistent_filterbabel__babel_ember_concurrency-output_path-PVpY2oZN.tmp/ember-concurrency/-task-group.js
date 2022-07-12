define('ember-concurrency/-task-group', ['exports', 'ember-concurrency/utils', 'ember-concurrency/-task-state-mixin', 'ember-concurrency/-property-modifiers-mixin'], function (exports, _utils, _taskStateMixin, _propertyModifiersMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TaskGroupProperty = exports.TaskGroup = undefined;
  const TaskGroup = exports.TaskGroup = Ember.Object.extend(_taskStateMixin.default, {
    isTaskGroup: true,

    toString() {
      return `<TaskGroup:${this._propertyName}>`;
    },

    _numRunningOrNumQueued: Ember.computed.or('numRunning', 'numQueued'),
    isRunning: Ember.computed.bool('_numRunningOrNumQueued'),
    isQueued: false
  });

  let TaskGroupProperty = exports.TaskGroupProperty = undefined;

  if (false) {
    exports.TaskGroupProperty = TaskGroupProperty = class {};
  } else {
    exports.TaskGroupProperty = TaskGroupProperty = class extends _utils._ComputedProperty {};
  }

  (0, _utils.objectAssign)(TaskGroupProperty.prototype, _propertyModifiersMixin.propertyModifiers);
});