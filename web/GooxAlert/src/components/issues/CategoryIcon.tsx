import React from 'react';
import { IssueCategory } from '../../types';
import { Lightbulb, Trash2, Loader as Road, Droplets, Zap, Building, HelpCircle } from 'lucide-react';

interface CategoryIconProps {
  category: IssueCategory;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "w-6 h-6" }) => {
  switch (category) {
    case 'lighting':
      return <Lightbulb className={className} />;
    case 'waste':
      return <Trash2 className={className} />;
    case 'road':
      return <Road className={className} />;
    case 'water':
      return <Droplets className={className} />;
    case 'electricity':
      return <Zap className={className} />;
    case 'infrastructure':
      return <Building className={className} />;
    case 'other':
    default:
      return <HelpCircle className={className} />;
  }
};

export default CategoryIcon;