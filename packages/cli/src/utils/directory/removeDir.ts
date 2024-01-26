import { rimraf } from "rimraf";
import path from "path";

const removeFileOrDirectory = rimraf;

export const removeDir = (
  projectDir: string,
  dirName: string
): Promise<boolean> => {
  const safeDirName = path.basename(dirName);
  return removeFileOrDirectory(path.join(projectDir, safeDirName));
};
