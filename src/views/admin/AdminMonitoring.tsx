'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  HardDrive,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Database,
  Zap,
} from 'lucide-react';
import { useGetMonitoringMetricsQuery, useGetMonitoringErrorsQuery } from '@/store/api/appApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminMonitoring() {
  const { data: metrics, isLoading, refetch } = useGetMonitoringMetricsQuery(undefined, {
    pollingInterval: 5000, // Refresh every 5 seconds
  });
  
  const { data: errorData } = useGetMonitoringErrorsQuery({ limit: 20 }, {
    pollingInterval: 10000,
  });

  useEffect(() => {
    const interval = setInterval(() => refetch(), 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  // Chart data
  const chartData = {
    labels: metrics?.history?.timestamps?.map((t: string) => new Date(t).toLocaleTimeString()) || [],
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: metrics?.history?.cpu || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Memory Usage (%)',
        data: metrics?.history?.memory || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            System Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time server metrics and performance monitoring
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="CPU Usage"
            value={`${metrics?.cpu?.usage || 0}%`}
            icon={<Cpu className="w-6 h-6" />}
            color="blue"
            status={metrics?.cpu?.usage < 70 ? 'good' : metrics?.cpu?.usage < 90 ? 'warning' : 'critical'}
          />
          <StatusCard
            title="Memory Usage"
            value={`${metrics?.memory?.process?.heapUsagePercent || 0}%`}
            icon={<HardDrive className="w-6 h-6" />}
            color="green"
            status={metrics?.memory?.process?.heapUsagePercent < 70 ? 'good' : metrics?.memory?.process?.heapUsagePercent < 90 ? 'warning' : 'critical'}
          />
          <StatusCard
            title="Requests"
            value={metrics?.requests?.total || 0}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            subtitle={`${metrics?.requests?.errors || 0} errors`}
          />
          <StatusCard
            title="Uptime"
            value={formatUptime(metrics?.system?.uptime || 0)}
            icon={<Clock className="w-6 h-6" />}
            color="indigo"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Resource Usage (Last 5 Minutes)
            </h2>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              System Information
            </h2>
            <div className="space-y-4">
              <InfoRow label="Platform" value={`${metrics?.system?.platform} (${metrics?.system?.arch})`} />
              <InfoRow label="Node Version" value={metrics?.system?.nodeVersion} />
              <InfoRow label="CPU Cores" value={metrics?.cpu?.count} />
              <InfoRow label="Total Memory" value={formatBytes(metrics?.memory?.total)} />
              <InfoRow label="Free Memory" value={formatBytes(metrics?.memory?.free)} />
              <InfoRow label="Process Memory" value={formatBytes(metrics?.memory?.process?.rss)} />
            </div>
          </motion.div>
        </div>

        {/* Services Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Server className="w-6 h-6" />
            Services Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceStatus
              name="MongoDB"
              status={metrics?.services?.mongodb?.connected ? 'connected' : 'disconnected'}
              icon={<Database className="w-5 h-5" />}
            />
            <ServiceStatus
              name="Redis"
              status={metrics?.services?.redis?.status}
              icon={<Zap className="w-5 h-5" />}
              extra={metrics?.services?.redis?.memory}
            />
          </div>
        </motion.div>

        {/* Recent Errors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Recent Errors ({errorData?.total || 0})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {errorData?.errors?.length > 0 ? (
              errorData.errors.map((error: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-red-900 dark:text-red-200">{error.message}</p>
                    <span className="text-xs text-red-600 dark:text-red-400">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {error.context && (
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error.context.method} {error.context.path} - Status: {error.context.status}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No errors recorded</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, icon, color, status, subtitle }: { title: any; value: any; icon: any; color: any; status?: any; subtitle?: any }): JSX.Element {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  };

  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors[color as keyof typeof colors]} text-white p-3 rounded-lg`}>{icon}</div>
        {status && (
          <div className={statusColors[status as keyof typeof statusColors]}>
            {status === 'good' && <CheckCircle className="w-5 h-5" />}
            {status === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {status === 'critical' && <XCircle className="w-5 h-5" />}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: any; value: any }): JSX.Element {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function ServiceStatus({ name, status, icon, extra }: { name: any; status: any; icon: any; extra?: any }): JSX.Element {
  const isConnected = status === 'connected';
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`${isConnected ? 'text-green-600' : 'text-red-600'}`}>{icon}</div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{name}</p>
          {extra && <p className="text-sm text-gray-500 dark:text-gray-400">{extra}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
