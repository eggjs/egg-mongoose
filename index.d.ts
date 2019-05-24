import * as mongoose from 'mongoose';

declare module 'egg' {

  type MongooseModels = {
    [key: string]: mongoose.Model
  };

  type MongooseSingleton = {
    clients: Map<string, mongoose.Connection>,
    get (id: string) : mongoose.Connection
  };

  type MongooseConfig = {
    url: string,
    options?: mongoose.ConnectionOptions
  };

  // extend app
  interface Application {
    mongooseDB: mongoose.Connection | MongooseSingleton;
    mongoose: typeof mongoose;
    model: MongooseModels;
  }

  // extend context
  interface Context {
    model: MongooseModels;
  }

  // extend your config
  interface EggAppConfig {
    mongoose: {
      url?: string,
      options?: mongoose.ConnectionOptions,
      client?: MongooseConfig,
      clients?: {
        [key: string]: MongooseConfig
      }
    };
  }

}
