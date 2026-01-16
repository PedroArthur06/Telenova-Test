import { Cdr } from '@prisma/client';

export interface CdrFilter {
  domain: string;
  startDate: Date;
  endDate: Date;
}

export interface ICdrRepository {
  findManyByDomain(filter: CdrFilter): Promise<Cdr[]>;
  findRecordingPath(uuid: string, domain: string): Promise<{ recordPath: string; recordName: string } | null>;
}