import React, { useState } from 'react';

const DocumentUpload = ({ onDocumentProcessed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['.pdf', '.txt', '.docx'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      setError('Please upload a PDF, TXT, or DOCX file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      onDocumentProcessed(true);
    } catch (error) {
      setError(error.message);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="document-upload">
      {fileName && !isUploading && !error && (
        <div className="file-success">
          <span className="file-icon">📄</span>
          <span className="file-name">{fileName}</span>
        </div>
      )}
      <label className={`upload-button ${isUploading ? 'uploading' : ''}`}>
        <input
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <>
            <span className="upload-spinner"></span>
            Processing...
          </>
        ) : (
          <>
            <span className="upload-icon">📁</span>
            {fileName ? 'Change Document' : 'Upload Document'}
          </>
        )}
      </label>
      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;