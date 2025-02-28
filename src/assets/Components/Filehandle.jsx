import React, { useState } from 'react';

const FileHandle = (props) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [text, setText] = useState('hello text not updated'); // 🔹 Added state for extracted text

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file); // Ensure this key matches in the backend

        try {
            const response = await fetch(`${props.serverAddress}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json(); // Convert response to JSON
            console.log(data); // Debugging: Check response content
setText(data.text); // 🔹 Store extracted text in state
            setMessage('File uploaded successfully.');
            // 🔹 Store extracted text separately

        } catch (error) {
            console.error('Upload failed:', error);
            setMessage('Error uploading file.');
        }
    };

    return ( 
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" name="pdf" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}  

            {/* 🔹 Properly display extracted text */}
            {text && (
              <div style={{ whiteSpace: 'pre-wrap' }}>
              {text}
          </div>
          
            )}
        </div>
    );
};

export default FileHandle;
