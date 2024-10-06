import * as ExcelJS from 'exceljs';
import * as buffer from 'buffer';
import { saveAs } from 'file-saver';

class CasesToExcel {
  private cases: any[];

  constructor(cases: any[]) {
    this.cases = cases;
  }

  async generateExcelFile(): Promise<buffer.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cases', {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    worksheet.columns = [
      { header:'Docket #', width:10 },
      { header:'Case Title', width:52 },
      { header:'Case Filed', width:10 },
      { header:'Demand Amount', width:14 },
      { header:'Case Type', width:14 },
      { header:'County', width:7 },
      { header:'Plaintiff', width:34 },
      { header:'Attorney', width:26 },
      { header:'Firm Name', width:29 },
      { header:'Defendant 1', width:29 },
      { header:'Defendant 1 Address', width:52 },
      { header:'Defendant 1 City', width:18 },
      { header:'Defendant 1 State', width:16 },
      { header:'Defendant 1 Zip Code', width:18 },
      { header:'Defendant 1 Attorney', width:18 },
      { header:'Defendant 2', width:29 },
      { header:'Defendant 2 Address', width:52 },
      { header:'Defendant 2 Attorney', width:18 }
    ];

    const letters = 'ABCDEFGHIJKLMNOP';
    for (let i = 0; i < letters.length; i++) {
      worksheet.getCell(letters[i]+'1').font = {
        bold: true
       };
    }



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
        caseItem['Defendant 1 City'],
        caseItem['Defendant 1 State'],
        caseItem['Defendant 1 Zip Code'],
        caseItem['Defendant 1 Attorney'],
        caseItem['Defendant 2'],
        caseItem['Defendant 2 Address'],
        caseItem['Defendant 2 Attorney'],
      ];
      worksheet.addRow(row);
      
    });

    const buffer = await workbook.xlsx.writeBuffer() as buffer.Buffer;
    return buffer;
  }

  async writeExcelFileToFileSystem(fileName: string): Promise<void> {
    const buffer = await this.generateExcelFile();

    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
  }
}

export default CasesToExcel;