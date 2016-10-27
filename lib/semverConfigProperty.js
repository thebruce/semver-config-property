'use strict';

const stamp = require('stampit');
const VersionAttribute = require('version-attribute');
const _ = require('lodash');

module.exports = stamp()
  .props({
    // Our config loaded into configVersionAttribute
    configVersionAttribute: {}
  })
  .deepProps({
    // Config Property is the name of the property we wish to access.
    configProperty: '',
    // This is the semver version number in array format,
    // i.e. 3.0.1 or ['3','0','1'].
    schemaTargetVersion: [],
    // This is the actual version we are using in array
    // format, i.e. 3.0.1 or ['3','0','1'].
    configPropertyVersion: [],
    // This is the value of the property we retrieved at
    // configPropertyVersion.
    retrievedConfig: {},
    // The config context where we will
    configContext: ''
  })
  .init(
    /**
     * Init function that sets up semverConfigProperty.
     *
     * @param {string} property
     *   The property name.
     * @param {array} version
     *   An object with version keys and possible other properties.
     * @param {string} configContext
     *  Narrow down the semver search on a part of config.
     *
     */
    function init({property, version, configContext, config}) {
      // Set a number of defaults.
      this.configProperty = property || this.getConfigProperty();
      this.schemaTargetVersion = version || this.getSchemaTargetVersion();
      this.configContext = configContext || this.configContext;
      if (config) {
        this.config = config;
      }
      if (!this.config) {
        this.config = {};
      }
      if (_.keys(this.config).length !== 0) {
        this.setThisConfig();
        if (this.getConfigProperty() && this.getSchemaTargetVersion()) {
          // We have both a property and version. Set the version property.
          this.setRetrievedConfig();
        }
      }
    }
  )
  .methods({
    /**
     * Gets the Schema Target Version property.
     *
     * @return {array}
     *  Returns the Schema target version.
     *
     */
    getSchemaTargetVersion() {
      // Returns an array.
      return this.schemaTargetVersion;
    },
    /**
     * Gets the Config property.
     *
     * @return {array}
     *  Returns the configuration property.
     *
     */
    getConfigProperty() {
      return this.configProperty;
    },
    /**
     * Gets the config context property.
     *
     * @return {string}
     *  Returns the config context string.
     *
     */
    getConfigContext() {
      return this.configContext;
    },
    /**
     * Sets This Config property, if we have a config context we can use that.
     *
     */
    setThisConfig() {
      // If we don't have a config we can't narrow down the context.
      if (_.keys(this.config).length === 0) {
        throw new Error('No config set on instantiation.');
      }
      this.thisConfig = this.configContext ? this.config[this.configContext] : this.config;
      this.configVersionAttribute = new VersionAttribute(this.thisConfig);
    },
    /**
     * Gets the This Config property.
     *
     * @return {array}
     *  Returns This Config.
     *
     */
    getThisConfig() {
      return this.thisConfig;
    },
    /**
     * Retrieves the proprety from config for the specified version.
     *
     * @return
     *  Returns the config property for the desired version.
     *
     */
    getRetrievedConfig() {
      return this.retrievedConfig;
    },
    /**
     * Sets the retrieved version property.
     *
     */
    setRetrievedConfig() {
     // If we don't have a property, config and a version throw.
      if (!this.getConfigProperty() || !this.getThisConfig() || !this.getSchemaTargetVersion()) {
        throw new Error('Cannot retrieve config without a property, version and configuration.');
      }
      this.setConfigPropertyVersion();

      try {
        this.retrievedConfig = this.configVersionAttribute.getVersionAttribute(
          this.getConfigPropertyVersion(),
          this.getConfigProperty()
        );
      }
      catch (e) {
        this.retrievedConfig = {};
      }
    },
    /**
     *  Set version that corresponds to the last time
     * this property was specified in config.
     *
     */
    setConfigPropertyVersion() {
      const temp = this.configVersionAttribute.getVersionHasTarget(
        this.getSchemaTargetVersion(),
        this.getConfigProperty()
      );
      this.configPropertyVersion = temp.length ? temp : [];
    },
    /**
     * Init function that sets up semverConfigProperty.
     *
     * @return {array}
     *  Returns the Schema version.
     *
     */
    getConfigPropertyVersion() {
      return this.configPropertyVersion;
    }
  });
