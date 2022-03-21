import CodeAndMessage from '../constant/response';

export class HttpException extends Error {
  public code: number;
  constructor(
    code: number,
    message?: string,
  ) {
    const _message = message || CodeAndMessage.CodeToMessage(code) || CodeAndMessage.FAIL.MESSAGE;
    super(_message);
    this.code = code;
  }
}
