import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay, parseISO } from "date-fns";

const prisma = new PrismaClient();

export class CdrService {
    // Pega o extrato com parametros de data e domínio
    async getExtract(domain: string, date: string) {
        const startDate = startOfDay(parseISO(date));
        const endDate = endOfDay(parseISO(date));

        const cdrs = await prisma.cdr.findMany({
            where: {
                domainName: domain,
                startStamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                startStamp: 'asc'
            }   
        });

        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        return cdrs.map(record => ({
            uuid: record.uuid,
            data: record.startStamp,
            origem: record.callerIdNumber,
            destino: record.destinationNumber,
            duracao_segundos: record.billsec,
            status: record.hangupCause,
            recording_url: `${baseUrl}/recording?id=${record.uuid}`
        }));
    }

    // Pega o path do arquivo de gravação
    async getRecordingPath(uuid: string, domain: string) {
    const record = await prisma.cdr.findFirst({
      where: {
        uuid: uuid,
        domainName: domain
      },
      select: {
        recordPath: true,
        recordName: true
      }
    });

    return record;
  }
}