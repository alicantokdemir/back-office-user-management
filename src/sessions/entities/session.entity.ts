import { IdType } from '../../common/base.repository';

export type SessionProps = {
  id?: IdType;
  userId: IdType;
  expiresAt: Date;
  refreshTokenHash: string;
  ipAddress: string;
  userAgent: string;
};

export class Session {
  readonly id?: IdType;
  readonly userId: IdType;
  readonly expiresAt: Date;
  readonly refreshTokenHash: string;
  readonly ipAddress: string;
  readonly userAgent: string;

  constructor(props: SessionProps) {
    Object.assign(this, props);
  }
}
