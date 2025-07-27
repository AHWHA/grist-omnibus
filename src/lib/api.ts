import axios from 'axios';
import { GristInstance, CreateInstanceRequest, DeploymentLog } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Mock data for development
const mockInstances: GristInstance[] = [
  {
    id: '1',
    name: 'Production Grist',
    team: 'acme-corp',
    url: 'https://grist.acme-corp.com',
    email: 'admin@acme-corp.com',
    status: 'running',
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-20T14:22:00Z',
    config: {
      https: 'auto',
      trustedProxyIps: '192.168.1.0/24',
      hideUIElements: ['billing', 'templates'],
      environment: {
        GRIST_SANDBOX_FLAVOR: 'gvisor',
        GRIST_HIDE_UI_ELEMENTS: 'billing,templates',
      },
    },
    metrics: {
      uptime: 432000,
      memoryUsage: 512,
      cpuUsage: 15,
      activeUsers: 12,
      documentsCount: 45,
    },
  },
  {
    id: '2',
    name: 'Development Grist',
    team: 'dev-team',
    url: 'http://localhost:9999',
    email: 'dev@acme-corp.com',
    status: 'running',
    createdAt: '2024-01-18T09:15:00Z',
    lastUpdated: '2024-01-20T16:45:00Z',
    config: {
      https: 'external',
      hideUIElements: ['billing'],
      environment: {
        GRIST_SANDBOX_FLAVOR: 'unsandboxed',
      },
    },
    metrics: {
      uptime: 86400,
      memoryUsage: 256,
      cpuUsage: 8,
      activeUsers: 3,
      documentsCount: 12,
    },
  },
  {
    id: '3',
    name: 'Staging Environment',
    team: 'staging',
    url: 'https://staging.grist.acme-corp.com',
    email: 'staging@acme-corp.com',
    status: 'stopped',
    createdAt: '2024-01-10T14:20:00Z',
    lastUpdated: '2024-01-19T11:30:00Z',
    config: {
      https: 'auto',
      environment: {
        GRIST_SANDBOX_FLAVOR: 'gvisor',
      },
    },
  },
];

const mockLogs: DeploymentLog[] = [
  {
    id: '1',
    instanceId: '1',
    timestamp: '2024-01-20T16:45:00Z',
    level: 'info',
    message: 'Grist instance started successfully',
    source: 'grist',
  },
  {
    id: '2',
    instanceId: '1',
    timestamp: '2024-01-20T16:44:30Z',
    level: 'info',
    message: 'Traefik configuration updated',
    source: 'traefik',
  },
  {
    id: '3',
    instanceId: '2',
    timestamp: '2024-01-20T16:30:00Z',
    level: 'warn',
    message: 'High memory usage detected',
    source: 'grist',
  },
];

export const gristApi = {
  // Get all instances
  getInstances: async (): Promise<GristInstance[]> => {
    // In a real app, this would be: return api.get('/instances').then(res => res.data);
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockInstances), 500);
    });
  },

  // Get single instance
  getInstance: async (id: string): Promise<GristInstance> => {
    const instance = mockInstances.find(i => i.id === id);
    if (!instance) throw new Error('Instance not found');
    return new Promise((resolve) => {
      setTimeout(() => resolve(instance), 300);
    });
  },

  // Create new instance
  createInstance: async (data: CreateInstanceRequest): Promise<GristInstance> => {
    const newInstance: GristInstance = {
      id: Date.now().toString(),
      name: data.name,
      team: data.team,
      url: data.url,
      email: data.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      config: {
        https: data.https,
        trustedProxyIps: data.trustedProxyIps,
        environment: {},
      },
    };
    
    return new Promise((resolve) => {
      setTimeout(() => {
        mockInstances.push(newInstance);
        resolve(newInstance);
      }, 1000);
    });
  },

  // Start instance
  startInstance: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const instance = mockInstances.find(i => i.id === id);
        if (instance) {
          instance.status = 'running';
          instance.lastUpdated = new Date().toISOString();
        }
        resolve();
      }, 2000);
    });
  },

  // Stop instance
  stopInstance: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const instance = mockInstances.find(i => i.id === id);
        if (instance) {
          instance.status = 'stopped';
          instance.lastUpdated = new Date().toISOString();
        }
        resolve();
      }, 1500);
    });
  },

  // Delete instance
  deleteInstance: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockInstances.findIndex(i => i.id === id);
        if (index > -1) {
          mockInstances.splice(index, 1);
        }
        resolve();
      }, 1000);
    });
  },

  // Get logs
  getLogs: async (instanceId?: string): Promise<DeploymentLog[]> => {
    const logs = instanceId 
      ? mockLogs.filter(log => log.instanceId === instanceId)
      : mockLogs;
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(logs), 300);
    });
  },
};