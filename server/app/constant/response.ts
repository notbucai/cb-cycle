export type CodeAndMessage = {
  CODE: number;
  MESSAGE: string;
};
export default class ResponseConstant {
  static readonly SUCCEED = {
    CODE: 0,
    MESSAGE: '成功',
  };
  static readonly FAIL = {
    CODE: -1,
    MESSAGE: '未知错误',
  };
  static readonly CODE_VALID_FAIL = {
    CODE: 1100,
    MESSAGE: '1分钟验证码内只能获取一次',
  };
  static readonly CODE_FAIL = {
    CODE: 1101,
    MESSAGE: '验证码错误',
  };
  static readonly UNAUTHORIZED_ERROR = {
    CODE: 1400,
    MESSAGE: '无权限',
  };
  static readonly TOKEN_ERROR = {
    CODE: 1401,
    MESSAGE: 'token错误',
  };
  static readonly LOGIN_ERROR = {
    CODE: 1402,
    MESSAGE: '未登录',
  };
  static readonly LOGIN_FAIL = {
    CODE: 1403,
    MESSAGE: '登录失败',
  };

  static CodeToMessage (code: number): string | null {
    for (const key of Object.keys(this)) {
      if (this[key].CODE === code) {
        return this[key].MESSAGE;
      }
    }
    return null;
  }
}
