'use strict';

var appiumVersion = '1.4.13';

var Config = require('../../lib/config'),
    Browser = require('../../lib/browser'),
    _ = require('lodash'),

    supportedBrowsers = {
        // evergreen browsers are always tested against latest
        // version
        chrome: {
            browserName: 'chrome'
        },

        firefox: {
            browserName: 'firefox'
        },

        // Some specific versions we support
        ie8: {
            browserName: 'internet explorer',
            version: '8'
        },

        ie9: {
            browserName: 'internet explorer',
            version: '9'
        },

        ie10: {
            browserName: 'internet explorer',
            version: '10'
        },

        ie11: {
            browserName: 'internet explorer',
            version: '11'
        },

        microsoftedge: {
            browserName: 'microsoftedge',
            platform: 'Windows 10',
            version: '20.10240'
        },

        opera12: {
            browserName: 'opera',
            version: '12'
        },

        'safari7.0': {
            browserName: 'safari',
            version: '7.0'
        },

        'safari8.0': {
            browserName: 'safari',
            version: '8.0'
        },

        'safari9.0': {
            browserName: 'safari',
            version: '9.0'
        },

        'android4.4': {
            browserName: 'Browser',
            appiumVersion: appiumVersion,
            deviceName: 'Android Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'

        },

        'android5': {
            browserName: 'Browser',
            appiumVersion: appiumVersion,
            deviceName: 'Android Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '5.0',
            platformName: 'Android'
        },

        'nexus4.4_defbrowser': {
            browserName: 'Browser',
            appiumVersion: appiumVersion,
            deviceName: 'Google Nexus 7 HD Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'
        },

        'nexus4.4_chrome': {
            browserName: 'chrome',
            appiumVersion: appiumVersion,
            deviceName: 'Google Nexus 7 HD Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'
        },

        'galaxy_s4_defbrowser': {
            browserName: 'Browser',
            appiumVersion: appiumVersion,
            deviceName: 'Samsung Galaxy S4 Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'
        },

        'galaxy_s4_chrome': {
            browserName: 'chrome',
            appiumVersion: appiumVersion,
            deviceName: 'Samsung Galaxy S4 Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'
        },

        'galaxy_s3_defbrowser': {
            browserName: 'Browser',
            appiumVersion: appiumVersion,
            deviceName: 'Samsung Galaxy S3 Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'
        },

        'galaxy_s3_chrome': {
            browserName: 'chrome',
            appiumVersion: appiumVersion,
            deviceName: 'Samsung Galaxy S3 Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.4',
            platformName: 'Android'
        },

        'lg_optimus_3d_defbrowser': {
            browserName: 'Browser',
            appiumVersion: appiumVersion,
            deviceName: 'LG Optimus 3D Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.0',
            platformName: 'Android'
        },

        'lg_optimus_3d_chrome': {
            browserName: 'chrome',
            appiumVersion: appiumVersion,
            deviceName: 'LG Optimus 3D Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '4.0',
            platformName: 'Android'
        },

        'iphone_retina_3.5inch': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone Retina (3.5-inch)',
            deviceOrientation: 'portrait',
            platformVersion: '7.1',
            platformName: 'iOS'
        },

        'iphone_retina_4inch_64': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone Retina (4-inch 64-bit)',
            deviceOrientation: 'portrait',
            platformVersion: '7.1',
            platformName: 'iOS'
        },

        'ipad_retina_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPad Retina',
            deviceOrientation: 'portrait',
            platformVersion: '7.1',
            platformName: 'iOS'
        },

        'ipad_air_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPad Air',
            deviceOrientation: 'portrait',
            platformVersion: '8.1',
            platformName: 'iOS'
        },

        'iphone_6plus_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone 6 Plus',
            deviceOrientation: 'portrait',
            platformVersion: '9.0',
            platformName: 'iOS'
        },

        'iphone_6_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone 6',
            deviceOrientation: 'portrait',
            platformVersion: '8.1',
            platformName: 'iOS'
        },

        'iphone_5s_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone 5s',
            deviceOrientation: 'portrait',
            platformVersion: '8.1',
            platformName: 'iOS'
        },

        'iphone_5_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone 5',
            deviceOrientation: 'portrait',
            platformVersion: '8.1',
            platformName: 'iOS'
        },

        'iphone_4s_safari': {
            browserName: 'Safari',
            appiumVersion: appiumVersion,
            deviceName: 'iPhone 4s',
            deviceOrientation: 'portrait',
            platformVersion: '8.4',
            platformName: 'iOS'
        }

    },

    testsConfig = new Config({
        gridUrl: 'http://ondemand.saucelabs.com/wd/hub',
        rootUrl: 'http://example.com',
        httpTimeout: 90000,
        screenshotsDir: './screens',
        sessionsPerBrowser: 1,
        suitesPerSession: 1,
        browsers: _.mapValues(supportedBrowsers, function(capabilities) {
            return {desiredCapabilities: capabilities};
        }),
        system: {
            projectRoot: process.cwd()
        }
    }),
    browserDescribe;

if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    browserDescribe = describe;
} else {
    browserDescribe = describe.skip;
    console.warn('WARNING: Sauce labs is not set up.');
    console.warn('Some functional tests will be skipped.');
    console.warn('To fix:');
    console.warn('1. Create account at https://saucelabs.com/opensauce/');
    console.warn('2. Set SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables');
}

exports.eachSupportedBrowser = function(cb) {
    if (process.env.BROWSER) {
        runTestsInBrowser(process.env.BROWSER, cb);
        return;
    }

    // run tests in all supported browsers
    Object.keys(supportedBrowsers).forEach(function(browserId) {
        browserDescribe('in ' + browserId, function() {
            runTestsInBrowser(browserId, cb);
        });
    });
};

function runTestsInBrowser(browserId, callback) {
    if (!supportedBrowsers.hasOwnProperty(browserId)) {
        throw new Error('Unknown browser: ' + browserId);
    }
    beforeEach(function() {
        var browserConfig = testsConfig.forBrowser(browserId);
        this.browser = new Browser(browserConfig);
    });

    callback();
}
