export class Humanizer {
  private static readonly AI_CLICHES = [
    /dear hiring manager,?\s*/gi,
    /i am thrilled to submit my application/gi,
    /in today's fast-paced (world|environment)/gi,
    /look no further/gi,
    /i am writing to express my strong interest/gi,
    /i am passionate about delivering exceptional/gi,
    /rest assured,?\s*/gi,
    /please find my proposal attached/gi
  ];

  /**
   * Refines draft text to ensure natural, concise, and professional cadence without AI robotic tropes.
   */
  public static humanize(rawText: string, clientName?: string): string {
    let text = rawText.trim();

    // Replace generic AI salutations
    if (clientName && clientName.trim().length > 0 && !clientName.includes('Client') && !clientName.includes('Unknown')) {
      text = text.replace(/^(Dear Hiring Manager|Dear Client|Hello Hiring Team),?/i, `Hi ${clientName},`);
    } else {
      text = text.replace(/^(Dear Hiring Manager|Dear Client|Hello Hiring Team),?/i, 'Hi there,');
    }

    // Strip robotic cliches
    for (const pattern of Humanizer.AI_CLICHES) {
      text = text.replace(pattern, '');
    }

    // Normalize whitespace and paragraph breaks
    text = text
      .split('\n')
      .map(line => line.trim())
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n\n');

    return text;
  }
}
