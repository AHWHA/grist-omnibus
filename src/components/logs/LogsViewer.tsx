import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { DeploymentLog } from '../../types';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface LogsViewerProps {
  logs: DeploymentLog[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export function LogsViewer({ logs, onRefresh, isLoading }: LogsViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [filteredLogs, setFilteredLogs] = useState<DeploymentLog[]>(logs);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(log => log.source === selectedSource);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedLevel, selectedSource]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-error-600 bg-error-50';
      case 'warn':
        return 'text-warning-600 bg-warning-50';
      case 'info':
        return 'text-primary-600 bg-primary-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'grist':
        return 'text-blue-600 bg-blue-50';
      case 'traefik':
        return 'text-green-600 bg-green-50';
      case 'dex':
        return 'text-purple-600 bg-purple-50';
      case 'tfa':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Deployment Logs</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="btn-secondary"
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
              Refresh
            </button>
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Sources</option>
            <option value="grist">Grist</option>
            <option value="traefik">Traefik</option>
            <option value="dex">Dex</option>
            <option value="tfa">TFA</option>
          </select>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No logs found matching your criteria</p>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-3 text-sm font-mono"
                >
                  <span className="text-gray-400 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium uppercase whitespace-nowrap',
                    getLevelColor(log.level)
                  )}>
                    {log.level}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium uppercase whitespace-nowrap',
                    getSourceColor(log.source)
                  )}>
                    {log.source}
                  </span>
                  <span className="text-gray-300 flex-1">{log.message}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}