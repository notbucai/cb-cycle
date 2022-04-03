import { Context, EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1647355450997_8415';
  config.website = {
    title: '不才的博客',
  };

  // add your egg config in here
  config.middleware = ['responseHandler'];
  config.xframe = {
    enable: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'database-name',
  };
  config.onerror = {
    all (err: any, ctx: Context) {
      ctx.body = JSON.stringify({
        message: err.message,
        code: err.status || -1,
      });
      ctx.type = 'json';
      ctx.status = 200;
    },
  };
  config.jwt = {
    secret: '111',
    enable: true, // default is false
    ignore: [/\/login$/, /\/common\/code$/, /\/open\/callback/, /\/test/],
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };
  config.email = {
    host: 'smtp.qq.com',
    port: 587,
    auth: {
      user: 'xxx@qq.com',
      pass: '',
    }
  };
  config.oauth = {
    github: {
      secret: '',
      clientId: '',
    }
  };
  config.httpclient = {
    request: {
      // 默认 request 超时时间
      timeout: 12 * 1000,
    },
  };
  // add your special config in here
  const bizConfig = {
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
