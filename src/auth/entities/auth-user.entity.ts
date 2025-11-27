import { IdType } from '../../common/base.repository';

export type AuthUserProps = {
  id?: IdType;
  userId: IdType;
  email: string;
  passwordHash: string;
};

export class AuthUser {
  readonly id?: IdType;
  readonly userId: IdType;
  readonly email: string;
  readonly passwordHash: string;

  constructor(props: AuthUserProps) {
    Object.assign(this, props);
  }
}
