import React from "react";
import "../../css/pages.css";

function Projects() {
    const projects = [
        { id: 1, title: "Weather App", dueDate: "2024-05-15", submissions: 24 },
        { id: 2, title: "E-commerce Site", dueDate: "2024-05-20", submissions: 18 },
        { id: 3, title: "Chat Application", dueDate: "2024-05-30", submissions: 5 },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-text">
                    <h2>Student Projects</h2>
                    <p>Review and grade student project submissions.</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Project Title</th>
                            <th>Due Date</th>
                            <th>Submissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td>{project.title}</td>
                                <td>{project.dueDate}</td>
                                <td>{project.submissions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Projects;
