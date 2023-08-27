import React from "react";

function Modal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
}
const modalStyle = {
    display: isOpen ? "block" : "none"
};
return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3> Add Project </h3>
        <label>Project Name</label>
        <input name="projectname" placeholder="Project 3" />
        <button className="modalButton"> Add New Project </button>
      </div>
    </div>
  );
}
export default Modal;