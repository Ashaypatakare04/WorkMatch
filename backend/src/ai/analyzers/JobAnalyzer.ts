import { NormalizedJob } from '../../models/NormalizedJob.js';
import { JobAnalysis } from '../../models/JobAnalysis.js';
import { AIGateway } from '../gateway/AIGateway.js';
import { JOB_ANALYZER_V1 } from '../prompts/job_analyzer_v1.js';

export class JobAnalyzer {
  public static async analyze(job: NormalizedJob, userId?: string): Promise<JobAnalysis> {
    const prompt = JOB_ANALYZER_V1.render(job);

    const result = await AIGateway.executePrompt<{
      required_skills?: string[];
      optional_skills?: string[];
      experience_requirement?: string;
      technical_complexity?: 'Low' | 'Medium' | 'High';
      estimated_hours?: number;
      step_count?: number;
      communication_level?: 'Low' | 'Medium' | 'High';
      deadline_pressure?: 'Low' | 'Medium' | 'High';
      budget_quality?: 'Low' | 'Fair' | 'High';
      client_expectations?: string;
    }>({
      userId,
      endpoint: '/ai/job-analysis',
      promptName: JOB_ANALYZER_V1.name,
      promptVersion: JOB_ANALYZER_V1.version,
      renderedPrompt: prompt,
      isStructured: true,
      schemaDescription: 'JobAnalysisSchema'
    });

    const data = result.data || {};
    const now = new Date().toISOString();

    return {
      id: `ja_${job.id}`,
      job_id: job.id,
      required_skills: data.required_skills && data.required_skills.length > 0
        ? data.required_skills
        : (job.requirements && job.requirements.length > 0 ? job.requirements : [job.category]),
      optional_skills: data.optional_skills || [],
      experience_requirement: data.experience_requirement || job.experience_level || 'Entry Level',
      technical_complexity: data.technical_complexity || 'Low',
      estimated_hours: data.estimated_hours || 3.0,
      step_count: data.step_count || 2,
      communication_level: data.communication_level || 'Low',
      deadline_pressure: data.deadline_pressure || 'Low',
      budget_quality: data.budget_quality || 'Fair',
      client_expectations: data.client_expectations || 'Deliver accurate results adhering to guidelines.',
      analyzed_at: now
    };
  }
}
