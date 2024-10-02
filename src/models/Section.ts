import {RegexPattern} from './types'
  
class Section {
    streetAddress: RegexPattern = {
        line: 1,
        re: /((?:(?!ATTY FIRM:).)*)(?:\s+ATTY FIRM:)?/g,
    };
    firm: RegexPattern = {
        line: 1,
        re: /ATTY FIRM:\s+(.+)/g,
    };
    cityAddress: RegexPattern;

    constructor(public name: string, public lines: string[], public header: any) {
        this.cityAddress = {
        line: lines.length - 1,
        re: /\s+(.*?)\s+(\w{2})\s+(\d{5})/g,
        };
    }

    getMatch(pattern: RegexPattern): RegExpExecArray | null {
        return pattern.re.exec(this.lines[pattern.line]);
    }

    getCityAddress(): [string, string, string] {
        const match = this.getMatch(this.cityAddress);
        if (match == null) return ["", "", ""];
        return [match[1].trim(), match[2].trim(), match[3].trim()];
    }

    getCounty(): string {
        return this.header.county;
    }

    getStreetAddress(): string {
        const match = this.getMatch(this.streetAddress);
        if (match == null) return "";
        return match && match[1].trim();
    }

    getAddress(): [string, string, string, string] {
        const [city, state, zipCode] = this.getCityAddress();
        let streetAddress = this.getStreetAddress();

        if (this.lines.length === 4) {
        const poBox = this.lines[2].trim();
        streetAddress = `${streetAddress}, ${poBox}`;
        }

        streetAddress = streetAddress.replace('P.O. BOX', 'PO BOX');
        return [streetAddress, city, state, zipCode];
    }

    getFirm(): string {
        const match = this.getMatch(this.firm);
        if (match == null) return "";
        return match && match[1].trim();
    }
}

export default Section;