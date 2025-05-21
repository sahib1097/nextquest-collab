import { API } from "../config";

export interface Activity {
  _id: string;
  type: string;
  details: string;
  timestamp: string;
  projectId?: string;
  userId?: string;
}

// Add a new activity
export const addActivity = (activity: Omit<Activity, 'id'>) => {
  // const activities = getActivities();
  
  // const newActivity = {
  //   ...activity,
  //   id: Date.now().toString()
  // };
  
  // // Add to the beginning of the array for reverse chronological order
  // activities.unshift(newActivity);
  
  // // Cap at 50 activities to prevent localStorage from getting too large
  // if (activities.length > 50) {
  //   activities.pop();
  // }
  
  // localStorage.setItem('fluxActivities', JSON.stringify(activities));
  
  // return newActivity;
};

// Get all activities
export const getActivities = async (): Promise<Activity[]> => {
  const user = JSON.parse(localStorage.getItem('fluxUser'));
  const userId = user?.userId;

  try {

    const res = await fetch(`${API}/api/userinfo/get-activity-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      })
    });

    if (!res.ok) {
      console.error("Failed to fetch activity log.");
      return [];
    }

    const data = await res.json();
    const activityLog = data.activityLog || '[]';
    return activityLog;


  } catch (error) {
    console.error('Error fetching activities:', error);
  }
};

// Get activities for a specific project
//export const getProjectActivities = (projectId: string): Activity[] => {
//   const activities = getActivities();
//   return activities.filter(activity => activity.projectId === projectId);
// };

// Clear all activities
export const clearActivities = () => {
  localStorage.setItem('fluxActivities', JSON.stringify([]));
};
