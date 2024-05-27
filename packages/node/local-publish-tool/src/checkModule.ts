export default function checkModule(npmName: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require(npmName);

    return true;
  } catch (e) {
    return false;
  }
}
