'use client'; {/*client-side component*/}

{/*Fahim Uddin*/}

{/*defined interface of the rating object type*/}
interface Rating {
  average: number;
  bayesian: number;
}

{/*component displays the rating and follow statistics for a manga*/}
export default function MangaStatistics({ rating, follows }: { rating: Rating; follows: number }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
      {/*I defined the interface of the rating object type */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Statistics</h2>
      <ul className="space-y-2">
        <li className="text-center">
          {/*list of statistics* such */}
          <span className="font-bold">Mean Rating:</span> {rating.average}  {/*average rating*/}
        </li>
        <li className="text-center">
          <span className="font-bold">Bayesian Rating:</span> {rating.bayesian} {/*bayesian rating*/}
        </li>
        <li className="text-center">
          <span className="font-bold">Follows:</span> {follows} {/*number of follows*/}
        </li>
      </ul>
    </div>
  );
}
