import { Service } from 'egg';

/**
 * Common Service
 */
export default class Redis extends Service {

  /**
   * @param key key
   * @param value json object value
   * @param expiryTime ex 到期时间（秒）
   */
  set (key: string, value: Record<string, any>, expiryTime: number) {
    return this.app.redis.set(key, JSON.stringify(value), 'ex', expiryTime);
  }

  async get (key: string) {
    const value = await this.app.redis.get(key);
    if (typeof value === 'string') {
      try {
        const jsonValue = JSON.parse(value);
        return jsonValue;
      } catch (error) {
        this.logger.error(error, { value });
      }
    }
    return null;
  }

  del (key: string) {
    return this.app.redis.del(key);
  }

}

