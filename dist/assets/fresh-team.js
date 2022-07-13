'use strict';



;define('fresh-team/adapters/application', ['exports', 'fresh-team/adapters/ls-adapter'], function (exports, _lsAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _lsAdapter.default.extend({});
});
;define('fresh-team/adapters/ls-adapter', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const DEFAULT_NAMESPACE = 'freshteam';

  exports.default = _emberData.default.JSONAPIAdapter.extend(Ember.Evented, {
    /**
     * This governs if promises will be resolved immediately for `findAll`
     * requests or if they will wait for the store requests to finish. This matches
     * the ember < 2.0 behavior.
     * [deprecation id: ds.adapter.should-reload-all-default-behavior]
     */
    shouldReloadAll: function () /* modelClass, snapshotArray */{
      return true;
    },

    /**
     * Conforms to ember <2.0 behavior, in order to remove deprecation.
     * Probably safe to remove if running on ember 2.0
     * [deprecation id: ds.model.relationship-changing-to-asynchrounous-by-default]
     */
    shouldBackgroundReloadRecord: function () {
      return false;
    },

    /**
      This is the main entry point into finding records. The first parameter to
      this method is the model's name as a string.
       @method find
      @param {DS.Model} type
      @param {Object|String|Integer|null} id
      */
    findRecord: function (store, type, id, opts) {
      var allowRecursive = true;
      var namespace = this._namespaceForType(type);
      var record = Ember.A(namespace.records[id]);

      /**
       * In the case where there are relationships, this method is called again
       * for each relation. Given the relations have references to the main
       * object, we use allowRecursive to avoid going further into infinite
       * recursiveness.
       *
       * Concept from ember-indexdb-adapter
       */
      if (opts && typeof opts.allowRecursive !== 'undefined') {
        allowRecursive = opts.allowRecursive;
      }

      if (!record || !record.hasOwnProperty('id')) {
        return Ember.RSVP.reject(new Error("Couldn't find record of" + " type '" + type.modelName + "' for the id '" + id + "'."));
      }

      if (allowRecursive) {
        return this.loadRelationships(store, type, record);
      } else {
        return Ember.RSVP.resolve(record);
      }
    },

    findMany: function (store, type, ids, opts) {
      var namespace = this._namespaceForType(type);
      var allowRecursive = true,
          results = Ember.A([]),
          record;

      /**
       * In the case where there are relationships, this method is called again
       * for each relation. Given the relations have references to the main
       * object, we use allowRecursive to avoid going further into infinite
       * recursiveness.
       *
       * Concept from ember-indexdb-adapter
       */
      if (opts && typeof opts.allowRecursive !== 'undefined') {
        allowRecursive = opts.allowRecursive;
      }

      for (var i = 0; i < ids.length; i++) {
        record = namespace.records[ids[i]];
        if (!record || !record.hasOwnProperty('id')) {
          return Ember.RSVP.reject(new Error("Couldn't find record of type '" + type.modelName + "' for the id '" + ids[i] + "'."));
        }
        results.push(Ember.copy(record));
      }

      if (results.get('length') && allowRecursive) {
        return this.loadRelationshipsForMany(store, type, results);
      } else {
        return Ember.RSVP.resolve(results);
      }
    },

    // Supports queries that look like this:
    //
    //   {
    //     <property to query>: <value or regex (for strings) to match>,
    //     ...
    //   }
    //
    // Every property added to the query is an "AND" query, not "OR"
    //
    // Example:
    //
    //  match records with "complete: true" and the name "foo" or "bar"
    //
    //    { complete: true, name: /foo|bar/ }
    query: function (store, type, query /*recordArray*/) {
      var namespace = this._namespaceForType(type);
      var results = this._query(namespace.records, query);

      if (results.get('length')) {
        return this.loadRelationshipsForMany(store, type, results);
      } else {
        return Ember.RSVP.resolve(results);
      }
    },

    _query: function (records, query) {
      var results = Ember.A([]),
          record;

      function recordMatchesQuery(record) {
        return Object.keys(query).every(function (property) {
          var test = query[property];
          if (Object.prototype.toString.call(test) === '[object RegExp]') {
            return test.test(record[property]);
          } else {
            return record[property] === test;
          }
        });
      }

      for (var id in records) {
        record = records[id];
        if (recordMatchesQuery(record)) {
          results.push(Ember.copy(record));
        }
      }
      return results;
    },

    findAll: function (store, type) {
      var namespace = this._namespaceForType(type),
          results = Ember.A([]);

      for (var id in namespace.records) {
        results.push(Ember.copy(namespace.records[id]));
      }
      return Ember.RSVP.resolve(results);
    },

    createRecord: function (store, type, snapshot) {
      var namespaceRecords = this._namespaceForType(type);
      var serializer = store.serializerFor(type.modelName);
      var recordHash = serializer.serialize(snapshot, { includeId: true });

      namespaceRecords.records[recordHash.id] = recordHash;

      this.persistData(type, namespaceRecords);
      return Ember.RSVP.resolve();
    },

    updateRecord: function (store, type, snapshot) {
      var namespaceRecords = this._namespaceForType(type);
      var id = snapshot.id;
      var serializer = store.serializerFor(type.modelName);

      namespaceRecords.records[id] = serializer.serialize(snapshot, { includeId: true });

      this.persistData(type, namespaceRecords);
      return Ember.RSVP.resolve();
    },

    deleteRecord: function (store, type, snapshot) {
      var namespaceRecords = this._namespaceForType(type);
      var id = snapshot.id;

      delete namespaceRecords.records[id];

      this.persistData(type, namespaceRecords);
      return Ember.RSVP.resolve();
    },

    generateIdForRecord: function () {
      return Math.random().toString(32).slice(2).substr(0, 5);
    },

    // private

    adapterNamespace: function () {
      return this.get('namespace') || DEFAULT_NAMESPACE;
    },

    loadData: function () {
      var storage = this.getLocalStorage().getItem(this.adapterNamespace());
      return storage ? JSON.parse(storage) : {};
    },

    persistData: function (type, data) {
      var modelNamespace = this.modelNamespace(type);
      var localStorageData = this.loadData();

      localStorageData[modelNamespace] = data;

      this.getLocalStorage().setItem(this.adapterNamespace(), JSON.stringify(localStorageData));
    },

    getLocalStorage: function () {
      if (this._localStorage) {
        return this._localStorage;
      }

      var storage;
      try {
        storage = this.getNativeStorage() || this._enableInMemoryStorage();
      } catch (e) {
        storage = this._enableInMemoryStorage(e);
      }
      this._localStorage = storage;
      return this._localStorage;
    },

    _enableInMemoryStorage: function (reason) {
      this.trigger('persistenceUnavailable', reason);
      return {
        storage: {},
        getItem: function (name) {
          return this.storage[name];
        },
        setItem: function (name, value) {
          this.storage[name] = value;
        }
      };
    },

    // This exists primarily as a testing extension point
    getNativeStorage: function () {
      return localStorage;
    },

    _namespaceForType: function (type) {
      var namespace = this.modelNamespace(type);
      var storage = this.loadData();

      return storage[namespace] || { records: {} };
    },

    modelNamespace: function (type) {
      return type.url || type.modelName;
    },

    /**
     * This takes a record, then analyzes the model relationships and replaces
     * ids with the actual values.
     *
     * Stolen from ember-indexdb-adapter
     *
     * Consider the following JSON is entered:
     *
     * ```js
     * {
     *   "id": 1,
     *   "title": "Rails Rambo",
     *   "comments": [1, 2]
     * }
     *
     * This will return:
     *
     * ```js
     * {
     *   "id": 1,
     *   "title": "Rails Rambo",
     *   "comments": [1, 2]
     *
     *   "_embedded": {
     *     "comment": [{
     *       "_id": 1,
     *       "comment_title": "FIRST"
     *     }, {
     *       "_id": 2,
     *       "comment_title": "Rails is unagi"
     *     }]
     *   }
     * }
     *
     * This way, whenever a resource returned, its relationships will be also
     * returned.
     *
     * @method loadRelationships
     * @private
     * @param {DS.Model} type
     * @param {Object} record
     */
    loadRelationships: function (store, type, record) {
      var adapter = this,
          relationshipNames,
          relationships;

      /**
       * Create a chain of promises, so the relationships are
       * loaded sequentially.  Think of the variable
       * `recordPromise` as of the accumulator in a left fold.
       */
      var recordPromise = Ember.RSVP.resolve(record);

      relationshipNames = Ember.get(type, 'relationshipNames');
      relationships = relationshipNames.belongsTo.concat(relationshipNames.hasMany);

      relationships.forEach(function (relationName) {
        var relationModel = type.typeForRelationship(relationName, store);
        var relationEmbeddedId = record[relationName];
        var relationProp = adapter.relationshipProperties(type, relationName);
        var relationType = relationProp.kind;

        var opts = { allowRecursive: false };

        /**
         * embeddedIds are ids of relations that are included in the main
         * payload, such as:
         *
         * {
         *    cart: {
         *      id: "s85fb",
         *      customer: "rld9u"
         *    }
         * }
         *
         * In this case, cart belongsTo customer and its id is present in the
         * main payload. We find each of these records and add them to _embedded.
         */
        if (relationEmbeddedId && LSAdapter.prototype.isPrototypeOf(adapter)) {
          recordPromise = recordPromise.then(function (recordPayload) {
            var promise;
            if (relationType === 'belongsTo' || relationType === 'hasOne') {
              promise = adapter.findRecord(null, relationModel, relationEmbeddedId, opts);
            } else if (relationType === 'hasMany') {
              promise = adapter.findMany(null, relationModel, relationEmbeddedId, opts);
            }

            return promise.then(function (relationRecord) {
              return adapter.addEmbeddedPayload(recordPayload, relationName, relationRecord);
            });
          });
        }
      });

      return recordPromise;
    },

    /**
     * Given the following payload,
     *
     *   {
     *      cart: {
     *        id: "1",
     *        customer: "2"
     *      }
     *   }
     *
     * With `relationshipName` being `customer` and `relationshipRecord`
     *
     *   {id: "2", name: "Rambo"}
     *
     * This method returns the following payload:
     *
     *   {
     *      cart: {
     *        id: "1",
     *        customer: "2"
     *      },
     *      _embedded: {
     *        customer: {
     *          id: "2",
     *          name: "Rambo"
     *        }
     *      }
     *   }
     *
     * which is then treated by the serializer later.
     *
     * @method addEmbeddedPayload
     * @private
     * @param {Object} payload
     * @param {String} relationshipName
     * @param {Object} relationshipRecord
     */
    addEmbeddedPayload: function (payload, relationshipName, relationshipRecord) {
      var objectHasId = relationshipRecord && relationshipRecord.id;
      var arrayHasIds = relationshipRecord.length && relationshipRecord.isEvery("id");
      var isValidRelationship = objectHasId || arrayHasIds;

      if (isValidRelationship) {
        if (!payload._embedded) {
          payload._embedded = {};
        }

        payload._embedded[relationshipName] = relationshipRecord;
        if (relationshipRecord.length) {
          payload[relationshipName] = relationshipRecord.mapBy('id');
        } else {
          payload[relationshipName] = relationshipRecord.id;
        }
      }

      if (this.isArray(payload[relationshipName])) {
        payload[relationshipName] = payload[relationshipName].filter(function (id) {
          return id;
        });
      }

      return payload;
    },

    isArray: function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    },

    /**
     * Same as `loadRelationships`, but for an array of records.
     *
     * @method loadRelationshipsForMany
     * @private
     * @param {DS.Model} type
     * @param {Object} recordsArray
     */
    loadRelationshipsForMany: function (store, type, recordsArray) {
      var adapter = this,
          promise = Ember.RSVP.resolve(Ember.A([]));

      /**
       * Create a chain of promises, so the records are loaded sequentially.
       * Think of the variable promise as of the accumulator in a left fold.
       */
      recordsArray.forEach(function (record) {
        promise = promise.then(function (records) {
          return adapter.loadRelationships(store, type, record).then(function (loadedRecord) {
            records.push(loadedRecord);
            return records;
          });
        });
      });

      return promise;
    },

    /**
     *
     * @method relationshipProperties
     * @private
     * @param {DS.Model} type
     * @param {String} relationName
     */
    relationshipProperties: function (type, relationName) {
      var relationships = Ember.get(type, 'relationshipsByName');
      if (relationName) {
        return relationships.get(relationName);
      } else {
        return relationships;
      }
    }
  });
});
;define('fresh-team/app', ['exports', 'fresh-team/resolver', 'ember-load-initializers', 'fresh-team/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
;define('fresh-team/components/bs-accordion', ['exports', 'ember-bootstrap/components/bs-accordion'], function (exports, _bsAccordion) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsAccordion.default;
    }
  });
});
;define('fresh-team/components/bs-accordion/item', ['exports', 'ember-bootstrap/components/bs-accordion/item'], function (exports, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
;define('fresh-team/components/bs-accordion/item/body', ['exports', 'ember-bootstrap/components/bs-accordion/item/body'], function (exports, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _body.default;
    }
  });
});
;define('fresh-team/components/bs-accordion/item/title', ['exports', 'ember-bootstrap/components/bs-accordion/item/title'], function (exports, _title) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _title.default;
    }
  });
});
;define('fresh-team/components/bs-alert', ['exports', 'ember-bootstrap/components/bs-alert'], function (exports, _bsAlert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsAlert.default;
    }
  });
});
;define('fresh-team/components/bs-button-group', ['exports', 'ember-bootstrap/components/bs-button-group'], function (exports, _bsButtonGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsButtonGroup.default;
    }
  });
});
;define('fresh-team/components/bs-button-group/button', ['exports', 'ember-bootstrap/components/bs-button-group/button'], function (exports, _button) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _button.default;
    }
  });
});
;define('fresh-team/components/bs-button', ['exports', 'ember-bootstrap/components/bs-button'], function (exports, _bsButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsButton.default;
    }
  });
});
;define('fresh-team/components/bs-carousel', ['exports', 'ember-bootstrap/components/bs-carousel'], function (exports, _bsCarousel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsCarousel.default;
    }
  });
});
;define('fresh-team/components/bs-carousel/slide', ['exports', 'ember-bootstrap/components/bs-carousel/slide'], function (exports, _slide) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _slide.default;
    }
  });
});
;define('fresh-team/components/bs-collapse', ['exports', 'ember-bootstrap/components/bs-collapse'], function (exports, _bsCollapse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsCollapse.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown', ['exports', 'ember-bootstrap/components/bs-dropdown'], function (exports, _bsDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsDropdown.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown/button', ['exports', 'ember-bootstrap/components/bs-dropdown/button'], function (exports, _button) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _button.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown/menu', ['exports', 'ember-bootstrap/components/bs-dropdown/menu'], function (exports, _menu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _menu.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown/menu/divider', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/divider'], function (exports, _divider) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _divider.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown/menu/item', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/item'], function (exports, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown/menu/link-to', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
;define('fresh-team/components/bs-dropdown/toggle', ['exports', 'ember-bootstrap/components/bs-dropdown/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
});
;define('fresh-team/components/bs-form', ['exports', 'ember-bootstrap/components/bs-form'], function (exports, _bsForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsForm.default;
    }
  });
});
;define('fresh-team/components/bs-form/element', ['exports', 'ember-bootstrap/components/bs-form/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/control', ['exports', 'ember-bootstrap/components/bs-form/element/control'], function (exports, _control) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _control.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/control/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/control/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/control/input', ['exports', 'ember-bootstrap/components/bs-form/element/control/input'], function (exports, _input) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _input.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/control/radio', ['exports', 'ember-bootstrap/components/bs-form/element/control/radio'], function (exports, _radio) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _radio.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/control/textarea', ['exports', 'ember-bootstrap/components/bs-form/element/control/textarea'], function (exports, _textarea) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _textarea.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/errors', ['exports', 'ember-bootstrap/components/bs-form/element/errors'], function (exports, _errors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _errors.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/feedback-icon', ['exports', 'ember-bootstrap/components/bs-form/element/feedback-icon'], function (exports, _feedbackIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _feedbackIcon.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/help-text', ['exports', 'ember-bootstrap/components/bs-form/element/help-text'], function (exports, _helpText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _helpText.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/label', ['exports', 'ember-bootstrap/components/bs-form/element/label'], function (exports, _label) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _label.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/layout/horizontal', ['exports', 'ember-bootstrap/components/bs-form/element/layout/horizontal'], function (exports, _horizontal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _horizontal.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/layout/horizontal/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/horizontal/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/layout/inline', ['exports', 'ember-bootstrap/components/bs-form/element/layout/inline'], function (exports, _inline) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _inline.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/layout/inline/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/inline/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/layout/vertical', ['exports', 'ember-bootstrap/components/bs-form/element/layout/vertical'], function (exports, _vertical) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _vertical.default;
    }
  });
});
;define('fresh-team/components/bs-form/element/layout/vertical/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/vertical/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define('fresh-team/components/bs-form/group', ['exports', 'ember-bootstrap/components/bs-form/group'], function (exports, _group) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _group.default;
    }
  });
});
;define('fresh-team/components/bs-modal-simple', ['exports', 'ember-bootstrap/components/bs-modal-simple'], function (exports, _bsModalSimple) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsModalSimple.default;
    }
  });
});
;define('fresh-team/components/bs-modal', ['exports', 'ember-bootstrap/components/bs-modal'], function (exports, _bsModal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsModal.default;
    }
  });
});
;define('fresh-team/components/bs-modal/body', ['exports', 'ember-bootstrap/components/bs-modal/body'], function (exports, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _body.default;
    }
  });
});
;define('fresh-team/components/bs-modal/dialog', ['exports', 'ember-bootstrap/components/bs-modal/dialog'], function (exports, _dialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _dialog.default;
    }
  });
});
;define('fresh-team/components/bs-modal/footer', ['exports', 'ember-bootstrap/components/bs-modal/footer'], function (exports, _footer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _footer.default;
    }
  });
});
;define('fresh-team/components/bs-modal/header', ['exports', 'ember-bootstrap/components/bs-modal/header'], function (exports, _header) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _header.default;
    }
  });
});
;define('fresh-team/components/bs-modal/header/close', ['exports', 'ember-bootstrap/components/bs-modal/header/close'], function (exports, _close) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _close.default;
    }
  });
});
;define('fresh-team/components/bs-modal/header/title', ['exports', 'ember-bootstrap/components/bs-modal/header/title'], function (exports, _title) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _title.default;
    }
  });
});
;define('fresh-team/components/bs-nav', ['exports', 'ember-bootstrap/components/bs-nav'], function (exports, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsNav.default;
    }
  });
});
;define('fresh-team/components/bs-nav/item', ['exports', 'ember-bootstrap/components/bs-nav/item'], function (exports, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
;define('fresh-team/components/bs-nav/link-to', ['exports', 'ember-bootstrap/components/bs-nav/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
;define('fresh-team/components/bs-navbar', ['exports', 'ember-bootstrap/components/bs-navbar'], function (exports, _bsNavbar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsNavbar.default;
    }
  });
});
;define('fresh-team/components/bs-navbar/content', ['exports', 'ember-bootstrap/components/bs-navbar/content'], function (exports, _content) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _content.default;
    }
  });
});
;define('fresh-team/components/bs-navbar/link-to', ['exports', 'ember-bootstrap/components/bs-navbar/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
;define('fresh-team/components/bs-navbar/nav', ['exports', 'ember-bootstrap/components/bs-navbar/nav'], function (exports, _nav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _nav.default;
    }
  });
});
;define('fresh-team/components/bs-navbar/toggle', ['exports', 'ember-bootstrap/components/bs-navbar/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
});
;define('fresh-team/components/bs-popover', ['exports', 'ember-bootstrap/components/bs-popover'], function (exports, _bsPopover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsPopover.default;
    }
  });
});
;define('fresh-team/components/bs-popover/element', ['exports', 'ember-bootstrap/components/bs-popover/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
;define('fresh-team/components/bs-progress', ['exports', 'ember-bootstrap/components/bs-progress'], function (exports, _bsProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsProgress.default;
    }
  });
});
;define('fresh-team/components/bs-progress/bar', ['exports', 'ember-bootstrap/components/bs-progress/bar'], function (exports, _bar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bar.default;
    }
  });
});
;define('fresh-team/components/bs-tab', ['exports', 'ember-bootstrap/components/bs-tab'], function (exports, _bsTab) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsTab.default;
    }
  });
});
;define('fresh-team/components/bs-tab/pane', ['exports', 'ember-bootstrap/components/bs-tab/pane'], function (exports, _pane) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pane.default;
    }
  });
});
;define('fresh-team/components/bs-tooltip', ['exports', 'ember-bootstrap/components/bs-tooltip'], function (exports, _bsTooltip) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsTooltip.default;
    }
  });
});
;define('fresh-team/components/bs-tooltip/element', ['exports', 'ember-bootstrap/components/bs-tooltip/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
;define('fresh-team/components/ember-popper-targeting-parent', ['exports', 'ember-popper/components/ember-popper-targeting-parent'], function (exports, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopperTargetingParent.default;
    }
  });
});
;define('fresh-team/components/ember-popper', ['exports', 'ember-popper/components/ember-popper'], function (exports, _emberPopper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopper.default;
    }
  });
});
;define('fresh-team/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
;define('fresh-team/helpers/app-version', ['exports', 'fresh-team/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;

    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
;define('fresh-team/helpers/bs-contains', ['exports', 'ember-bootstrap/helpers/bs-contains'], function (exports, _bsContains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsContains.default;
    }
  });
  Object.defineProperty(exports, 'bsContains', {
    enumerable: true,
    get: function () {
      return _bsContains.bsContains;
    }
  });
});
;define('fresh-team/helpers/bs-eq', ['exports', 'ember-bootstrap/helpers/bs-eq'], function (exports, _bsEq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsEq.default;
    }
  });
  Object.defineProperty(exports, 'eq', {
    enumerable: true,
    get: function () {
      return _bsEq.eq;
    }
  });
});
;define('fresh-team/helpers/cancel-all', ['exports', 'ember-concurrency/helpers/cancel-all'], function (exports, _cancelAll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _cancelAll.default;
    }
  });
});
;define('fresh-team/helpers/perform', ['exports', 'ember-concurrency/helpers/perform'], function (exports, _perform) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _perform.default;
    }
  });
});
;define('fresh-team/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
;define('fresh-team/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
;define('fresh-team/helpers/svg-jar', ['exports', 'ember-svg-jar/utils/make-helper', 'ember-svg-jar/utils/make-svg'], function (exports, _makeHelper, _makeSvg) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.svgJar = svgJar;


  function getInlineAsset(assetId) {
    try {
      /* eslint-disable global-require */
      return require(`ember-svg-jar/inlined/${assetId}`).default;
    } catch (err) {
      return null;
    }
  }

  function svgJar(assetId, svgAttrs) {
    return (0, _makeSvg.default)(assetId, svgAttrs, getInlineAsset);
  }

  exports.default = (0, _makeHelper.default)(svgJar);
});
;define('fresh-team/helpers/task', ['exports', 'ember-concurrency/helpers/task'], function (exports, _task) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _task.default;
    }
  });
});
;define('fresh-team/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'fresh-team/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let name, version;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
;define('fresh-team/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
;define('fresh-team/initializers/ember-concurrency', ['exports', 'ember-concurrency/initializers/ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberConcurrency.default;
    }
  });
});
;define('fresh-team/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
;define('fresh-team/initializers/export-application-global', ['exports', 'fresh-team/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
;define('fresh-team/initializers/load-bootstrap-config', ['exports', 'fresh-team/config/environment', 'ember-bootstrap/config'], function (exports, _environment, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{
    _config.default.load(_environment.default['ember-bootstrap'] || {});
  }

  exports.default = {
    name: 'load-bootstrap-config',
    initialize
  };
});
;define('fresh-team/instance-initializers/ember-data', ['exports', 'ember-data/initialize-store-service'], function (exports, _initializeStoreService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
});
;define('fresh-team/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    first_name: _emberData.default.attr('string'),
    last_name: _emberData.default.attr('string'),
    email: _emberData.default.attr('string'),
    team: _emberData.default.attr('string'),
    joiningDate: _emberData.default.attr('date')
  });
});
;define('fresh-team/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
;define('fresh-team/router', ['exports', 'fresh-team/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('users');
  });

  exports.default = Router;
});
;define('fresh-team/routes/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({

        beforeModel() {
            this.replaceWith('users');
        }
    });
});
;define('fresh-team/routes/users', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({

        model() {
            return this.store.findAll('user');
        }

    });
});
;define('fresh-team/serializers/application', ['exports', 'fresh-team/serializers/ls-serializer'], function (exports, _lsSerializer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _lsSerializer.default.extend({});
});
;define('fresh-team/serializers/ls-serializer', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.JSONSerializer.extend({
    /**
     * Invokes the new serializer API.
     * This should be removed in 2.0
     */
    isNewSerializerAPI: true,

    serializeHasMany: function (snapshot, json, relationship) {
      var key = relationship.key;
      var payloadKey = this.keyForRelationship ? this.keyForRelationship(key, "hasMany") : key;
      var relationshipType = snapshot.type.determineRelationshipType(relationship, this.store);

      if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany' || relationshipType === 'manyToOne') {
        json[payloadKey] = snapshot.hasMany(key, { ids: true });
        // TODO support for polymorphic manyToNone and manyToMany relationships
      }
    },

    /**
     * Extracts whatever was returned from the adapter.
     *
     * If the adapter returns relationships in an embedded way, such as follows:
     *
     * ```js
     * {
     *   "id": 1,
     *   "title": "Rails Rambo",
     *
     *   "_embedded": {
     *     "comment": [{
     *       "id": 1,
     *       "comment_title": "FIRST"
     *     }, {
     *       "id": 2,
     *       "comment_title": "Rails is unagi"
     *     }]
     *   }
     * }
     *
     * this method will create separated JSON for each resource and then combine
     * the data and the embed payload into the JSON.Api spec for included objects
     * returning a single object.
     *
     * @method extractSingle
     * @private
     * @param {DS.Store} store the returned store
     * @param {DS.Model} type the type/model
     * @param {Object} payload returned JSON
     */
    normalizeSingleResponse: function (store, type, payload) {
      var included = Ember.A([]);
      if (payload && payload._embedded) {
        var forEachFunc = record => {
          included.pushObject(this.normalize(relType, record).data);
        };

        for (var relation in payload._embedded) {
          var relType = type.typeForRelationship(relation, store);
          var embeddedPayload = payload._embedded[relation];

          if (embeddedPayload) {
            if (Ember.typeOf(embeddedPayload) === 'array') {
              embeddedPayload.forEach(forEachFunc);
            } else {
              included.pushObject(this.normalize(relType, embeddedPayload).data);
            }
          }
        }

        delete payload._embedded;
      }

      var normalPayload = this.normalize(type, payload);
      if (included.length > 0) {
        normalPayload.included = included;
      }
      return normalPayload;
    },

    /**
     * This is exactly the same as extractSingle, but used in an array.
     *
     * @method extractSingle
     * @private
     * @param {DS.Store} store the returned store
     * @param {DS.Model} type the type/model
     * @param {Array} payload returned JSONs
     */
    normalizeArrayResponse: function (store, type, payload) {
      var response = { data: Ember.A([]), included: Ember.A([]) };
      payload.forEach(json => {
        var normalized = this.normalizeSingleResponse(store, type, json);
        response.data.pushObject(normalized.data);

        if (normalized.included) {
          normalized.included.forEach(function (included) {
            if (!response.included.includes(included.id)) {
              response.included.addObject(included);
            }
          });
        }
      });

      return response;
    }
  });
});
;define('fresh-team/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("fresh-team/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ml9uVJet", "block": "{\"symbols\":[],\"statements\":[[7,\"body\"],[11,\"class\",\"main\"],[9],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"left-nav\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"icon-logo-container\"],[9],[0,\"\\n      \"],[1,[27,\"svg-jar\",[\"ft\"],[[\"class\"],[\"icon-logo\"]]],false],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"emp-logo-container\"],[9],[0,\"\\n\"],[4,\"link-to\",[\"users\"],null,{\"statements\":[[0,\"             \"],[1,[27,\"svg-jar\",[\"candidates\"],[[\"class\"],[\"emp-logo\"]]],false],[0,\"   \\n    \\n\"]],\"parameters\":[]},null],[0,\"    \"],[10],[0,\"\\n    \\n    \"],[10],[0,\"\\n\\n\\n  \"],[7,\"header\"],[11,\"class\",\"header\"],[9],[0,\"\\n    \"],[7,\"img\"],[11,\"class\",\"logo\"],[11,\"src\",\"assets/brand-header-logo.png\"],[11,\"alt\",\"freshteam logo\"],[9],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"header-title\"],[9],[0,\"Talent Center\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \\n  \"],[7,\"main\"],[11,\"class\",\"content\"],[9],[0,\"\\n       \"],[1,[21,\"outlet\"],false],[0,\"\\n \\n  \"],[10],[0,\"\\n\\n  \"],[7,\"footer\"],[11,\"class\",\"footer\"],[9],[0,\"\\n    \"],[7,\"p\"],[11,\"class\",\"footer-content\"],[9],[0,\"\\n      HR Software by Freshworks | Knowledge Base\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "fresh-team/templates/application.hbs" } });
});
;define('fresh-team/templates/components/ember-popper-targeting-parent', ['exports', 'ember-popper/templates/components/ember-popper-targeting-parent'], function (exports, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopperTargetingParent.default;
    }
  });
});
;define('fresh-team/templates/components/ember-popper', ['exports', 'ember-popper/templates/components/ember-popper'], function (exports, _emberPopper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopper.default;
    }
  });
});
;define("fresh-team/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XaYdiHJx", "block": "{\"symbols\":[],\"statements\":[[1,[21,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "fresh-team/templates/index.hbs" } });
});
;define("fresh-team/templates/users", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "amXesPUH", "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"sec-header\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"emp-title\"],[9],[0,\"Employees\"],[10],[0,\"\\n  \"],[10]],\"hasEval\":false}", "meta": { "moduleName": "fresh-team/templates/users.hbs" } });
});
;

;define('fresh-team/config/environment', [], function() {
  var prefix = 'fresh-team';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("fresh-team/app")["default"].create({"name":"fresh-team","version":"0.0.0+fcdc43bb"});
          }
        
//# sourceMappingURL=fresh-team.map
