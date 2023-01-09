// prepare.js
const isCi = process.env.CI !== undefined;
if (!isCi) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("husky")?.install();
}
