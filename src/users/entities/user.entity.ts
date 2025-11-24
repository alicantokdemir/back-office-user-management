import { IdType } from '../../common/base.repository';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  DELETED = 'DELETED',
}

type UserProps = {
  id?: IdType;
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture?: string;
  status: UserStatus;
};

export class User {
  readonly id?: IdType;
  readonly provider: string;
  readonly providerId: string;
  readonly email: string;
  readonly name: string;
  readonly picture?: string;
  readonly status: UserStatus;

  constructor(props: UserProps) {
    Object.assign(this, props);
  }
}
