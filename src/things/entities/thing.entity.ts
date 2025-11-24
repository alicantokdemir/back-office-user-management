import { IdType } from '../../common/base.repository';

export type ThingProps = {
  id?: IdType;
  data: string;
};

export class Thing {
  readonly id?: IdType;
  readonly data: string;

  constructor(props: ThingProps) {
    Object.assign(this, props);
  }
}
