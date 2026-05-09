/**
 * Simple unified-style diff between two strings.
 *
 * Not a true unified-diff algorithm — sufficient for showing line-level
 * changes to the user when prompting about file refreshes. Shared by
 * `marr sync` and `marr update`.
 */

export function generateDiff(oldContent: string, newContent: string, filename: string): string {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  const lines: string[] = [];
  lines.push(`--- a/${filename}`);
  lines.push(`+++ b/${filename}`);

  const maxLines = Math.max(oldLines.length, newLines.length);
  let inHunk = false;
  let hunkStart = -1;

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine !== newLine) {
      if (!inHunk) {
        hunkStart = i;
        inHunk = true;
        lines.push(`@@ -${i + 1} +${i + 1} @@`);
      }

      if (oldLine !== undefined) {
        lines.push(`-${oldLine}`);
      }
      if (newLine !== undefined) {
        lines.push(`+${newLine}`);
      }
    } else if (inHunk) {
      lines.push(` ${oldLine || ''}`);
      if (i - hunkStart > 3) {
        inHunk = false;
      }
    }
  }

  return lines.join('\n');
}
