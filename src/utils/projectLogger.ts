import { API } from "../config";

export const createProject = async (newProject: any, teamId: string) => {

    try {
        // Make API call to create project in database
        const response = await fetch(`${API}/projectinfo/create-project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newProject,
            teamId
        })
        });

        if (!response.ok) {
        throw new Error('Failed to create project');
        }

    } catch (error) {
        console.error('Error creating project:', error);
    }
}

export const retrieveProjects = async (teamId: string) => {
    try {
        const response = await fetch(`${API}/projectinfo/get-projects/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teamId
                })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to retrieve projects');
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error retrieving projects:', error);
    }
}

export const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
        const response = await fetch(`${API}/projectinfo/update-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId,
                newStatus
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update project status');
        }

        const data = await response.json();
        console.log("Updated project status: ", data);
    } catch (error) {
        console.error('Error updating project status:', error);
    }
}

export const getProjectDetails = async (projectId: string) => {
    try {
        const response = await fetch(`${API}/projectinfo/get-project-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve project details');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error retrieving project details:', error);
    }
}

export const addTaskToProject = async (projectId: string, task: any) => {
    try {
        const response = await fetch(`${API}/projectinfo/add-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId,
                task
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add task to project');
        }

        const data = await response.json();
        console.log("Task added to project: ", data);
    } catch (error) {
        console.error('Error adding task to project:', error);
    }
}

export const deleteTask = async (taskId: string, projectId: string) => {
    try{
        const response = await fetch(`${API}/projectInfo/delete-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId,
                taskId
            })
        })

        const task = response.body;

        return task;
        
    } catch(error) {
        console.error('Error deleting task from project:', error);
    }
}