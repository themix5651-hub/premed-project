import { Suspense } from 'react';
import ResultsClient from './ResultsClient';

type ResultsPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  return (
    <Suspense fallback={null}>
      <ResultsClient searchParams={searchParams} />
    </Suspense>
  );
}
