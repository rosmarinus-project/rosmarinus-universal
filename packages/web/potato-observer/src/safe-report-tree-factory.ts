import type { ReportTreeFactoryOptions } from './report-tree-factory';
import type { IReportTree, IReportTreeFactory } from './types/interfaces';
import { createReportTreeFactory } from './report-tree-factory';

class SafeReportTreeFactory implements IReportTreeFactory {
  private factory: Promise<IReportTreeFactory>;

  public constructor(options: ReportTreeFactoryOptions) {
    this.factory = createSafeReportTreeFactory(options);
  }

  public detach(): void {
    this.factory.then((factory) => {
      factory.detach();
    });
  }

  public attach(root: Element): IReportTree {
    let tree: IReportTree | null = null;
    let hasDetach = false;

    this.factory.then((factory) => {
      if (hasDetach) {
        return;
      }

      tree = factory.attach(root);
    });

    return {
      detach: () => {
        hasDetach = true;
        tree?.detach();
      },
    };
  }
}

/** 添加了 polyfill 的版本 */
export async function createSafeReportTreeFactory(options: ReportTreeFactoryOptions): Promise<IReportTreeFactory> {
  if (!window.IntersectionObserver) {
    // https://staticfile.qq.com/datong/universalReportH5/latest/intersection-observer.js
    await import('intersection-observer');
  }

  return createReportTreeFactory(options);
}

/** 添加了 polyfill 的同步版本 */
export function createSafeReportTreeFactorySync(options: ReportTreeFactoryOptions): IReportTreeFactory {
  return new SafeReportTreeFactory(options);
}
