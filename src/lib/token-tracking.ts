// Token usage tracking for BotsRHere Studio
interface TokenUsage {
  userId: string;
  timestamp: number;
  tokensUsed: number;
  eurosCost: number;
  activity: string;
}

interface HourlyUsage {
  hour: string;
  tokensUsed: number;
  eurosCost: number;
}

class TokenTracker {
  private usage: TokenUsage[] = [];
  private readonly TOKENS_PER_EURO = 1000;
  private readonly EUROS_PER_HOUR = 20;

  constructor() {
    this.loadUsageFromStorage();
    this.startHourlyTracking();
  }

  private loadUsageFromStorage() {
    const stored = localStorage.getItem('botsrhere-token-usage');
    if (stored) {
      this.usage = JSON.parse(stored);
    }
  }

  private saveUsageToStorage() {
    localStorage.setItem('botsrhere-token-usage', JSON.stringify(this.usage));
  }

  private startHourlyTracking() {
    // Track usage every hour
    setInterval(() => {
      this.trackHourlyUsage();
    }, 60 * 60 * 1000); // 1 hour in milliseconds
  }

  private trackHourlyUsage() {
    const now = new Date();
    const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    const lastHourUsage = this.getUsageForLastHour();
    
    if (lastHourUsage > 0) {
      this.recordUsage('system', lastHourUsage, 'Hourly usage tracking');
    }
  }

  private getUsageForLastHour(): number {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return this.usage
      .filter(usage => usage.timestamp >= oneHourAgo)
      .reduce((total, usage) => total + usage.tokensUsed, 0);
  }

  // Record token usage
  recordUsage(userId: string, tokensUsed: number, activity: string) {
    const eurosCost = tokensUsed / this.TOKENS_PER_EURO;
    
    const usage: TokenUsage = {
      userId,
      timestamp: Date.now(),
      tokensUsed,
      eurosCost,
      activity
    };

    this.usage.push(usage);
    this.saveUsageToStorage();
  }

  // Get total tokens used by user
  getTotalTokensUsed(userId: string): number {
    return this.usage
      .filter(usage => usage.userId === userId)
      .reduce((total, usage) => total + usage.tokensUsed, 0);
  }

  // Get total cost for user
  getTotalCost(userId: string): number {
    return this.usage
      .filter(usage => usage.userId === userId)
      .reduce((total, usage) => total + usage.eurosCost, 0);
  }

  // Get hourly usage breakdown
  getHourlyUsage(userId: string, hours: number = 24): HourlyUsage[] {
    const now = Date.now();
    const timeRange = hours * 60 * 60 * 1000;
    const startTime = now - timeRange;

    const hourlyData: { [key: string]: HourlyUsage } = {};

    // Initialize hourly slots
    for (let i = 0; i < hours; i++) {
      const time = new Date(now - (i * 60 * 60 * 1000));
      const hourKey = `${time.getHours().toString().padStart(2, '0')}:00`;
      hourlyData[hourKey] = {
        hour: hourKey,
        tokensUsed: 0,
        eurosCost: 0
      };
    }

    // Fill with actual usage data
    this.usage
      .filter(usage => usage.userId === userId && usage.timestamp >= startTime)
      .forEach(usage => {
        const time = new Date(usage.timestamp);
        const hourKey = `${time.getHours().toString().padStart(2, '0')}:00`;
        
        if (hourlyData[hourKey]) {
          hourlyData[hourKey].tokensUsed += usage.tokensUsed;
          hourlyData[hourKey].eurosCost += usage.eurosCost;
        }
      });

    return Object.values(hourlyData).reverse();
  }

  // Estimate costs for different activities
  estimateActivityCost(activity: string): number {
    const activityTokens = {
      'avatar_generation': 500,
      'video_creation': 800,
      'image_upload': 100,
      'video_translation': 600,
      'agent_interaction': 200
    };

    const tokens = activityTokens[activity as keyof typeof activityTokens] || 100;
    return tokens / this.TOKENS_PER_EURO;
  }

  // Check if user has sufficient balance (assuming pro subscription has unlimited)
  canPerformActivity(userId: string, activity: string): boolean {
    // For pro subscription, always return true
    // In a real app, you'd check actual subscription status
    return true;
  }

  // Get usage statistics
  getUsageStats(userId: string) {
    const userUsage = this.usage.filter(usage => usage.userId === userId);
    const totalTokens = userUsage.reduce((sum, usage) => sum + usage.tokensUsed, 0);
    const totalCost = userUsage.reduce((sum, usage) => sum + usage.eurosCost, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsage = userUsage.filter(usage => usage.timestamp >= today.getTime());
    const todayTokens = todayUsage.reduce((sum, usage) => sum + usage.tokensUsed, 0);
    const todayCost = todayUsage.reduce((sum, usage) => sum + usage.eurosCost, 0);

    return {
      totalTokens,
      totalCost,
      todayTokens,
      todayCost,
      averageHourlyCost: this.EUROS_PER_HOUR,
      estimatedMonthlyTokens: totalTokens * 30,
      estimatedMonthlyCost: totalCost * 30
    };
  }
}

export const tokenTracker = new TokenTracker();
export type { TokenUsage, HourlyUsage };