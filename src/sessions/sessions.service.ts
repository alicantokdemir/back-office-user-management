import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from '../loggers/logger.service';
import { ISessionRepository } from './session.types';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(ISessionRepository)
    private readonly sessionRepository: ISessionRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(SessionsService.name);
  }

  async create(newSession: Session) {
    try {
      await this.sessionRepository.create(newSession);

      this.logger.log(`Created new session for userId=${newSession.userId}`);
    } catch (err) {
      this.logger.error('Failed to create session', err);

      throw new InternalServerErrorException('Failed to create session');
    }
  }

  async removeSession(sessionId: string, userId: string) {
    this.logger.log(`Removing session ${sessionId}`);

    const deleted = await this.sessionRepository.remove(sessionId);

    if (!deleted) {
      this.logger.warn(
        `Failed to delete session ${sessionId} - session not found`,
      );

      return;
    }

    this.logger.log(`Session ${sessionId} deleted`);
  }

  async removeAllSessionsForUser(userId: string) {
    try {
      this.logger.log(`Removing all sessions for userId=${userId}`);

      const sessions = await this.sessionRepository.removeAll({ userId });

      this.logger.log(`All sessions removed for userId=${userId}`);
    } catch (err) {
      this.logger.error(
        `Failed to remove all sessions for userId=${userId}`,
        err,
      );

      throw new InternalServerErrorException(
        'Failed to remove all sessions for user',
      );
    }
  }

  async validateSession(sessionId: string): Promise<Session | null> {
    try {
      this.logger.log(`Validating session ${sessionId}`);

      const session = await this.sessionRepository.findOneById(sessionId);

      if (!session) {
        this.logger.warn(
          `Session validation failed - session not found id=${sessionId}`,
        );

        return null;
      }

      if (session.expiresAt < new Date()) {
        this.logger.warn(
          `Session validation failed - session expired id=${sessionId}`,
        );

        // Remove expired session
        await this.removeSession(session.id, session.userId);

        return null;
      }

      return session;
    } catch (error) {
      this.logger.error(`Error validating session id=${sessionId}: ${error}`);
      throw new InternalServerErrorException('Error validating session');
    }
  }
}
