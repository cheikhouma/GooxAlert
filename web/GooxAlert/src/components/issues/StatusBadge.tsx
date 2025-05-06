import React from 'react';
import { IssueStatus } from '../../types';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusInfo = (status: IssueStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          className: 'badge-pending'
        };
      case 'in_progress':
        return {
          label: 'En cours',
          className: 'badge-inprogress'
        };
      case 'resolved':
        return {
          label: 'Résolu',
          className: 'badge-resolved'
        };
      case 'rejected':
        return {
          label: 'Rejeté',
          className: 'badge-rejected'
        };
      default:
        return {
          label: 'En attente',
          className: 'badge-pending'
        };
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const { label, className } = getStatusInfo(status);

  return (
    <span className={`badge ${className} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;