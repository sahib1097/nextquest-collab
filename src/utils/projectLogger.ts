import { API } from "../config";

export const createProject = async (newProject: any, teamId: string) => {
    console.log("Creating project with data: ", newProject);
    console.log("New Project tasks: ", newProject.tasks);
    console.log("Team ID: ", teamId);
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

export const completeTaskInProject = async (projectId: string, taskId: string) => {
    try {
        const response = await fetch(`${API}/projectinfo/complete-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId,
                taskId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to complete task in project');
        }

        const data = await response.json();
        return data.task;
    } catch (error) {
        console.error('Error completing task in project:', error);
    }
}

export const importFromJira = async (jiraData: any, teamId) => {

    console.log("Importing from Jira with data: ", jiraData);
    console.log("Team ID: ", teamId);

    // Function to import projects data from Jira
    try {
        const response = await fetch(`${API}/jira/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jiraData)
        });

        if (!response.ok) {
            throw new Error('Failed to import from Jira');
        }

        const jiraProjects = await response.json();
        console.log("Imported from Jira: ", jiraProjects);

    for (const project of jiraProjects.projects) {

        const tasks = await importTasksFromJira(jiraData, project.key);
        // if (!tasks) {
        //     console.error(`No tasks found for project: ${project.key}`);
        //     continue;
        // }
        // console.log("Tasks for project: ", tasks);

        const newProject = {
            id: project.id,
            name: project.key,
            description: project.name,
            dueDate: "No due date",
            tasks: tasks,
            status: "Planning",
            team: ["You"],
            progress: 0,
            isGroupQuest: false
            // tasks: [tasks]
        };

        console.log("New project to be created: ", newProject);


        await createProject(newProject, teamId[0]);
    }

        

    } catch (error) {
        console.error('Error creating project from Jira data:', error);
    }
}

export const importTasksFromJira = async (jiraData: any, projectKey: string) => {
    const completeData = {
        ...jiraData,
        projectKey: projectKey
    };

    console.log("Importing tasks from Jira with data: ", completeData);

    try {
        const response = await fetch(`${API}/jira/issues`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(completeData)
        });

        if (!response.ok) {
            throw new Error('Failed to import tasks from Jira');
        }

        const jiraTasks = await response.json();
        console.log("Imported tasks from Jira: ", jiraTasks);

        const newTasks = jiraTasks.issues.map((task: any) => ({
            id: task.id,
            title: task.fields.issuetype.name,
            description: task.fields.issuetype.description,
        }));

        return newTasks;

    } catch (error) {
        console.error('Error importing tasks from Jira:', error);
        return []; // Optional: return empty array on failure
    }
};
