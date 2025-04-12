/**
 * Splits a full file name into its base name and extension.
 *
 * @param {string} fullFileName - The complete name of the file (e.g., "document.txt" or "archive.tar.gz").
 * @returns {{ baseName: string, extension: string }} An object containing the base name and file extension.
 */
function splitFileName(fullFileName) {
  const fileNameParts = fullFileName.split(".");
  const extension = fileNameParts.slice(-1)[0];
  fileNameParts.pop();
  const baseName = fileNameParts.join(".");
  return { baseName, extension };
}

module.exports = splitFileName;
