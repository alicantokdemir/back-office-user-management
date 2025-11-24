import { IdType } from '../../common/base.repository';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type UserProps = {
  id?: IdType;
  firstName: string;
  lastName: string;
  status: UserStatus;
  loginCount: number;
};

export class User {
  readonly id?: IdType;
  readonly firstName: string;
  readonly lastName: string;
  readonly status: UserStatus;
  readonly loginCount: number;

  constructor(props: UserProps) {
    Object.assign(this, props);
  }
}
