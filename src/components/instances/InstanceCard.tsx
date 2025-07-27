import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  Trash2, 
  ExternalLink, 
  MoreVertical,
  Users,
  FileText,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react';
import { GristInstance } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatRelativeTime, formatBytes, formatUptime } from '../../lib/utils';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface InstanceCardProps {
  instance: GristInstance;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onViewLogs: (id: string) => void;
}

export function InstanceCard({ 
  instance, 
  onStart, 
  onStop, 
  onDelete, 
  onViewLogs 
}: InstanceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{instance.name}</h3>
            <StatusBadge status={instance.status} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Team: {instance.team}</p>
          <div className="flex items-center space-x-2">
            <a
              href={instance.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              {instance.url}
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
        
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onViewLogs(instance.id)}
                      className={`${
                        active ? 'bg-gray-50' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      View Logs
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleAction(() => onDelete(instance.id))}
                      className={`${
                        active ? 'bg-gray-50' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-error-600`}
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {instance.metrics && (
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {instance.metrics.activeUsers} users
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {instance.metrics.documentsCount} docs
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {instance.metrics.cpuUsage}% CPU
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {formatBytes(instance.metrics.memoryUsage * 1024 * 1024)}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Updated {formatRelativeTime(instance.lastUpdated)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {instance.status === 'running' ? (
            <button
              onClick={() => handleAction(() => onStop(instance.id))}
              disabled={isLoading}
              className="btn-secondary"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </button>
          ) : (
            <button
              onClick={() => handleAction(() => onStart(instance.id))}
              disabled={isLoading}
              className="btn-primary"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}