// Demo mode dengan rate limiting
export class DemoModeManager {
  private static readonly DEMO_API_KEY = 'demo_key_for_testing';
  private static readonly MAX_REQUESTS_PER_DAY = 5;
  private static readonly STORAGE_KEY = 'demo_usage';

  static getDemoUsage(): { count: number; date: string } {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return { count: 0, date: new Date().toDateString() };
    }
    return JSON.parse(stored);
  }

  static canUseDemo(): boolean {
    const usage = this.getDemoUsage();
    const today = new Date().toDateString();
    
    if (usage.date !== today) {
      // Reset count for new day
      this.resetDemoUsage();
      return true;
    }
    
    return usage.count < this.MAX_REQUESTS_PER_DAY;
  }

  static incrementDemoUsage(): void {
    const usage = this.getDemoUsage();
    const today = new Date().toDateString();
    
    if (usage.date !== today) {
      usage.count = 1;
      usage.date = today;
    } else {
      usage.count++;
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
  }

  static resetDemoUsage(): void {
    const today = new Date().toDateString();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ count: 0, date: today }));
  }

  static getRemainingRequests(): number {
    const usage = this.getDemoUsage();
    const today = new Date().toDateString();
    
    if (usage.date !== today) {
      return this.MAX_REQUESTS_PER_DAY;
    }
    
    return Math.max(0, this.MAX_REQUESTS_PER_DAY - usage.count);
  }
}
