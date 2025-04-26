'use client';

interface Rating {
  average: number;
  bayesian: number;
}

export default function MangaStatistics({ rating, follows }: { rating: Rating; follows: number }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-2">Statistics</h2>
      <ul>
        <li>
          <span className="font-bold">Mean Rating:</span> {rating.average}
        </li>
        <li>
          <span className="font-bold">Bayesian Rating:</span> {rating.bayesian}
        </li>
        <li>
          <span className="font-bold">Follows:</span> {follows}
        </li>
      </ul>
    </div>
  );
}
