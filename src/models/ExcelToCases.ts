import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
// import { readFileSync } from 'fs';

class ExcelToCases {
  private fileBuffer: Buffer;

  constructor(fileBuffer: Buffer) {
    this.fileBuffer = fileBuffer;
  }

  async generateCases(): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(this.fileBuffer);

    const worksheet = workbook.getWorksheet('Cases');
    if (!worksheet) {
      throw new Error('Worksheet "Cases" not found');
    }

    const cases: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const caseItem = {
        'Docket #': row.getCell(1).value,
        'Case Title': row.getCell(2).value,
        'Case Filed': row.getCell(3).value,
        'Demand Amount': row.getCell(4).value,
        'Case Type': row.getCell(5).value,
        'County': row.getCell(6).value,
        'Plaintiff': row.getCell(7).value,
        'Attorney': row.getCell(8).value,
        'Firm Name': row.getCell(9).value,
        'Defendant 1': row.getCell(10).value,
        'Defendant 1 Address': row.getCell(11).value,
        'Defendant 1 City': row.getCell(12).value,
        'Defendant 1 State': row.getCell(13).value,
        'Defendant 1 Zip Code': row.getCell(14).value,
        'Defendant 1 Attorney': row.getCell(15).value,
        'Defendant 2': row.getCell(16).value,
        'Defendant 2 Address': row.getCell(17).value,
        'Defendant 2 Attorney': row.getCell(18).value,
      };

      cases.push(caseItem);
    });

    return cases;
  }

  static async readExcelFile(file: File): Promise<any[]> {
    const fileBuffer = await file.arrayBuffer();
    const excelToCases = new ExcelToCases(Buffer.from(fileBuffer));
    return excelToCases.generateCases();
  }
}

export default ExcelToCases;