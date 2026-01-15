import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

// Converte para segundos
const timeToSeconds = (timeStr: string) => {
  const clean = timeStr.replace(/"/g, '').trim();
  const [h, m, s] = clean.split(':').map(Number);
  return (h * 3600) + (m * 60) + s;
};

// Converte "14/01/2026, 18:36:46" para Objeto Date
const parseDate = (dateStr: string) => {
  const clean = dateStr.replace(/"/g, '').trim();
  const [datePart, timePart] = clean.split(', ');
  const [day, month, year] = datePart.split('/');
  
  return new Date(`${year}-${month}-${day}T${timePart}`);
};

async function main() {
  console.log(" Iniciando ETL (Extract, Transform, Load)...");
  
  const csvFilePath = path.resolve(__dirname, '../extrato_de_ligacoes.csv');
  
  const results: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(` Lendo ${results.length} linhas do arquivo CSV`);
      
      for (const row of results) {
        const dataRaw = row['data'] || row['"data"'];
        const origem = row['origem'] || row['"origem"'];
        const destino = row['destino'] || row['"destino"'];
        const duracao = row['duracao'] || row['"duracao"'];

        if (!dataRaw) continue;

        await prisma.cdr.create({
          data: {
            startStamp: parseDate(dataRaw),
            callerIdNumber: origem.replace(/"/g, ''),
            destinationNumber: destino.replace(/"/g, ''),
            billsec: timeToSeconds(duracao),
            
            domainName: 'empresa.telenova.com.br',
            hangupCause: 'NORMAL_CLEARING',
            recordPath: '/var/spool/asterisk/monitor',
            recordName: `rec-${Date.now()}-${Math.floor(Math.random()*1000)}.wav`
          }
        });
      }
      console.log("Banco de dados populado com sucesso!");
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });