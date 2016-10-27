[![Build Status](https://travis-ci.org/thebruce/semver-property-retrieve-stamp.svg?branch=master)](https://travis-ci.org/thebruce/semver-property-retrieve-stamp)
[![Coverage Status](https://coveralls.io/repos/github/thebruce/semver-property-retrieve-stamp/badge.svg)](https://coveralls.io/github/thebruce/semver-property-retrieve-stamp)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Semver Property Retrieve Stamp

A stamp (a composeable factory function) for use with [stamp-it](https://www.npmjs.com/package/stampit) that contains a behavior/responsibility to retrieve a property stored in a config object (at this.config) keyed by semver type properties (example 1.1.1.property). This could be useful in a variety of situations, retrieving stamps from config, properties, or any other information useful for a particular version of software or API.

This can be useful by itself or in combination with [config-property-stamp](https://www.npmjs.com/package/config-property-stamp) to read in config.

## Usage
* The config object you pass in needs to be an object with semver style attributes as described in [version-attribute](https://www.npmjs.com/package/version-attribute)

* Retrieve a property using version attribute in a convenient stamp:
```javascript
// Config with semver property.
const config = {
  1: {
    1: {},
    2: {
      0: {},
      1: {"configItem": "testValue"},
      2: {}
    }
  }
};
// Our Stamp
const semverConfigProperty = require('semver-property-retrieve-stamp');


// Create Stamp and set options
// property: look for a property keyed as configItem
//
//version: start looking for a property at version 1.2.2.
// Version attribute works so that config can be lazily set
// meaning that previous versions config are good for others unless they are specifically reset.
//
// configContext: We aren't using this here, but this is useful if
// you use config Contexts to divide up semver objects.
//
// config: this is our semver Config object.
const versionConfig = semverConfigProperty.create({
  property: 'configItem',
  version: [1, 2, 2],
  configContext: '',
  config
});

// If you've retrieved anything it will be in: versionConfig.retrievedConfig
var test = versionConfig.getRetrievedConfig()
// testValue
```

## Parameters

`property` : The property you want to search for in your semver object.
`version` : The semver version represented as an array, 3.0.1 would be represented as [3,0,1]
`configContext`: Config can be divided into configuration contexts. Effectively we might subdivide semver objects under keys - we could then target that configContext through this property.
`config` : A semver config object.
