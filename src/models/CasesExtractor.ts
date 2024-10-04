// import Defendant  from './Defendant';
import PlainTiff from './PlainTiff';
import Header from './Header';
import SectionIterator from './SectionIterator'
import Logger from '../utils/logger';

const docketRe: RegExp = /0LT-(\d{6}-\d{2})/g;
const caseDetailsRe: RegExp = /(.*? VS .*?)\s+(\d{2}\/\d{2}\/\d{2})\s+(\S+)\s+(.+)/g;

class CasesExtractor {
  private logger: Logger;
  private progressValue = 0.0;

  getProgressValue() {
    return this.progressValue;
  }
  
  private progressCallback: (progress: number) => void = (progress) => {
    // Default implementation
    this.progressValue = progress;
    console.log(`Progress: ${progress.toFixed(2)}%`);
  };
  
  constructor(logger: Logger) {
    this.logger = logger;
  }

  extractCasesFromText(text: string, limit: number = 5): any[] {
    const cases: any[] = [];

    const [headerRaw, ...casesRaw] = text.split('0LT-');
    const header = new Header(headerRaw.split('\n').filter((line) => line.trim()));
    header.update();

    this.progressCallback(0); // Initialize progress

    const loopLimit = Math.min(casesRaw.length, limit !== -1 ? limit : Infinity);

    for (let idx = 0; idx < loopLimit; idx++) {

      const caseRaw = casesRaw[idx];
      this.logger.log("Case: ", caseRaw);
      const caseData: any = this.processCase(caseRaw, idx, header);

      cases.push(caseData);

      this.progressCallback((idx + 1) / loopLimit * 100); // Update progress
    }

    this.progressCallback(100); // Complete progress

    return cases;
  }

  private processCase(caseRaw: string, idx: number, header: Header) {
    const caseData: any = {};

    const firstLine = caseRaw.split('\n')[0].trim();
    this.logger.log("First line: ", firstLine);
    docketRe.lastIndex = 0;
    caseDetailsRe.lastIndex = 0;
    const docketMatch = docketRe.exec(`0LT-${firstLine}`);
    if (docketMatch)
      caseData['Docket #'] = docketMatch[1];

    else
      throw new Error('Can not find Docket number for line: ' + firstLine);

    const caseDetailsMatch = caseDetailsRe.exec(firstLine);
    if (caseDetailsMatch) {
      caseData['Case Title'] = caseDetailsMatch[1].trim().replace(caseData['Docket #'], '').trim();
      caseData['Case Filed'] = caseDetailsMatch[2].trim();
      caseData['Demand Amount'] = parseFloat("0" + caseDetailsMatch[3].trim());
      caseData['Case Type'] = caseDetailsMatch[4].trim();
    } else {
      this.logger.log(`\nCase ${idx}: No match for ${JSON.stringify(caseRaw)}`);
    }

    const iterator = new SectionIterator(caseRaw, header, this.logger);
    const iteration = iterator[Symbol.iterator]();
    const plaintiffSection = iteration.next().value;

    if (!plaintiffSection) throw new Error('Case ' + caseData['Docket #'] + ' does not have Plaintiff');

    caseData['County'] = plaintiffSection.getCounty();
    caseData['Plaintiff'] = plaintiffSection.getPlaintiff();
    caseData['Attorney'] = plaintiffSection.getPlaintiffAtty();
    caseData['Firm Name'] = plaintiffSection.getFirm();
    const [streetAddress, city, state, zipCode] = plaintiffSection.getAddress();
    caseData['Attorney Address'] = `${streetAddress}, ${city}, ${state}, ${zipCode}`;

    for (let i = 0; i < 2; i++) {
      caseData[`Defendant ${i + 1}`] = '';
      caseData[`Defendant ${i + 1} Address`] = '';
      caseData[`Defendant ${i + 1} Attorney`] = '';
    }

    for (let i = 0; i < 2; i++) {
      let defendantSection = iteration.next().value;
      if (defendantSection == null) continue;
      while (defendantSection instanceof PlainTiff) {
        defendantSection = iteration.next().value;
      }
      caseData[`Defendant ${i + 1}`] = defendantSection.getDefendant();
      const [streetAddress, city, state, zipCode] = defendantSection.getAddress();
      if (i === 0) {
        caseData[`Defendant ${i + 1} Address`] = streetAddress;
        caseData[`Defendant ${i + 1} City`] = city;
        caseData[`Defendant ${i + 1} State`] = state;
        caseData[`Defendant ${i + 1} Zip Code`] = zipCode;
      } else {
        caseData[`Defendant ${i + 1} Address`] = `${streetAddress}, ${city}, ${state}, ${zipCode}`;
      }
      caseData[`Defendant ${i + 1} Attorney`] = defendantSection.getDefendantAtty();
    }
    return caseData;
  }

  onProgress(callback: (progress: number) => void) {
    this.progressCallback = callback;
  }
}

export default CasesExtractor;