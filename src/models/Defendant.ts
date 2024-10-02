import {RegexPattern} from './types'
import  Section  from './Section';

class Defendant extends Section {
  defendant: RegexPattern = {
    line: 0,
    re: /(.+)\sATTN ATTY/g,
  };

  defendantAtty: RegexPattern = {
    line: 0,
    re: /ATTN ATTY:\s(.+)/g,
  };

  getDefendant(): string {
    const match = this.getMatch(this.defendant);
    return match ? match[1].trim() : '';
  }

  getDefendantAtty(): string {
    const match = this.getMatch(this.defendantAtty);
    const firm = this.getFirm() ? ` (${this.getFirm()})` : '';

    return match ? `${match[1].trim()}${firm}` : '';
  }
}

export default Defendant;