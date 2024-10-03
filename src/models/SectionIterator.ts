import Header from './Header';
import Defendant  from './Defendant';
import PlainTiff from './PlainTiff';
import Section from './Section';
import Logger from '../utils/logger';


class SectionIterator {
    private lines: string[];
    private currentIndex: number;
    private header: Header;
    private logger: Logger;
  
    constructor(text: string, header: Header, logger: Logger) {
      this.logger = logger;
      this.lines = text.split(/\r?\n/).map((line) => line.trimEnd()).filter((line) => line).slice(1);
      this.logger.log("Iterator lines: ", this.lines);
      this.currentIndex = 0;
      this.header = header;
    }
  
    *[Symbol.iterator](): IterableIterator<Section> {
      this.logger.log('Finding next section')
      while (this.currentIndex < this.lines.length) {
        const currentLineText = this.lines[this.currentIndex];
        const startIndex = 0;
        const endIndex = currentLineText.indexOf(':', 1);
  
        if (endIndex === -1) {
          this.logger.log("Current line: ", currentLineText);
          throw new Error('Section not found');
        }
  
        const sectionName = currentLineText.slice(startIndex, endIndex).trim();
        this.logger.log("Section name: ", sectionName);
  
        if (sectionName.includes('PROGRAM-ID')) {
          this.header.lines = this.lines.slice(this.currentIndex, this.currentIndex + 3);
          this.header.update();
          this.currentIndex += 4;
          continue;
        }
  
        const sectionLines = [currentLineText.slice(endIndex + 1).trim()];
        this.logger.log("Section lines: ", sectionLines);
  
        while (++this.currentIndex < this.lines.length) {
          const currentLineText = this.lines[this.currentIndex];
          this.logger.log("Other line: ", currentLineText);
          if (!currentLineText.slice(0, 14).trim()) {
            sectionLines.push(currentLineText);
          } else {
            break;
          }
        }
        this.logger.log("Section lines: ", sectionLines);
  
        if (sectionName.includes('PLAINTIFF')) {
          this.logger.log("PLAINTIFF Created");
          yield new PlainTiff(sectionName, sectionLines, this.header);
        } else {
          this.logger.log("Defendant Created");
          yield new Defendant(sectionName, sectionLines, this.header);
        }
      }
    }
  }

export default SectionIterator;