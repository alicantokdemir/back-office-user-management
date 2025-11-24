import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register: client.Registry;

  constructor() {
    this.register = new client.Registry();
    this.register.setDefaultLabels({ app: 'nestjs-crud-starter' });
    client.collectDefaultMetrics({ register: this.register });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
