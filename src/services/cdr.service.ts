import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { ICdrRepository } from '../repositories/ICdrRepository';
import { PrismaCdrRepository } from '../repositories/CdrRepository';

export class CdrService {
  private repository: ICdrRepository;

  // implementa a interface do repository
  constructor() {
    this.repository = new PrismaCdrRepository();
  }
  
  // busca o extrato de um domínio entre duas datas
  async getExtrato(domain: string, start?: string, end?: string) {
    const startDate = start ? parseISO(start) : startOfDay(new Date());
    const endDate = end ? parseISO(end) : endOfDay(new Date());

    if (start && isNaN(Date.parse(start as string))) {
      throw new Error("Invalid start date");
    }

    if (end && isNaN(Date.parse(end as string))) {
      throw new Error("Invalid end date");
    }

    const records = await this.repository.findManyByDomain({
      domain,
      startDate,
      endDate
    });

    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    
    return records.map(record => ({
      uuid: record.uuid,
      data: record.startStamp,
      origem: record.callerIdNumber,
      destino: record.destinationNumber,
      duracao_segundos: record.billsec,
      status: record.hangupCause,
      recording_url: `${baseUrl}/recording?id=${record.uuid}`
    }));
  }

  // busca o path do arquivo de gravação
  async getRecordingPath(uuid: string, domain: string) {
    return await this.repository.findRecordingPath(uuid, domain);
  }
}