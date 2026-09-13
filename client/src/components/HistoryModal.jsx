import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  X,
  Calendar,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Bot,
  RefreshCw,
  ServerCrash,
  Loader2
} from 'lucide-react';
import { fetchResumeHistory, deleteResumeHistoryItem, clearResumeHistory } from '../services/api';

export default function HistoryModal({ onClose, onSelectHistoryItem }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchResumeHistory();
      setHistoryList(records);
    } catch (err) {
      console.error('Failed to load history:', err.message);
      setError('Could not connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteResumeHistoryItem(id);
      setHistoryList(prev => prev.filter(item =>
        (item._id?.toString() || item.analysisId) !== id
      ));
    } catch (err) {
      alert('Failed to delete record. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all analysis history from the database?')) return;
    try {
      await clearResumeHistory();
      setHistoryList([]);
    } catch (err) {
      alert('Failed to clear history. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-[#083d1c]/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#F5F7FA] dark:bg-[#083d1c] border-b border-[#E4E7EB] dark:border-[#1e8247] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4CAF4F] dark:bg-[#FAB818] text-white dark:text-[#083d1c] flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#263238] dark:text-white block">Resume Analysis History</span>
              <span className="text-[11px] text-[#717171] dark:text-[#E8F5E9]">
                Stored in MongoDB &bull; {historyList.length} record{historyList.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={loadHistory}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#115e30] hover:bg-gray-100 dark:hover:bg-[#FAB818] dark:hover:text-[#083d1c] text-[#4CAF4F] dark:text-[#FFC72C] border border-[#E4E7EB] dark:border-[#1e8247] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              title="Refresh history from MongoDB"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Clear All */}
            {historyList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#717171] dark:text-white hover:bg-gray-200 dark:hover:bg-[#115e30] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 bg-white dark:bg-[#0b4d26]">

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 border-0 mx-auto text-[#4CAF4F] dark:text-[#FFC72C] animate-spin" />
              <p className="text-xs font-semibold text-[#717171] dark:text-white">Loading from MongoDB...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="py-16 text-center space-y-4">
              <ServerCrash className="w-12 h-12 mx-auto text-red-400" />
              <p className="text-sm font-bold text-[#263238] dark:text-white">Failed to Load History</p>
              <p className="text-xs text-[#717171] dark:text-[#E8F5E9] max-w-sm mx-auto">{error}</p>
              <button
                onClick={loadHistory}
                className="mt-2 px-5 py-2 rounded-lg bg-[#4CAF4F] dark:bg-[#FAB818] hover:bg-[#388E3C] dark:hover:bg-[#FFC72C] text-white dark:text-[#083d1c] text-xs font-bold shadow-sm transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && historyList.length === 0 && (
            <div className="py-16 text-center space-y-3">
              <History className="w-10 h-10 mx-auto text-[#4CAF4F] dark:text-[#FFC72C]" />
              <p className="text-base font-bold text-[#263238] dark:text-white">No analysis records yet</p>
              <p className="text-xs text-[#717171] dark:text-[#E8F5E9] max-w-sm mx-auto">
                Analyze a resume to save evaluations here. All records are stored in MongoDB.
              </p>
            </div>
          )}

          {/* Records list */}
          {!loading && !error && historyList.length > 0 && (
            <div className="space-y-3">
              {historyList.map((item, idx) => {
                const rawScore = item.atsScore;
                const score = typeof rawScore === 'number'
                  ? rawScore
                  : (rawScore?.percentage ?? 0);
                const scoreTier = typeof rawScore === 'object' && rawScore?.tier ? rawScore.tier : '';

                let scoreColor = 'text-[#2E7D32] dark:text-[#083d1c] bg-[#E8F5E9] dark:bg-[#FAB818] font-bold border border-[#C8E6C9] dark:border-transparent';
                if (score < 50) scoreColor = 'text-red-700 bg-red-50 dark:bg-red-600 dark:text-white font-bold border border-red-200 dark:border-transparent';
                else if (score < 70) scoreColor = 'text-amber-800 bg-amber-50 dark:bg-[#FAB818] dark:text-[#083d1c] font-bold border border-amber-200 dark:border-transparent';

                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : 'Recent';

                const itemId = item._id?.toString() || item.analysisId || `hist-${idx}`;
                const isDeleting = deletingId === itemId;

                return (
                  <div
                    key={itemId}
                    onClick={() => !isDeleting && onSelectHistoryItem(item)}
                    className={`p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] hover:border-[#4CAF4F] dark:hover:border-[#FFC72C] hover:bg-white dark:hover:bg-[#16703b] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#263238] dark:text-white truncate group-hover:text-[#4CAF4F] dark:group-hover:text-[#FFC72C] transition-colors">
                          {item.candidate?.name || 'Candidate Evaluation'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white dark:bg-[#083d1c] text-[#4CAF4F] dark:text-[#FFC72C] border border-[#E4E7EB] dark:border-[#1e8247]">
                          {item.targetJob?.title || 'Software Engineer'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#717171] dark:text-[#E8F5E9]">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#4CAF4F] dark:text-[#FFC72C]" />
                          {dateStr}
                        </span>
                        {Array.isArray(item.skillGap?.matchedSkills) && (
                          <span className="text-[11px] text-[#2E7D32] dark:text-[#FFC72C] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {item.skillGap.matchedSkills.length} matched
                          </span>
                        )}
                        {Array.isArray(item.skillGap?.missingSkills) && item.skillGap.missingSkills.length > 0 && (
                          <span className="text-[11px] text-red-600 dark:text-white font-semibold flex items-center gap-1 bg-red-50 dark:bg-red-600 px-1.5 rounded">
                            <XCircle className="w-3 h-3" />
                            {item.skillGap.missingSkills.length} gaps
                          </span>
                        )}
                        {item.geminiInsights?.recruiterHiringVerdict && (
                          <span className="text-[11px] text-[#4CAF4F] dark:text-[#FFC72C] font-mono flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            {item.geminiInsights.recruiterHiringVerdict}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Score & Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className={`px-3 py-1.5 rounded-lg text-center ${scoreColor}`}>
                        <span className="text-base font-bold font-mono block leading-none">{score}%</span>
                        <span className="text-[9px] uppercase font-semibold tracking-wider block mt-0.5">{scoreTier || 'ATS'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelectHistoryItem(item); onClose(); }}
                        className="px-3.5 py-2 rounded-lg bg-[#4CAF4F] hover:bg-[#388E3C] dark:bg-[#FAB818] dark:hover:bg-[#FFC72C] text-white dark:text-[#083d1c] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                        title="Load this analysis onto the dashboard"
                      >
                        <span>Load</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, itemId)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg text-[#89939E] dark:text-white hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        title="Delete from MongoDB"
                      >
                        {isDeleting
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Bottom Bar */}
        <div className="p-4 bg-[#F5F7FA] dark:bg-[#083d1c] border-t border-[#E4E7EB] dark:border-[#1e8247] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#89939E] dark:text-[#C8E6C9] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4CAF4F] dark:bg-[#FFC72C] inline-block" />
            Powered by MongoDB
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#115e30] hover:bg-gray-100 dark:hover:bg-[#16703b] text-[#263238] dark:text-white text-xs font-semibold transition-colors border border-[#E4E7EB] dark:border-[#1e8247]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
