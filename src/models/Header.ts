class Header {
  re: RegExp = /VENUE:\s*([A-Z]{3})/g;
  lines: string[];
  county: string;

  constructor(lines: string[]) {
    this.lines = lines;
    this.county = '';
  }

  update(): void {
    this.re.lastIndex = 0;
    const match = this.re.exec(this.lines[2]);
    if (match) {
      this.county = match[1].trim();
    } else {
      throw new Error('County not found in header lines');
    }
  }
}

export default Header;