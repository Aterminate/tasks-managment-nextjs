import React, { useState } from "react";
import Router from "next/router";
import { whoAmI } from "../lib/auth";
import { removeToken } from "../lib/token";
import Modal from "./modal"; // Import the Modal component

function Sidebar({ projects, handleLogout, handleProjectClick, handleOpenModal }) {
  return (
    <nav className="sidebar">
      <div className="sidebar">
        <h3> All Projects </h3>
        {projects ? (
          projects.map((project, index) => (
            <a key={index} onClick={() => handleProjectClick(project.name)}>
              {project.name}
            </a>
          ))
        ) : (
          <p>Loading projects...</p>
        )}
        <button onClick={handleOpenModal}>+ Add New Project</button>
      </div>
    </nav>
  );
}


export default function Dashboard() {
  const [user, setUser] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal() {
    console.log('in modal');
    setIsModalOpen(true);
    console.log(isModalOpen); // Log the state value
  }

  function handleCloseModal() {

    setIsModalOpen(false);
  }

  function handleProjectClick(projectName) {
    setSelectedProject(projectName);
  }

  React.useEffect(() => {
    const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
    if (!token) {
      redirectToLogin();
    } else {
      (async () => {
        try {
          const data = await whoAmI();
          if (data.error === "Unauthorized") {
            redirectToLogin();
          } else {
            setUser(data.payload);
          }
        } catch (error) {
          redirectToLogin();
        }
      })();
    }
  }, []);

  function redirectToLogin() {
    Router.push("/auth/login");
  }

  function handleLogout(e) {
    e.preventDefault();
    removeToken();
    redirectToLogin();
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={user.projects}
        handleLogout={handleLogout}
        handleProjectClick={handleProjectClick}
        handleOpenModal={handleOpenModal}
      />
      <div className="header"> {selectedProject || user.username} </div>
      <div className="page-container">
        <div className="col-md-4"> To Do </div>
        <div className="col-md-4"> In Progress </div>
        <div className="col-md-4"> Done </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
