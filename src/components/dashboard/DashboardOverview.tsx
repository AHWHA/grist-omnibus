import { motion } from 'framer-motion';
import { Server, Users, FileText, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { GristInstance } from '../../types';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';
import { formatUptime } from '../../lib/utils';

interface DashboardOverviewProps {
  instances: GristInstance[];
}

export function DashboardOverview({ instances }: DashboardOverviewProps) {
  const runningInstances = instances.filter(i => i.status === 'running').length;
  const totalUsers = instances.reduce((sum, i) => sum + (i.metrics?.activeUsers || 0), 0);
  const totalDocuments = instances.reduce((sum, i) => sum + (i.metrics?.documentsCount || 0), 0);
  const avgUptime = instances
    .filter(i => i.metrics?.uptime)
    .reduce((sum, i) => sum + (i.metrics?.uptime || 0), 0) / instances.length;

  const recentInstances = instances
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Running Instances"
          value={runningInstances}
          icon={<Server className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Users"
          value={totalUsers}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Total Documents"
          value={totalDocuments}
          icon={<FileText className="w-6 h-6" />}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="Avg Uptime"
          value={formatUptime(avgUptime)}
          icon={<Activity className="w-6 h-6" />}
          trend={{ value: 2, isPositive: true }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          
          <div className="space-y-4">
            {recentInstances.map((instance) => (
              <div key={instance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{instance.name}</p>
                  <p className="text-sm text-gray-600">{instance.team}</p>
                </div>
                <StatusBadge status={instance.status} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <AlertTriangle className="w-5 h-5 text-warning-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall System Status</span>
              <StatusBadge status="running" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Certificate Status</span>
              <StatusBadge status="running" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Health</span>
              <StatusBadge status="running" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Status</span>
              <StatusBadge status="running" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}