import * as mongoose from 'mongoose';

declare module 'egg' {

  type MongooseModels = {
    [key: string]: mongoose.Model<any>
  };

  type MongooseSingleton = {
    clients: Map<string, mongoose.Connection>,
    get (id: string) : mongoose.Connection
  };

  type MongooseConfig = {
    url: string,
    options?: mongoose.ConnectOptions
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
      options?: mongoose.ConnectOptions,
      client?: MongooseConfig,
      clients?: {
        [key: string]: MongooseConfig
      }
    };
  }

}