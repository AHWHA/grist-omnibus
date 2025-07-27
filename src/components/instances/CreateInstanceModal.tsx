import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateInstanceRequest } from '../../types';

const createInstanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  team: z.string().min(1, 'Team is required').regex(/^[a-z0-9-]+$/, 'Team must contain only lowercase letters, numbers, and hyphens'),
  url: z.string().url('Must be a valid URL'),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  https: z.enum(['auto', 'external', 'manual']),
  trustedProxyIps: z.string().optional(),
});

type FormData = z.infer<typeof createInstanceSchema>;

interface CreateInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInstanceRequest) => Promise<void>;
}

export function CreateInstanceModal({ isOpen, onClose, onSubmit }: CreateInstanceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalUsers, setAdditionalUsers] = useState<Array<{ email: string; password: string }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      https: 'auto',
    },
  });

  const httpsValue = watch('https');

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        additionalUsers: additionalUsers.filter(user => user.email && user.password),
      });
      reset();
      setAdditionalUsers([]);
      onClose();
    } catch (error) {
      console.error('Failed to create instance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUser = () => {
    setAdditionalUsers([...additionalUsers, { email: '', password: '' }]);
  };

  const removeUser = (index: number) => {
    setAdditionalUsers(additionalUsers.filter((_, i) => i !== index));
  };

  const updateUser = (index: number, field: 'email' | 'password', value: string) => {
    const updated = [...additionalUsers];
    updated[index][field] = value;
    setAdditionalUsers(updated);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Create New Grist Instance</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Instance Name</label>
                    <input
                      {...register('name')}
                      className="input"
                      placeholder="Production Grist"
                    />
                    {errors.name && (
                      <p className="text-sm text-error-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Team Identifier</label>
                    <input
                      {...register('team')}
                      className="input"
                      placeholder="acme-corp"
                    />
                    {errors.team && (
                      <p className="text-sm text-error-600 mt-1">{errors.team.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">URL</label>
                  <input
                    {...register('url')}
                    className="input"
                    placeholder="https://grist.example.com"
                  />
                  {errors.url && (
                    <p className="text-sm text-error-600 mt-1">{errors.url.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Admin Email</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input"
                      placeholder="admin@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-error-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Admin Password</label>
                    <input
                      {...register('password')}
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-sm text-error-600 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">HTTPS Configuration</label>
                  <select {...register('https')} className="input">
                    <option value="auto">Auto (Let's Encrypt)</option>
                    <option value="external">External (Reverse Proxy)</option>
                    <option value="manual">Manual (Custom Certificate)</option>
                  </select>
                </div>

                {httpsValue === 'external' && (
                  <div>
                    <label className="label">Trusted Proxy IPs</label>
                    <input
                      {...register('trustedProxyIps')}
                      className="input"
                      placeholder="192.168.1.0/24,127.0.0.1/32"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Comma-separated list of trusted proxy IP ranges
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Additional Users</label>
                    <button
                      type="button"
                      onClick={addUser}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add User
                    </button>
                  </div>
                  
                  {additionalUsers.map((user, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={user.email}
                        onChange={(e) => updateUser(index, 'email', e.target.value)}
                        className="input flex-1"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => updateUser(index, 'password', e.target.value)}
                        className="input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeUser(index)}
                        className="p-2 text-error-600 hover:text-error-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Instance'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}