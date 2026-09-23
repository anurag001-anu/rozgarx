import { getPayload } from 'payload';
import configPromise from '@payload-config';

export class NotificationService {
  /**
   * Evaluates if a single alert matches a single job based on progressive narrowing logic
   */
  public static isMatch(alert: any, job: any): boolean {
    // 1. Govt Category Exact Match
    if (alert.type === 'government' && alert.govtCategory) {
      if (job.govtCategory !== alert.govtCategory) return false;
    }

    // 2. Private Category Exact Match
    if (alert.type === 'private' && alert.privateCategory) {
      if (job.privateCategory !== alert.privateCategory) return false;
    }

    // 3. Work Mode Exact Match
    if (alert.type === 'private' && alert.workMode) {
      if (job.workMode !== alert.workMode) return false;
    }

    // 4. State / Location Normalized Match
    if (alert.state && alert.type === 'government') {
      if (!this.textContains(job.location || '', alert.state)) return false;
    }
    if (alert.location) {
      if (!this.textContains(job.location || '', alert.location)) return false;
    }

    // 5. Qualification Normalized Match
    if (alert.qualification) {
      if (!this.textContains(job.qualification || '', alert.qualification)) return false;
    }

    // 6. Experience Normalized Match
    if (alert.experience && alert.type === 'private') {
      if (!this.textContains(job.experience || '', alert.experience)) return false;
    }

    // 7. Keywords Match (Title + Description + Skills)
    if (alert.keywords) {
      const searchSpace = `${job.title || ''} ${this.extractRichText(job.description) || ''} ${job.skills || ''}`;
      if (!this.textContains(searchSpace, alert.keywords)) return false;
    }

    return true; // All specified criteria matched
  }

  /**
   * Attempt to create a NotificationHistory record. 
   * Returns true if successful (meaning it was unique), false if duplicate/failed.
   */
  private static async deliverNotification(userId: string | number, jobId: string | number, alertId: string | number, payload: any): Promise<boolean> {
    try {
      // The beforeChange hook in NotificationHistory will throw if it's a duplicate
      await payload.create({
        collection: 'notification-history' as any,
        data: {
          user: userId,
          job: jobId,
          alert: alertId,
          status: 'sent',
          channels: ['in-app']
        } as any
      });

      // Update the JobAlert's lastMatchedAt metadata
      await payload.update({
        collection: 'job-alerts' as any,
        id: alertId,
        data: {
          lastMatchedAt: new Date().toISOString(),
          lastNotifiedAt: new Date().toISOString(),
        }
      });

      // FUTURE: Call actual email/push providers here
      // e.g. await ExternalPushProvider.send(...)

      return true;
    } catch (err) {
      // Likely a duplicate error from the beforeChange hook
      return false;
    }
  }

  // --- Helpers ---
  private static textContains(target: string, query: string): boolean {
    if (!target) return false;
    return target.toLowerCase().includes(query.toLowerCase());
  }

  private static extractRichText(desc: any): string {
    if (!desc || typeof desc !== 'object') return '';
    let result = '';
    const extract = (node: any) => {
      if (node.text) result += node.text + ' ';
      if (node.children) node.children.forEach(extract);
    };
    extract(desc);
    return result.toLowerCase();
  }
}
