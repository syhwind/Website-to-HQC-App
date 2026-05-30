import { Link } from 'react-router-dom';
import { App } from '../../types';
import { CategoryTag } from '../common/CategoryTag';

interface AppCardProps {
  app: App;
}

export const AppCard = ({ app }: AppCardProps) => {
  return (
    <Link
      to={`/app/${app.id}`}
      className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start space-x-4 mb-4">
        <img
          src={app.icon}
          alt={app.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
            {app.name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {app.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <CategoryTag category={app.category} />
        <div className="flex items-center text-slate-400 text-sm">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{app.viewCount.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};
