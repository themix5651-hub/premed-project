import { redirect } from 'next/navigation';
import CategoryDetailClient from './CategoryDetailClient';

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  if (params.category === 'academics') {
    redirect('/dashboard/gpa');
  }

  return <CategoryDetailClient categorySlug={params.category} />;
}
