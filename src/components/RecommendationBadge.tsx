import { Badge } from '@/components/ui/badge';
import { Recommendation } from '@/types/dealer';

interface RecommendationBadgeProps {
  recommendation: Recommendation;
}

const RecommendationBadge = ({ recommendation }: RecommendationBadgeProps) => {
  const styles: Record<Recommendation, string> = {
    Green: 'bg-badge-green-bg text-badge-green-text hover:bg-badge-green-bg/80 border-transparent',
    Yellow: 'bg-badge-yellow-bg text-badge-yellow-text hover:bg-badge-yellow-bg/80 border-transparent',
    Red: 'bg-badge-red-bg text-badge-red-text hover:bg-badge-red-bg/80 border-transparent',
  };

  return (
    <Badge className={styles[recommendation]}>
      {recommendation}
    </Badge>
  );
};

export default RecommendationBadge;
