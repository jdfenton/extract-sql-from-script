
export class Query {
  queryName: string;
  queryCode: QueryCodeLine[] = [];
  queryVariables: QueryVariable[] = [];
  selectCount: number = 0;
  constructor(queryName: string) {
    this.queryName = queryName;
  }
}

export class QueryCodeLine {
  codeText: string;
  eligibleForSub: boolean;
  constructor (codeText: string) {
    this.codeText = codeText;
    this.eligibleForSub = true;
  }
}

export class QueryVariable {
  varName: string;
  varValue: string;
  constructor (varName: string, varValue: string) {
    this.varName = varName;
    this.varValue = varValue;
  }
}