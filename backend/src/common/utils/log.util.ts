import * as util from 'util';

export const LogUtil = {
  consoleLog(identifier: string, anything: any) {
    console.log(
      identifier,
      util.inspect(anything, {
        showHidden: false,
        depth: null,
        colors: true,
      }),
    );
  },
};
