
export interface Activity {
  id?: string;
  type: string;
  details: string;
  timestamp: string;
  projectId?: string;
  userId?: string;
}

// Add a new activity
export const addActivity = (activity: Omit<Activity, 'id'>) => {
  const activities = getActivities();
  
  const newActivity = {
    ...activity,
    id: Date.now().toString()
  };
  
  // Add to the beginning of the array for reverse chronological order
  activities.unshift(newActivity);
  
  // Cap at 50 activities to prevent localStorage from getting too large
  if (activities.length > 50) {
    activities.pop();
  }
  
  localStorage.setItem('fluxActivities', JSON.stringify(activities));
  
  return newActivity;
};

// Get all activities
export const getActivities = (): Activity[] => {
  const activitiesJson = localStorage.getItem('fluxActivities');
  return activitiesJson ? JSON.parse(activitiesJson) : [];
};

// Get activities for a specific project
export const getProjectActivities = (projectId: string): Activity[] => {
  const activities = getActivities();
  return activities.filter(activity => activity.projectId === projectId);
};

// Clear all activities
export const clearActivities = () => {
  localStorage.setItem('fluxActivities', JSON.stringify([]));
};
