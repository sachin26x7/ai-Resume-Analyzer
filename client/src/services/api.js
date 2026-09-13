/**
 * API Service — all history operations go directly to MongoDB via the backend.
 * No localStorage is used for history storage.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');


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
  let response;

  if (formDataOrJson instanceof FormData) {
    response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
      method: 'POST',
      body: formDataOrJson
    });
  } else {
    response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formDataOrJson)
    });
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const error = new Error(errData.error || errData.message || `Server responded with status ${response.status}`);
    error.isApiError = true;
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return { ...data, source: 'backend-api' };
}

/**
 * Fetch full analysis history from MongoDB via the backend API.
 */
export async function fetchResumeHistory() {
  const res = await fetch(`${API_BASE_URL}/api/resume/history`);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.history) ? data.history : [];
}

/**
 * Delete a single history record by its _id or analysisId.
 */
export async function deleteResumeHistoryItem(id) {
  const res = await fetch(`${API_BASE_URL}/api/resume/history/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

/**
 * Clear all history records from MongoDB.
 */
export async function clearResumeHistory() {
  const res = await fetch(`${API_BASE_URL}/api/resume/history`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Clear failed: ${res.status}`);
  return res.json();
}

