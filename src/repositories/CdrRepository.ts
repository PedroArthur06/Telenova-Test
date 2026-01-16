import { prisma } from '../database/client';
import { ICdrRepository, CdrFilter } from './ICdrRepository';
import { Cdr } from '@prisma/client';

export class PrismaCdrRepository implements ICdrRepository {
  // Busca todos os registros de um domínio entre duas datas
  async findManyByDomain({ domain, startDate, endDate }: CdrFilter): Promise<Cdr[]> {
    return await prisma.cdr.findMany({
      where: {
        domainName: domain,
        startStamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        startStamp: 'desc'
      }
    });
  }

  // Busca o path do arquivo de gravação
  async findRecordingPath(uuid: string, domain: string) {
    return await prisma.cdr.findFirst({
      where: {
        uuid: uuid,
        domainName: domain
      },
      select: {
        recordPath: true,
        recordName: true
      }
    });
  }
}