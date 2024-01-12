import { ReasonPhrases, StatusCodes } from '../../httpStatusCode';
export default class SuccessResponse {
  public message: string;
  public statusCode: number;
  public reasonStatusCode: string;
  public data: any;

  constructor({ message, statusCode, reasonStatusCode, data }: { message: string; statusCode: number; reasonStatusCode: string; data: any }) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.data = data;
  }
  send(req: any) {
    return req.status(this.statusCode).json({
      status: 'success',
      message: this.message,
      statusCode: this.statusCode,
      reasonStatusCode: this.reasonStatusCode,
      data: this.data,
    });
  }
}

class OK extends SuccessResponse {
  constructor({ message = ReasonPhrases.OK, data = null }: { message?: string; data?: any }) {
    super({ message, statusCode: StatusCodes.OK, reasonStatusCode: ReasonPhrases.OK, data });
  }
}

export { OK };
