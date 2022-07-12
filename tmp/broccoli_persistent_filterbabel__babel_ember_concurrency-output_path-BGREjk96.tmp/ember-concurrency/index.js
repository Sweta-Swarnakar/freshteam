define('ember-concurrency/index', ['exports', 'ember-concurrency/utils', 'ember-concurrency/-task-property', 'ember-concurrency/-task-instance', 'ember-concurrency/-task-group', 'ember-concurrency/-cancelable-promise-helpers', 'ember-concurrency/-wait-for', 'ember-concurrency/-property-modifiers-mixin'], function (exports, _utils, _taskProperty, _taskInstance, _taskGroup, _cancelablePromiseHelpers, _waitFor, _propertyModifiersMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.forever = exports.waitForProperty = exports.waitForEvent = exports.waitForQueue = exports.timeout = exports.race = exports.hash = exports.didCancel = exports.allSettled = exports.all = undefined;
  exports.task = task;
  exports.taskGroup = taskGroup;


  function _computed(fn) {
    if (false) {
      let cp = function (proto, key) {
        if (cp.setup !== undefined) {
          cp.setup(proto, key);
        }

        return Ember.computed(fn)(...arguments);
      };

      Ember._setComputedDecorator(cp);

      return cp;
    } else {
      return Ember.computed(fn);
    }
  }

  /**
   * A Task is a cancelable, restartable, asynchronous operation that
   * is driven by a generator function. Tasks are automatically canceled
   * when the object they live on is destroyed (e.g. a Component
   * is unrendered).
   *
   * To define a task, use the `task(...)` function, and pass in
   * a generator function, which will be invoked when the task
   * is performed. The reason generator functions are used is
   * that they (like the proposed ES7 async-await syntax) can
   * be used to elegantly express asynchronous, cancelable
   * operations.
   *
   * You can also define an
   * <a href="/#/docs/encapsulated-task">Encapsulated Task</a>
   * by passing in an object that defined a `perform` generator
   * function property.
   *
   * The following Component defines a task called `myTask` that,
   * when performed, prints a message to the console, sleeps for 1 second,
   * prints a final message to the console, and then completes.
   *
   * ```js
   * import { task, timeout } from 'ember-concurrency';
   * export default Component.extend({
   *   myTask: task(function * () {
   *     console.log("Pausing for a second...");
   *     yield timeout(1000);
   *     console.log("Done!");
   *   })
   * });
   * ```
   *
   * ```hbs
   * <button {{action myTask.perform}}>Perform Task</button>
   * ```
   *
   * By default, tasks have no concurrency constraints
   * (multiple instances of a task can be running at the same time)
   * but much of a power of tasks lies in proper usage of Task Modifiers
   * that you can apply to a task.
   *
   * @param {function} generatorFunction the generator function backing the task.
   * @returns {TaskProperty}
   */
  function task(taskFn) {
    let tp = _computed(function (_propertyName) {
      tp.taskFn.displayName = `${_propertyName} (task)`;
      return _taskProperty.Task.create({
        fn: tp.taskFn,
        context: this,
        _origin: this,
        _taskGroupPath: tp._taskGroupPath,
        _scheduler: (0, _propertyModifiersMixin.resolveScheduler)(tp, this, _taskGroup.TaskGroup),
        _propertyName,
        _debug: tp._debug,
        _hasEnabledEvents: tp._hasEnabledEvents
      });
    });

    tp.taskFn = taskFn;

    Object.setPrototypeOf(tp, _taskProperty.TaskProperty.prototype);

    return tp;
  }

  /**
   * "Task Groups" provide a means for applying
   * task modifiers to groups of tasks. Once a {@linkcode Task} is declared
   * as part of a group task, modifiers like `drop()` or `restartable()`
   * will no longer affect the individual `Task`. Instead those
   * modifiers can be applied to the entire group.
   *
   * ```js
   * import { task, taskGroup } from 'ember-concurrency';
   *
   * export default Controller.extend({
   *   chores: taskGroup().drop(),
   *
   *   mowLawn:       task(taskFn).group('chores'),
   *   doDishes:      task(taskFn).group('chores'),
   *   changeDiapers: task(taskFn).group('chores')
   * });
   * ```
   *
   * @returns {TaskGroup}
   */
  function taskGroup(taskFn) {
    let tp = _computed(function (_propertyName) {
      return _taskGroup.TaskGroup.create({
        fn: tp.taskFn,
        context: this,
        _origin: this,
        _taskGroupPath: tp._taskGroupPath,
        _scheduler: (0, _propertyModifiersMixin.resolveScheduler)(tp, this, _taskGroup.TaskGroup),
        _propertyName
      });
    });

    tp.taskFn = taskFn;

    Object.setPrototypeOf(tp, _taskGroup.TaskGroupProperty.prototype);

    return tp;
  }

  exports.all = _cancelablePromiseHelpers.all;
  exports.allSettled = _cancelablePromiseHelpers.allSettled;
  exports.didCancel = _taskInstance.didCancel;
  exports.hash = _cancelablePromiseHelpers.hash;
  exports.race = _cancelablePromiseHelpers.race;
  exports.timeout = _utils.timeout;
  exports.waitForQueue = _waitFor.waitForQueue;
  exports.waitForEvent = _waitFor.waitForEvent;
  exports.waitForProperty = _waitFor.waitForProperty;
  exports.forever = _utils.forever;
});