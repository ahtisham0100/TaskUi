import React, { useState } from "react";

const FileHandle = (props) => {
    const [projectName, setProjectName] = useState("");
    const [emailFile, setEmailFile] = useState(null);
    const [workOrderFile, setWorkOrderFile] = useState(null);
    const [message, setMessage] = useState("");
    const [text, setText] = useState(""); // Stores extracted text

    // Handle project name input
    const handleProjectNameChange = (event) => {
        setProjectName(event.target.value);
    };

    // Handle file changes
    const handleFileChange = (event) => {
        const { name, files } = event.target;
        if (files.length > 0) {
            if (name === "email") setEmailFile(files[0]);
            else if (name === "pdf") setWorkOrderFile(files[0]);
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!projectName || !emailFile || !workOrderFile) {
            setMessage("⚠️ Please fill in all fields and upload both files.");
            return;
        }

        const formData = new FormData();
        formData.append("projectname", projectName);
        formData.append("email", emailFile);
        formData.append("pdf", workOrderFile);

        try {
            const response = await fetch(`${props.serverAddress}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json(); // Convert response to JSON
            console.log(data); // Debugging: Check response content
            setText(data.pdfdata || "No text extracted."); // Update extracted text
            setMessage("File uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Error uploading file.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center mb-4">Upload Work Order & Email</h2>
                <form onSubmit={handleSubmit}>
                    {/* Project Name */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Project Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter the project name"
                            value={projectName}
                            onChange={handleProjectNameChange}
                            required
                        />
                    </div>

                    {/* Email Upload */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Upload Email (PDF)</label>
                        <input
                            type="file"
                            name="email"
                            className="form-control"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Work Order Upload */}
                    <div className="mb-3">
                        <label htmlFor="pdf" className="form-label fw-bold">Work Order (PDF)</label>
                        <input
                            type="file"
                            name="pdf"
                            className="form-control"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Upload
                    </button>
                </form>

                {/* Display Messages */}
                {message && <p className="alert alert-info mt-3 text-center">{message}</p>}

                {/* Display Extracted Text */}
               
            </div>
        </div>
    );
};

export default FileHandle;
