import { analyzeResumeClient } from './clientNlpEngine';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const LOCAL_STORAGE_HISTORY_KEY = 'ats_resume_history';

export async function analyzeResumeApi(resumeText, targetJobTitle, targetJobDescription, jobRequiredSkills, preferences) {
  return analyzeResume({
    resumeText,
    targetJobTitle,
    targetJobDescription,
    jobRequiredSkills,
    preferences
  });
}

export async function analyzeResumeFileApi(file, targetJobTitle, targetJobDescription, jobRequiredSkills, preferences, resumeText = '') {
  const formData = new FormData();
  if (file) formData.append('resumeFile', file);
  if (resumeText) formData.append('resumeText', resumeText);
  if (targetJobTitle) formData.append('targetJobTitle', targetJobTitle);
  if (targetJobDescription) formData.append('targetJobDescription', targetJobDescription);
  if (jobRequiredSkills) formData.append('jobRequiredSkills', JSON.stringify(jobRequiredSkills));
  if (preferences) formData.append('preferences', JSON.stringify(preferences));
  return analyzeResume(formData);
}

export async function analyzeResume(formDataOrJson) {
  try {
    let response;
    
    if (formDataOrJson instanceof FormData) {
      response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
        method: 'POST',
        body: formDataOrJson
      });
    } else {
      response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataOrJson)
      });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    saveToLocalHistory(data);
    return { ...data, source: 'backend-api' };
  } catch (error) {
    console.warn('Backend API request failed or timed out. Using high-precision Client NLP Engine fallback:', error.message);
    
    // Extract parameters for client fallback
    let text = '';
    let targetTitle = 'Full Stack Software Engineer';
    let targetDesc = '';
    let jobRequiredSkills = [];
    let preferences = {};

    if (formDataOrJson instanceof FormData) {
      text = formDataOrJson.get('resumeText') || '';
      targetTitle = formDataOrJson.get('targetJobTitle') || targetTitle;
      targetDesc = formDataOrJson.get('targetJobDescription') || '';
      try {
        jobRequiredSkills = JSON.parse(formDataOrJson.get('jobRequiredSkills') || '[]');
      } catch (e) {
        jobRequiredSkills = [];
      }
      try {
        preferences = JSON.parse(formDataOrJson.get('preferences') || '{}');
      } catch (e) {
        preferences = {};
      }
    } else {
      text = formDataOrJson.resumeText || '';
      targetTitle = formDataOrJson.targetJobTitle || targetTitle;
      targetDesc = formDataOrJson.targetJobDescription || '';
      jobRequiredSkills = formDataOrJson.jobRequiredSkills || [];
      preferences = formDataOrJson.preferences || {};
    }

    const clientResult = analyzeResumeClient(text, targetTitle, targetDesc, jobRequiredSkills, preferences);
    const resultPayload = {
      success: true,
      analysisId: 'res_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...clientResult,
      resumeText: text,
      timestamp: new Date().toISOString(),
      source: 'client-nlp-fallback'
    };
    saveToLocalHistory(resultPayload);
    return resultPayload;
  }
}

function saveToLocalHistory(record) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || '[]');
    const filtered = existing.filter(item => (item.analysisId || item._id) !== (record.analysisId || record._id));
    filtered.unshift(record);
    if (filtered.length > 30) filtered.pop();
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Could not save to localStorage history:', e);
  }
}

export function getLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export async function fetchResumeHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/resume/history`);
    if (res.ok) {
      const data = await res.json();
      if (data.history && data.history.length > 0) {
        // Sync local storage
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(data.history));
        return data.history;
      }
    }
  } catch (e) {
    console.warn('Could not fetch remote history, using local history cache:', e.message);
  }
  return getLocalHistory();
}

export async function deleteResumeHistoryItem(id) {
  try {
    await fetch(`${API_BASE_URL}/api/resume/history/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {}
  
  try {
    const existing = getLocalHistory();
    const updated = existing.filter(item => (item._id && item._id.toString() !== id) && item.analysisId !== id);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export async function clearResumeHistory() {
  try {
    await fetch(`${API_BASE_URL}/api/resume/history`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {}
  
  try {
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  } catch (e) {}
  return [];
}

export const getResumeHistoryApi = fetchResumeHistory;
export const deleteResumeHistoryApi = deleteResumeHistoryItem;
export const clearAllResumeHistoryApi = clearResumeHistory;

export async function fetchJobRoles() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/resume/roles`);
    if (res.ok) {
      const data = await res.json();
      return data.roles;
    }
  } catch (e) {
    // fallback
  }
  return null;
}
