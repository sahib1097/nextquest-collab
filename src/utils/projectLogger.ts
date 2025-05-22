import { API } from "../config";

export const createProject = async (newProject: any, userId: string) => {

    try {
        // Make API call to create project in database
        const response = await fetch(`${API}/api/projectinfo/create-project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newProject,
            userId
        })
        });

        if (!response.ok) {
        throw new Error('Failed to create project');
        }

    } catch (error) {
        console.error('Error creating project:', error);
    }
}

export const retrieveProjects = async (userId: string) => {
    try {
        const response = await fetch(`${API}/api/projectinfo/get-projects/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to retrieve projects');
        }

        const data = await response.json();
        console.log("Retrieved projects: ", data);
        return data;
        
    } catch (error) {
        console.error('Error retrieving projects:', error);
    }
}