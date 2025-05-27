import { API } from "../config";

export const updateTheme = async (newTheme) => {
    const user = JSON.parse(localStorage.getItem('fluxUser')|| '{}');
    const userId = user?.userId;

    try {
        const res = await fetch(`${API}/api/usersettings/update-theme`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            newTheme
          })
        });
    
        if (!res.ok) {
          console.error("Failed to update theme.");
          return;
        }
      } catch (error) {
        console.error('Error updating theme:', error);
      }
}

export const fetchUserTheme = async () => {
  const user = JSON.parse(localStorage.getItem('fluxUser') || '{}');
  const userId = user?.userId;

  if (!userId) {
    return null;
  }

  try {
    const res = await fetch(`${API}/api/usersettings/theme/${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch theme.");
      return null;
    }
    const data = await res.json();
    return data.theme;
  } catch (error) {
    console.error('Error fetching theme:', error);
    return null;
  }
}