import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tokenTracker } from "@/lib/token-tracking";
import { Clock, TrendingUp, Zap } from "lucide-react";

interface TokenUsageWidgetProps {
  userId?: string;
  className?: string;
}

export default function TokenUsageWidget({ userId = "current-user", className }: TokenUsageWidgetProps) {
  const [stats, setStats] = useState({
    totalTokens: 0,
    totalCost: 0,
    todayTokens: 0,
    todayCost: 0,
    averageHourlyCost: 20,
    estimatedMonthlyTokens: 0,
    estimatedMonthlyCost: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const newStats = tokenTracker.getUsageStats(userId);
      setStats(newStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [userId]);

  const progressPercentage = Math.min((stats.todayCost / stats.averageHourlyCost) * 100, 100);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Token Usage
        </CardTitle>
        <CardDescription>Your current usage and costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today's Usage</span>
            <Badge variant="outline" className="text-xs">
              Pro Plan
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.todayTokens.toLocaleString()} tokens</span>
            <span>€{stats.todayCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Tokens</span>
            </div>
            <p className="text-lg font-semibold">{stats.totalTokens.toLocaleString()}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Cost</span>
            </div>
            <p className="text-lg font-semibold">€{stats.totalCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Estimated Monthly */}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Est. Monthly</span>
            <span className="font-medium">€{stats.estimatedMonthlyCost.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}