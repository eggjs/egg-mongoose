export default (appInfo: EggAppConfig) => {

  // ...

  /**
   * mongoose default config
   * http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection
   * @member Config#mongoose
   * @property {String} url - connect url
   * @property {Object} options - options to pass to the driver and mongoose-specific
   */
  config.mongoose = {
    url: '',
    options: {},
    loadModel: true,
    app: true,
    agent: false,
  };

  // ...
}