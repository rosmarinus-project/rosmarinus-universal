export interface IReportTree {
  detach(): void;
}

export interface IReportTreeFactory {
  attach(root: Element): IReportTree;
  detach(): void;
}
