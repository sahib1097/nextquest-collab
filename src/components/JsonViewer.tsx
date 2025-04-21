
import React from "react";
import { motion } from "framer-motion";

const JsonViewer: React.FC = () => {
  const projectData = {
    project: {
      name: "Marketing Website Redesign",
      id: "PRJ-2023-001",
      status: "In Progress",
      progress: 65,
      dueDate: "2025-05-15",
      team: [
        { id: "U001", name: "Alex Chen", role: "Project Lead" },
        { id: "U002", name: "Sarah Kim", role: "Designer" },
        { id: "U003", name: "James Miller", role: "Developer" }
      ],
      tasks: [
        {
          id: "TSK-001",
          title: "Wireframes",
          assignee: "U002",
          status: "Completed",
          priority: "High"
        },
        {
          id: "TSK-002",
          title: "Frontend Implementation",
          assignee: "U003",
          status: "In Progress",
          priority: "Medium"
        },
        {
          id: "TSK-003",
          title: "User Testing",
          assignee: "U001",
          status: "Not Started",
          priority: "High"
        }
      ]
    }
  };

  const prettyJson = JSON.stringify(projectData, null, 2);
  const jsonLines = prettyJson.split('\n');

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-left overflow-hidden shadow-xl border border-gray-800">
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-gray-400 text-sm">project.json</div>
      </div>
      
      <pre className="font-mono text-sm overflow-x-auto">
        <code>
          {jsonLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.03,
                duration: 0.5
              }}
              className="line"
            >
              {line
                .replace(/"([\w]+)":/g, '<span class="text-purple-400">"$1"</span>:')
                .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
                .replace(/\b(true|false|null|\d+)\b/g, '<span class="text-yellow-400">$1</span>')}
            </motion.div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default JsonViewer;
