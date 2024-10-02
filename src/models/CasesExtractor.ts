// import Defendant  from './Defendant';
import PlainTiff from './PlainTiff';
import Header from './Header';
import SectionIterator from './SectionIterator'

const docketRe: RegExp = /0LT-(\d{6}-\d{2})/g;
const caseDetailsRe: RegExp = /(.*? VS .*?)\s+(\d{2}\/\d{2}\/\d{2})\s+(\S+)\s+(.+)/g;

class CasesExtractor {
  extractCasesFromText(text: string, limit: number = 5): any[] {
    const cases: any[] = [];

    const [headerRaw, ...casesRaw] = text.split('0LT-');
    const header = new Header(headerRaw.split('\n').filter((line) => line.trim()));
    header.update();

    for (let idx = 0; idx < casesRaw.length; idx++) {
      if (limit !== -1 && idx >= limit) {
        break;
      }

      const caseRaw = casesRaw[idx];
      console.log("Case: ", caseRaw);
      const caseData: any = {};

      const firstLine = caseRaw.split('\n')[0].trim();
      console.log("First line: ", firstLine);
      docketRe.lastIndex = 0;
      caseDetailsRe.lastIndex = 0;
      const docketMatch = docketRe.exec(`0LT-${firstLine}`);
      caseData['Docket #'] = docketMatch ? docketMatch[1] : '';

      const caseDetailsMatch = caseDetailsRe.exec(firstLine);
      if (caseDetailsMatch) {
        caseData['Case Title'] = caseDetailsMatch[1].trim().replace(caseData['Docket #'], '').trim();
        caseData['Case Filed'] = caseDetailsMatch[2].trim();
        caseData['Demand Amount'] = parseFloat("0" + caseDetailsMatch[3].trim());
        caseData['Case Type'] = caseDetailsMatch[4].trim();
      } else {
        console.log(`\nCase ${idx}: No match for ${JSON.stringify(caseRaw)}`);
      }

      try {
        const iterator = new SectionIterator(caseRaw, header);
        const iteration = iterator[Symbol.iterator]();
        const plaintiffSection = iteration.next().value;
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
      } catch (error) {
        if (error instanceof Error && error.message === 'Section not found') {
          console.error('Section not found');
        } else {
          console.error('Unknown error:', error);
        }
      }

      cases.push(caseData);
    }

    return cases;
  }
}

export default CasesExtractor;