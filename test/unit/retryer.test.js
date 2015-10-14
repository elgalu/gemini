'use strict';

var sinon = require('sinon'),
    assert = require('chai').assert,
    q = require('q'),
    fs = require('q-io/fs'),
    _ = require('lodash'),
    pool = require('../../lib/browser-pool'),
    createSuite = require('../../lib/suite').create,
    flatSuites = require('../../lib/suite-util').flattenSuites,

    CaptureSession = require('../../lib/capture-session'),
    Image = require('../../lib/image'),
    State = require('../../lib/state'),
    Retryer = require('../../lib/retryer'),
    Config = require('../../lib/config');

describe('Retryer', function() {
    function addState(suite, name, cb) {
        var state = new State(suite, name, cb || function() {});
        suite.addState(state);
        return state;
    }

    beforeEach(function() {
        this.sinon = sinon.sandbox.create();

        var browser = {
            id: 'browser',
            createActionSequence: this.sinon.stub().returns({
                perform: this.sinon.stub().returns(q.resolve()),
                getPostActions: this.sinon.stub().returns(null)
            }),

            captureFullscreenImage: this.sinon.stub().returns(q({
                getSize: this.sinon.stub().returns({}),
                crop: this.sinon.stub().returns(q({}))
            })),

            prepareScreenshot: this.sinon.stub().returns(q({
                captureArea: {},
                viewportOffset: {},
                ignoreAreas: []
            })),

            config: {
                getScreenshotPath: this.sinon.stub().returns('some/random/path')
            },

            openRelative: this.sinon.stub().returns(q.resolve()),
            quit: this.sinon.stub().returns(q.resolve())

        };
        this.browser = browser;

        this.pool = {
            getBrowser: this.sinon.stub().returns(q(browser)),
            freeBrowser: this.sinon.stub().returns(q()),
            finalizeBrowsers: this.sinon.stub().returns(q()),
            cancel: this.sinon.stub()
        };

        var image = sinon.createStubInstance(Image);
        image.save.returns(q.resolve());

        this.sinon.stub(pool, 'create').returns(this.pool);
        this.sinon.stub(CaptureSession.prototype, 'capture').returns(q.resolve({
            browser: browser,
            image: image
        }));

        this.sinon.stub(fs, 'exists').returns(true);

        this.root = createSuite('root');
        this.suite = createSuite('suite', this.root);
        this.suite.id = 0;
        this.suite.url = '/path';
        addState(this.suite, 'state');

        this.root.browsers = [browser.id];

        var config = new Config({
            system: {
                projectRoot: '/'
            },
            rootUrl: 'http://example.com',
            gridUrl: 'http://grid.example.com',
            browsers: {
                browser: {
                    desiredCapabilities: {}
                }
            }
        });

        this.retryer = new Retryer(config);

        this.runSuites_ = function(params) {
            _.defaults(params, {
                hasDiff: true,
                retries: 1
            });

            this.sinon.stub(Image, 'compare').returns(!params.hasDiff);
            this.suite.retries = params.retries;

            return this.retryer.run(flatSuites(this.root));
        };
    });

    afterEach(function() {
        this.sinon.restore();
    });

    it('should not perform retry if no suites has wrong diff', function() {
        var onRetry = this.sinon.spy().named('onRetry');

        this.retryer.on('retry', onRetry);

        return this.runSuites_({
            hasDiff: false,
            retries: 1
        }).then(function() {
            assert.notCalled(onRetry);
        });
    });

    it('should not perform retry if suite has no retries', function() {
        var onRetry = this.sinon.spy().named('onRetry');

        this.retryer.on('retry', onRetry);

        return this.runSuites_({
            hasDiff: true,
            retries: 0
        }).then(function() {
            assert.notCalled(onRetry);
        });
    });

    it('should perform retry if suite has diff and retries', function() {
        var onRetry = this.sinon.spy().named('onRetry');

        this.retryer.on('retry', onRetry);

        return this.runSuites_({
            hasDiff: true,
            retries: 1
        }).then(function() {
            assert.called(onRetry);
        });
    });

    it('should pass suites to retry as retry event data', function() {
        var onRetry = this.sinon.spy().named('onRetry'),
            _this = this;

        this.retryer.on('retry', onRetry);

        return this.runSuites_({
            hasDiff: true,
            retries: 1
        }).then(function() {
            assert.calledWith(onRetry, [_this.suite]);
        });
    });
});
