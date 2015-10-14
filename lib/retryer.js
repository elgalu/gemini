'use strict';

var inherit = require('inherit'),
    q = require('q'),

    Tester = require('./tester'),

    RunnerEvents = require('./constants/runner-events');

module.exports = inherit(Tester, {
    __constructor: function(config, options) {
        this.__base(config, options);
        this._retriesPerformed = 0;
        this._failedSuites = [];
    },

    _endTest: function(result) {
        this.__base(result);

        if (result.equal) {
            return;
        }

        this._addFailedSuite(result.suite);
    },

    _endSession: function() {
        var _this = this;

        return this.__base().then(function() {
            var suitesToRetry = _this._filterFailedSuites();

            if (!suitesToRetry.length) {
                return q();
            }

            return _this._performRetry(suitesToRetry);
        });
    },

    _addFailedSuite: function(suite) {
        if (!suite.retries) {
            return;
        }

        this._failedSuites.push(suite);
    },

    _filterFailedSuites: function() {
        var _this = this;

        return this._failedSuites.filter(function(suite) {
            return suite.retries > _this._retriesPerformed;
        });
    },

    _performRetry: function(suitesToRetry) {
        this.emit(RunnerEvents.RETRY);

        this._failedSuites = [];
        this._retriesPerformed++;

        return this._runSession(suitesToRetry);
    }
});
