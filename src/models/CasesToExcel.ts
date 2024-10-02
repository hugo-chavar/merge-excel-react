import * as ExcelJS from 'exceljs';
import * as buffer from 'buffer';

class CasesToExcel {
  private cases: any[];

  constructor(cases: any[]) {
    this.cases = cases;
  }

  async generateExcelFile(): Promise<buffer.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cases');

    // Define header row
    const headerRow = [
      'Docket #',
      'Case Title',
      'Case Filed',
      'Demand Amount',
      'Case Type',
      'County',
      'Plaintiff',
      'Attorney',
      'Firm Name',
      'Defendant 1',
      'Defendant 1 Address',
      'Defendant 1 Attorney',
      'Defendant 2',
      'Defendant 2 Address',
      'Defendant 2 Attorney',
    ];

    // Add header row
    worksheet.addRow(headerRow);

    // Add cases rows
    this.cases.forEach((caseItem) => {
      const row = [
        caseItem['Docket #'],
        caseItem['Case Title'],
        caseItem['Case Filed'],
        caseItem['Demand Amount'],
        caseItem['Case Type'],
        caseItem['County'],
        caseItem['Plaintiff'],
        caseItem['Attorney'],
        caseItem['Firm Name'],
        caseItem['Defendant 1'],
        caseItem['Defendant 1 Address'],
        caseItem['Defendant 1 Attorney'],
        caseItem['Defendant 2'],
        caseItem['Defendant 2 Address'],
        caseItem['Defendant 2 Attorney'],
      ];
      worksheet.addRow(row);
    });

    // Adjust column widths
    worksheet.columns.forEach((column) => {
        if (column.values) {
            const maxLength = Math.max(...column.values.map((value) => String(value).length));
            column.width = maxLength + 5;
        } else {
            column.width = 10; // Default width if values are empty
        }
    });
    const buffer = await workbook.xlsx.writeBuffer() as buffer.Buffer;
    return buffer;
    // return workbook.xlsx.writeBuffer();
    // Generate Excel file buffer
    // const buffer = await workbook.xlsx.writeBuffer();

    // return buffer;
  }

  async writeExcelFileToFileSystem(fileName: string): Promise<void> {
    const buffer = await this.generateExcelFile();
    const fs = require('fs');
    fs.writeFileSync(fileName, buffer);
  }
}