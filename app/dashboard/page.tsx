import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

type DashboardPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <Suspense fallback={null}>
      <DashboardClient searchParams={searchParams} />
    </Suspense>
  );
}
