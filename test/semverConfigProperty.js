'use strict';

// Set up stamp factory.
const config = require('../test/config/default.json');
const stamp = require('stampit');
const semverConfigProperty = require('../lib/semverConfigProperty');

const versionConfig = semverConfigProperty.create({
  property: 'configItem',
  version: [1, 2, 2],
  configContext: 'test',
  config
});

const versionConfigTwo = semverConfigProperty.create({
  property: 'configItem',
  version: [1, 2, 2],
  configContext: '',
  config
});

const versionConfigThree = semverConfigProperty.create({
  property: '',
  version: [],
  configContext: '',
  config: {}
});

const versionConfigFour = semverConfigProperty.create({
  property: 'configItem',
  version: [1, 0],
  configContext: '',
  config
});


module.exports = {
  semVerConfigPropertyTest: function semVerConfigPropertyTest(test) {
    test.expect(9);
    test.deepEqual(
      versionConfig.getSchemaTargetVersion(),
      [1, 2, 2],
      'Target versions should be equal with init.'
    );
    test.deepEqual(
      versionConfig.getConfigContext(),
      'test',
      'Config Context should be equal with init.'
    );
    test.deepEqual(
      versionConfig.getConfigProperty(),
      'configItem',
      'Config Context should be equal with init.'
    );
    test.deepEqual(
      versionConfig.getThisConfig(),
      {
        1: {
          1: {},
          2: {
            0: {},
            1: {
              configItem: 'testValue'
            },
            2: {}
          }
        }
      },
      'Config should be equal with init.'
    );
    test.deepEqual(
      versionConfigTwo.getThisConfig(),
      {
        test: {
          1: {
            1: {},
            2: {
              0: {},
              1: {
                configItem: 'testValue'
              },
              2: {}
            }
          }
        }
      },
      'Config should be equal with init.'
    );
    test.deepEqual(
      versionConfig.getRetrievedConfig(),
      'testValue',
      'Config should be equal with init.'
    );
    test.throws(() => {
      versionConfigThree.setRetrievedConfig();
    }, 'Bad config should cause errors.');
    test.throws(() => {
      versionConfigThree.setThisConfig();
    }, 'Bad config should cause errors.');
    test.doesNotThrow(() => {
      versionConfigFour.setRetrievedConfig();
    }, 'Bad config should cause errors.');
    test.done();
  },
  semVerPreComposed: function semVerPreComposedTest(test) {
    test.expect(1);
    const newStamp = stamp()
      .deepProps({
        // Config Property is the name of the property we wish to access.
        config,
        configProperty: 'testValue',
        // This is the semver version number in array format,
        // i.e. 3.0.1 or ['3','0','1'].
        schemaTargetVersion: [1, 2, 2]
      })
      .compose(semverConfigProperty);

    test.deepEqual(
      newStamp.create().getThisConfig(),
      {
        test: {
          1: {
            1: {},
            2: {
              0: {},
              1: {
                configItem: 'testValue'
              },
              2: {}
            }
          }
        }
      },
      'Config should be equal with init.'
    );
    test.done();
  },
  'No Config Precomposed': function semVerPreComposedNoConfigTest(test) {
    test.expect(1);
    const newStamp = stamp()
      .deepProps({
        // Config Property is the name of the property we wish to access.
        config: null,
        configProperty: 'testValue',
        // This is the semver version number in array format,
        // i.e. 3.0.1 or ['3','0','1'].
        schemaTargetVersion: [1, 2, 2]
      })
      .compose(semverConfigProperty);

    test.throws(() => {
      newStamp.create().setThisConfig();
    }, 'Bad config should cause errors.');

    test.done();
  },
};
