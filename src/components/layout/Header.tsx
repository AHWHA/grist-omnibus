import { Server, Plus, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onCreateInstance: () => void;
}

export function Header({ onCreateInstance }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Grist Manager</h1>
            <p className="text-sm text-gray-500">Manage your Grist omnibus deployments</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={onCreateInstance}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Instance
          </button>
        </div>
      </div>
    </motion.header>
  );
}