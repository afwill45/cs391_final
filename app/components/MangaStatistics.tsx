'use client';

interface Rating {
  average: number;
  bayesian: number;
}

export default function MangaStatistics({ rating, follows }: { rating: Rating; follows: number }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Statistics</h2>
      <ul className="space-y-2">
        <li className="text-center">
          <span className="font-bold">Mean Rating:</span> {rating.average}
        </li>
        <li className="text-center">
          <span className="font-bold">Bayesian Rating:</span> {rating.bayesian}
        </li>
        <li className="text-center">
          <span className="font-bold">Follows:</span> {follows}
        </li>
      </ul>
    </div>
  );
}
