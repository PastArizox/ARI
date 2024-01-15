import Warn from '../models/warn';

class WarnRepository {
    findAll(userId: string): Warn[] | null {
        return null;
    }

    findByWarnId(userId: string, warnId: number): Warn | null {
        const warns = this.findAll(userId);
        return null;
    }

    save(userId: string, warn: Warn): Warn | null {
        return null;
    }

    deleteByWarnId(userId: string, warnId: number): Warn | null {
        return null;
    }
}
