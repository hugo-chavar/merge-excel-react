import Section  from './Section';
import { RegexPattern } from './types';

class PlainTiff extends Section {
  plaintiff: RegexPattern = {
    line: 0,
    re: /(.+)\s+ATTN ATTY/g,
  };

  plaintiffAtty: RegexPattern = {
    line: 0,
    re: /ATTN ATTY:\s+(.+)/g,
  };

  getPlaintiff(): string {
    const match = this.getMatch(this.plaintiff);
    return match ? match[1].trim() : '';
  }

  getPlaintiffAtty(): string {
    const match = this.getMatch(this.plaintiffAtty);
    return match ? match[1].trim() : '';
  }
}

export default PlainTiff;