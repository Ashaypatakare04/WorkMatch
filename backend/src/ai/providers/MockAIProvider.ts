import { AIProvider, AIProviderOptions, AIGenerateResult } from './AIProvider.js';

/**
 * MockAIProvider: High-fidelity, deterministic, zero-cost AI provider.
 * Simulates intelligent NLP analysis, extraction, proposal writing, and claim verification
 * without requiring external API keys.
 */
export class MockAIProvider implements AIProvider {
  public readonly name = 'MockAIProvider';

  public async generateText(prompt: string, options?: AIProviderOptions): Promise<AIGenerateResult<string>> {
    const startTime = Date.now();
    let text = 'Mock generated response.';

    if (prompt.includes('Generate a personalized proposal') || prompt.includes('PROPOSAL_GENERATION')) {
      text = this.generateMockProposalText(prompt);
    } else if (prompt.includes('Verify the claims')) {
      text = JSON.stringify({
        verified: true,
        skills_used: ['Data Entry', 'Excel'],
        unsupported_claims: [],
        notes: 'All claims match verified user profile.'
      });
    }

    return {
      data: text,
      rawText: text,
      tokensIn: Math.round(prompt.length / 4),
      tokensOut: Math.round(text.length / 4),
      durationMs: Date.now() - startTime + 35,
      provider: 'mock-engine',
      model: 'workmatch-mock-nlp-v1'
    };
  }

  public async generateStructured<T>(prompt: string, schemaDescription: string, options?: AIProviderOptions): Promise<AIGenerateResult<T>> {
    const startTime = Date.now();
    let resultObj: any = {};

    if (prompt.includes('ANALYZE_JOB')) {
      resultObj = this.generateMockJobAnalysis(prompt);
    } else if (prompt.includes('SCORE_JOB')) {
      resultObj = this.generateMockScore(prompt);
    } else if (prompt.includes('ANALYZE_RISK')) {
      resultObj = this.generateMockRisk(prompt);
    } else if (prompt.includes('VERIFY_CLAIMS')) {
      resultObj = {
        verified: true,
        skills_used: ['Data Entry', 'Web Research', 'Excel'],
        unsupported_claims: [],
        notes: 'Strict verification passed. No inflated credentials or fake experience detected.'
      };
    } else if (prompt.includes('GENERATE_PROPOSALS')) {
      resultObj = this.generateMockProposalVariants(prompt);
    } else {
      resultObj = { message: 'Processed structured output' };
    }

    const raw = JSON.stringify(resultObj);
    return {
      data: resultObj as T,
      rawText: raw,
      tokensIn: Math.round(prompt.length / 4),
      tokensOut: Math.round(raw.length / 4),
      durationMs: Date.now() - startTime + 45,
      provider: 'mock-engine',
      model: 'workmatch-mock-structured-v1'
    };
  }

  private generateMockProposalText(prompt: string): string {
    return `Hi there,

I noticed you need assistance with this project. I have direct experience working with Excel spreadsheets, data entry, and structured web research.

In my recent projects, I have consistently delivered accurate datasets and verified entries with high attention to detail. I can start immediately and deliver the formatted files within your timeframe.

Let me know if you have any questions or specific formatting templates.

Best regards,`;
  }

  private generateMockProposalVariants(prompt: string): any {
    return {
      proposals: [
        {
          style: 'direct',
          title: 'Direct & Action-Oriented',
          content: `Hi,\n\nI reviewed your project requirements and can complete this work quickly and accurately. My verified background includes clean data entry, web research, and spreadsheet organization.\n\nI am available to start today and ensure 100% verified accuracy across all deliverables. Looking forward to your reply.\n\nBest regards,`,
          word_count: 51,
          addressed_requirements: ['Immediate availability', 'High accuracy', 'Spreadsheet formatting']
        },
        {
          style: 'friendly',
          title: 'Friendly & Collaborative',
          content: `Hello!\n\nI would love to help you with this project! I specialize in data tasks, web research, and virtual assistance. I take pride in clear communication, double-checking all entries, and making sure the final deliverable is clean and ready to use.\n\nHappy to answer any questions or review sample data before getting started.\n\nWarm regards,`,
          word_count: 58,
          addressed_requirements: ['Clear communication', 'Quality assurance', 'Sample review']
        },
        {
          style: 'professional',
          title: 'Structured & Professional',
          content: `Dear Client,\n\nI am submitting my proposal for your project based on my established competencies in structured research, data management, and documentation. I adhere strictly to provided guidelines and maintain consistent progress updates.\n\nI will ensure the deliverables meet your quality standards and deadline requirements. Thank you for your consideration.\n\nSincerely,`,
          word_count: 53,
          addressed_requirements: ['Standard adherence', 'Milestone updates', 'Quality compliance']
        },
        {
          style: 'short',
          title: 'Concise & Fast',
          content: `Hi,\n\nI can handle this data and research task efficiently. I have strong experience with Excel, web research, and fast turnaround times. Ready to start right away.\n\nThanks!`,
          word_count: 31,
          addressed_requirements: ['Fast turnaround', 'Immediate start']
        }
      ]
    };
  }

  private generateMockJobAnalysis(prompt: string): any {
    const isTech = prompt.toLowerCase().includes('python') || prompt.toLowerCase().includes('javascript') || prompt.toLowerCase().includes('api');
    const isUrgent = prompt.toLowerCase().includes('urgent') || prompt.toLowerCase().includes('asap') || prompt.toLowerCase().includes('24 hours');

    return {
      required_skills: isTech ? ['Python', 'Web Scraping', 'Automation'] : ['Data Entry', 'Web Research', 'Excel'],
      optional_skills: ['Google Sheets', 'Attention to Detail'],
      experience_requirement: isTech ? 'Intermediate' : 'Entry Level',
      technical_complexity: isTech ? 'Medium' : 'Low',
      estimated_hours: isTech ? 6.0 : 3.0,
      step_count: isTech ? 4 : 2,
      communication_level: 'Low',
      deadline_pressure: isUrgent ? 'High' : 'Low',
      budget_quality: 'Fair',
      client_expectations: 'Accurate data delivery in standard spreadsheet format without duplicates.'
    };
  }

  private generateMockScore(prompt: string): any {
    return {
      overall_score: 88,
      skill_score: 92,
      experience_score: 85,
      difficulty_score: 90,
      budget_score: 82,
      time_score: 89,
      communication_score: 94,
      preference_score: 91,
      client_quality_score: 85,
      matched_skills: ['Data Entry', 'Web Research', 'Excel'],
      missing_skills: [],
      explanation: {
        why_matches: [
          'Required skills (Data Entry, Web Research) directly align with your verified profile',
          'Low communication level fits your stated preference',
          'Project scope matches your preferred part-time workload'
        ],
        why_not_matches: [],
        concerns: ['Ensure format compatibility with client legacy spreadsheet'],
        estimated_effort: 'Approximately 2 to 4 hours of focused work',
        potential_value: 'Solid fixed-price project with high likelihood of positive 5-star review'
      }
    };
  }

  private generateMockRisk(prompt: string): any {
    const descPart = prompt.split('Description:')[1] || prompt.split('JOB DETAILS:')[1] || prompt;
    const lowerDesc = descPart.toLowerCase();
    const isTelegram = lowerDesc.includes('telegram') || lowerDesc.includes('whatsapp') || lowerDesc.includes('pay outside');
    const isUnpaid = lowerDesc.includes('free test') || lowerDesc.includes('unpaid sample');

    if (isTelegram || isUnpaid) {
      return {
        risk_level: 'High',
        risk_score: 85,
        warning_signals: isTelegram
          ? ['Requests communication or payment outside the platform (Telegram/WhatsApp)', 'Circumventing platform payment protection']
          : ['Requesting extensive unpaid test work prior to contract', 'Vague client profile with zero hire history'],
        explanation: 'The listing exhibits high-risk signals commonly associated with off-platform contract manipulation or free labor exploitation.'
      };
    }

    return {
      risk_level: 'Low',
      risk_score: 12,
      warning_signals: [],
      explanation: 'Verified client payment method, clear deliverable expectations, and standard platform communication protocol.'
    };
  }
}
