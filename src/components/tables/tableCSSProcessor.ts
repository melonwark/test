export default class TableCSSProcessor {

  private _totalColumns: number;
  private _totalRows: number = 0;
  private _classes: Record<string, unknown>;
  private _processedClasses: { rows: number[]; columns: number[]; value: unknown }[] = [];

  constructor(totalColumns: number, classes: Record<string, unknown>) {
    this._totalColumns = totalColumns;
    this._classes = classes;
    this.processClasses();
  }

  set classes(classes) {
    this._classes = classes;
    this.processClasses();
  }

  get classes() {
    return this._classes || {};
  }

  set totalRows(totalRows) {
    if (this._totalRows !== totalRows) {
      this._totalRows = totalRows;
      this.processClasses();
    }
  }

  get totalRows() {
    return this._totalRows || 0;
  }

  set totalColumns(totalColumns) {
    if (this._totalColumns !== totalColumns) {
      this._totalColumns = totalColumns;
      this.processClasses();
    }
  }

  get totalColumns() {
    return this._totalColumns || 0;
  }

  get processedClasses() {
    return this._processedClasses;
  }

  updateColumns(newTotalColumns: number) {
    if (this._totalColumns !== newTotalColumns) {
      this._totalColumns = newTotalColumns;
      this.processClasses();
    }
  }

  processClasses() {
    this._processedClasses = Object.keys(this.classes)
      .filter(key => key.includes('/'))
      .map(key => {
        const type = key.split('/');
        return {
          rows: this.toRange(type[0], this.totalRows),
          columns: this.toRange(type[1], this.totalColumns),
          value: this.classes[key],
        };
      });
  }

  private toRange(selector: string, total: number): number[] {
    if (!selector || total === 0) {
      return [];
    }

    switch (selector) {
      case 'all':
        return Array.from({ length: total }, (_, i) => i);
      case 'even':
        return Array.from({ length: total }, (_, i) => i).filter(i => i % 2 === 0);
      case 'odd':
        return Array.from({ length: total }, (_, i) => i).filter(i => i % 2 === 1);
    }

    return selector.split(',')
      .map(part => part.trim())
      .flatMap(part => {
        if (part.includes('_')) {
          const range = part.split('_').map((val, index) =>
            val ? parseInt(val, 10) : index === 0 ? 0 : total
          ).map(val => (val < 0 ? total + val : val));

          if (range.length === 2 && range[0] >= 0 && range[1] >= range[0]) {
            return Array.from({ length: range[1] - range[0] }, (_, i) => range[0] + i);
          }
          return [];
        }

        const parsed = parseInt(part, 10);
        return isNaN(parsed) ? [] : [parsed];
      });
  }

  process(rowIndex: null|number = null, columnIndex: null|number = null, ...args: unknown[]) {
    return this.processedClasses
      .filter(classes => {
        return !((rowIndex === null && columnIndex === null) ||
                    (columnIndex === null && classes.columns.length > 0) ||
                    (rowIndex === null && classes.rows.length > 0) ||
                    (columnIndex !== null && !classes.columns.includes(columnIndex)) ||
                    (rowIndex !== null && !classes.rows.includes(rowIndex)));
      })
      .map(classes => TableCSSProcessor.processValue(classes.value, ...args))
      .reduce((result, classes) => Object.assign(result, classes), {});
  }

  static processValue(classes: unknown, ...args: unknown[]) {
    if (classes instanceof Function) {
      return classes(...args);
    }

    if (classes) {
      return classes;
    }

    return {};
  }

  processFixed(classes: { [key: string]: Record<string, string | boolean> }, columnIndex: number, ...args: unknown[]) {
    if (!classes) {
      return {};
    }

    return Object.keys(classes)
      .filter(key => key !== 'row')
      .filter(key => this.toRange(key, this.totalColumns).includes(columnIndex))
      .map(key => TableCSSProcessor.processValue(classes[key], ...args))
      .reduce((result, classes) => Object.assign(result, classes), {});
  }
}
