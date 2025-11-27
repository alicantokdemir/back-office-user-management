import { ListUsersResponseDto } from '../admin/dto/list-users.response.dto';
import { IBaseRepository, PaginationOptions } from '../common/base.repository';
import { AuthUser } from './entities/auth-user.entity';

export interface IAuthUserRepository extends IBaseRepository<AuthUser> {
  findAllPaginatedWithUsers(
    pagination: PaginationOptions,
    filter?: Partial<AuthUser>,
  ): Promise<ListUsersResponseDto[]>;
}
export const IAuthUserRepository = Symbol('IAuthUserRepository');

export type AccessTokenPayload = {
  sub: string;
  email: string;
  sid: string;
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  sid: string;
};

export type ReqUser = {
  userId: string;
  email: string;
  sessionId: string;
};
