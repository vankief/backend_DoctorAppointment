import { ReasonPhrases, StatusCodes } from '../../httpStatusCode';
export default class FailResponse {
  public message: string;
  public statusCode: number;
  public reasonStatusCode: string;
  public data: any;

  constructor({
    message,
    statusCode,
    reasonStatusCode,
    data,
  }: {
    message: string;
    statusCode: number;
    reasonStatusCode: string;
    data: any;
  }) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.data = data;
  }

  send(res: any) {
    return res.status(this.statusCode).json({
      status: 'fail',
      message: this.message,
      statusCode: this.statusCode,
      reasonStatusCode: this.reasonStatusCode,
      data: this.data,
    });
  }
}
class BadResponse extends FailResponse {
  constructor({
    message = ReasonPhrases.BAD_REQUEST,
    data = null,
  }: {
    message: string;
    data: any;
  }) {
    super({ message, statusCode: StatusCodes.BAD_REQUEST, reasonStatusCode: 'BAD_REQUEST', data });
  }
}

export { BadResponse };
