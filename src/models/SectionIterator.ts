import Header from './Header';
import Defendant  from './Defendant';
import PlainTiff from './PlainTiff';
import Section from './Section';


class SectionIterator {
    private lines: string[];
    private currentIndex: number;
    private header: Header;
  
    constructor(text: string, header: Header) {
      this.lines = text.split(/\r?\n/).map((line) => line.trimEnd()).filter((line) => line).slice(1);
      this.currentIndex = 0;
      this.header = header;
    }
  
    *[Symbol.iterator](): IterableIterator<Section> {
      while (this.currentIndex < this.lines.length) {
        const currentLineText = this.lines[this.currentIndex];
        const startIndex = 0;
        const endIndex = currentLineText.indexOf(':', 1);
  
        if (endIndex === -1) {
          throw new Error('Section not found');
        }
  
        const sectionName = currentLineText.slice(startIndex, endIndex).trim();
  
        if (sectionName.includes('PROGRAM-ID')) {
          this.header.lines = this.lines.slice(this.currentIndex, this.currentIndex + 3);
          this.header.update();
          this.currentIndex += 4;
          continue;
        }
  
        const sectionLines = [currentLineText.slice(endIndex + 1).trim()];
  
        while (++this.currentIndex < this.lines.length) {
          const currentLineText = this.lines[this.currentIndex];
          if (!currentLineText.slice(0, 14).trim()) {
            sectionLines.push(currentLineText);
          } else {
            break;
          }
        }

        if (sectionName.includes('PLAINTIFF')) {
          yield new PlainTiff(sectionName, sectionLines, this.header);
        } else {
          yield new Defendant(sectionName, sectionLines, this.header);
        }
      }
    }
  }

export default SectionIterator;