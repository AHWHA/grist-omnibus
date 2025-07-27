import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { InstanceCard } from './components/instances/InstanceCard';
import { CreateInstanceModal } from './components/instances/CreateInstanceModal';
import { LogsViewer } from './components/logs/LogsViewer';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { gristApi } from './lib/api';
import { CreateInstanceRequest } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  
  const queryClientInstance = useQueryClient();

  // Queries
  const { data: instances = [], isLoading: instancesLoading } = useQuery({
    queryKey: ['instances'],
    queryFn: gristApi.getInstances,
  });

  const { data: logs = [], isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['logs', selectedInstanceId],
    queryFn: () => gristApi.getLogs(selectedInstanceId || undefined),
    enabled: activeTab === 'logs',
  });

  // Mutations
  const createInstanceMutation = useMutation({
    mutationFn: gristApi.createInstance,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['instances'] });
    },
  });

  const startInstanceMutation = useMutation({
    mutationFn: gristApi.startInstance,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['instances'] });
    },
  });

  const stopInstanceMutation = useMutation({
    mutationFn: gristApi.stopInstance,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['instances'] });
    },
  });

  const deleteInstanceMutation = useMutation({
    mutationFn: gristApi.deleteInstance,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['instances'] });
    },
  });

  // Handlers
  const handleCreateInstance = async (data: CreateInstanceRequest) => {
    await createInstanceMutation.mutateAsync(data);
  };

  const handleStartInstance = async (id: string) => {
    await startInstanceMutation.mutateAsync(id);
  };

  const handleStopInstance = async (id: string) => {
    await stopInstanceMutation.mutateAsync(id);
  };

  const handleDeleteInstance = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this instance?')) {
      await deleteInstanceMutation.mutateAsync(id);
    }
  };

  const handleViewLogs = (id: string) => {
    setSelectedInstanceId(id);
    setActiveTab('logs');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return instancesLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <DashboardOverview instances={instances} />
        );

      case 'instances':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Grist Instances</h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Create Instance
              </button>
            </div>
            
            {instancesLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {instances.map((instance) => (
                    <InstanceCard
                      key={instance.id}
                      instance={instance}
                      onStart={handleStartInstance}
                      onStop={handleStopInstance}
                      onDelete={handleDeleteInstance}
                      onViewLogs={handleViewLogs}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        );

      case 'logs':
        return (
          <LogsViewer
            logs={logs}
            onRefresh={() => refetchLogs()}
            isLoading={logsLoading}
          />
        );

      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">Advanced analytics and reporting features coming soon.</p>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Global configuration and preferences coming soon.</p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header onCreateInstance={() => setIsCreateModalOpen(true)} />
        
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>

      <CreateInstanceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInstance}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;