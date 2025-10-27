import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Zap, TrendingUp, Users, Activity, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AIInsights() {
  const [loading, setLoading] = useState(false);

  // Health check
  const { data: health, refetch: refetchHealth } = trpc.ai.health.check.useQuery();
  const { data: metrics } = trpc.ai.health.metrics.useQuery();

  // Manus AI queries
  const { data: trends } = trpc.ai.manusAI.analyzeMarketTrends.useQuery();
  const { data: inventory } = trpc.ai.manusAI.optimizeInventory.useQuery();
  const { data: churn } = trpc.ai.manusAI.predictChurn.useQuery();

  // Automation mutations
  const runDailyTasks = trpc.ai.automation.runDailyTasks.useMutation();
  const syncData = trpc.ai.automation.syncData.useMutation();

  const handleRunDailyTasks = async () => {
    setLoading(true);
    try {
      await runDailyTasks.mutateAsync();
      await refetchHealth();
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setLoading(true);
    try {
      await syncData.mutateAsync();
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status?: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "unhealthy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health
          </CardTitle>
          <CardDescription>Real-time system status and performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Overall Status</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold capitalize">
                  {health?.status || "Unknown"}
                </span>
                <Badge className={getHealthColor(health?.status)}>
                  {health?.status || "Unknown"}
                </Badge>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Last Check</p>
              <p className="text-lg font-medium">
                {health?.timestamp
                  ? new Date(health.timestamp).toLocaleTimeString()
                  : "Never"}
              </p>
            </div>
          </div>

          {/* Component Status */}
          {health?.components && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(health.components).map(([name, status]) => (
                <div key={name} className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{name}</p>
                  <Badge className={getHealthColor(status as string)}>
                    {status as string}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleRunDailyTasks} disabled={loading} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Daily Tasks
          </Button>
        </CardContent>
      </Card>

      {/* Market Trends */}
      {trends && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Market Trends & Opportunities
            </CardTitle>
            <CardDescription>AI-powered market analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trends */}
              <div>
                <h4 className="font-semibold mb-3">📈 Trends</h4>
                <ul className="space-y-2">
                  {trends.trends?.map((trend: string, idx: number) => (
                    <li key={idx} className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div>
                <h4 className="font-semibold mb-3">💡 Opportunities</h4>
                <ul className="space-y-2">
                  {trends.opportunities?.map((opp: string, idx: number) => (
                    <li key={idx} className="text-sm p-2 bg-green-50 rounded border border-green-200">
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div>
                <h4 className="font-semibold mb-3">⚠️ Threats</h4>
                <ul className="space-y-2">
                  {trends.threats?.map((threat: string, idx: number) => (
                    <li key={idx} className="text-sm p-2 bg-red-50 rounded border border-red-200">
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Optimization */}
      {inventory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Inventory Optimization
            </CardTitle>
            <CardDescription>AI-recommended inventory adjustments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {inventory.recommendations?.map((rec: string, idx: number) => (
                  <li key={idx} className="text-sm p-2 bg-amber-50 rounded border border-amber-200">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Suggested Adjustments</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(inventory.adjustments || {}).map(([item, adjustment]) => (
                  <div key={item} className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{item}</p>
                    <p className={`text-lg font-bold ${
                      (adjustment as number) > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {(adjustment as number) > 0 ? "+" : ""}{adjustment}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Churn Analysis */}
      {churn && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Customer Retention
            </CardTitle>
            <CardDescription>AI-identified at-risk customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">At-Risk Customers</h4>
              <div className="space-y-2">
                {churn.atRiskCustomers?.length > 0 ? (
                  churn.atRiskCustomers.map((customerId: string) => (
                    <div key={customerId} className="p-3 bg-red-50 rounded border border-red-200">
                      <p className="text-sm font-medium">{customerId}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No at-risk customers detected</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Retention Strategies</h4>
              <ul className="space-y-2">
                {churn.retentionStrategies?.map((strategy: string, idx: number) => (
                  <li key={idx} className="text-sm p-2 bg-green-50 rounded border border-green-200">
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Automation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Controls</CardTitle>
          <CardDescription>Manage system automation and synchronization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleSyncData}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Data with External Systems
          </Button>
          <p className="text-xs text-muted-foreground">
            Last sync: {metrics?.lastHealthCheck ? new Date(metrics.lastHealthCheck).toLocaleString() : "Never"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

