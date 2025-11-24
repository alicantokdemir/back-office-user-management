export class ResponseDto<T = any> {
  success: boolean;
  message?: string;
  data?: T;

  constructor(params: { data?: T; message?: string; success?: boolean }) {
    this.data = params.data;
    this.message = params.message;
    this.success = params.success ?? true;
  }
}
