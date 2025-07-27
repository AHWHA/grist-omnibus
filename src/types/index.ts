export interface GristInstance {
  id: string;
  name: string;
  team: string;
  url: string;
  email: string;
  status: 'running' | 'stopped' | 'error' | 'pending';
  createdAt: string;
  lastUpdated: string;
  config: GristConfig;
  metrics?: GristMetrics;
}

export interface GristConfig {
  https: 'auto' | 'external' | 'manual';
  trustedProxyIps?: string;
  hideUIElements?: string[];
  customDexConfig?: boolean;
  environment: Record<string, string>;
}

export interface GristMetrics {
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeUsers: number;
  documentsCount: number;
}

export interface DeploymentLog {
  id: string;
  instanceId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: 'grist' | 'traefik' | 'dex' | 'tfa';
}

export interface CreateInstanceRequest {
  name: string;
  team: string;
  url: string;
  email: string;
  password: string;
  https: 'auto' | 'external' | 'manual';
  trustedProxyIps?: string;
  additionalUsers?: Array<{
    email: string;
    password: string;
  }>;
}