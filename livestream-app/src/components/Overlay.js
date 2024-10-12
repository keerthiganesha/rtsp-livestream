import React, { useState, useEffect } from 'react';
import axios from 'axios';

    const ResizableText = ({ id, content, position, fontSize, onMouseDown, onResize, onChange }) => {
        const [isEditing, setIsEditing] = useState(false); // Track editing mode
        const [editableText, setEditableText] = useState(content); // Local text state for editing
    
    // Handle text content editing
    const handleTextClick = () => {
      setIsEditing(true);
    };
  
    const handleTextChange = (e) => {
      setEditableText(e.target.value);
    };
  
    const handleBlur = () => {
      setIsEditing(false);
      onChange(id, editableText); // Save text changes when losing focus
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
        onChange(id, editableText); // Save text changes on Enter
      }
    };
  
    return (
      <div
        style={{
          position: 'absolute',
          top: `${position.y}px`,
          left: `${position.x}px`,
          cursor: 'move',
          zIndex: 2,
          color: 'red',
          fontSize: `${fontSize}px`,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, id, 'text');
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={editableText}
            onChange={handleTextChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              fontSize: 'inherit',
              background: 'none',
              border: 'none',
              color: 'red',
              outline: 'none',
              resize: 'none',
            }}
          />
        ) : (
          <span onDoubleClick={handleTextClick} style={{ cursor: 'pointer' }}>
            {content}
          </span>
        )}
  
        {/* <div
          style={{
            width: '10px',
            height: '10px',
            background: 'white',
            cursor: 'nwse-resize',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResize(e, id, 'text');
          }}
        /> */}
      </div>
    );
  };
  
const ResizableLogo = ({ id, src, position, size, onMouseDown, onResize }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: 'move',
        zIndex: 2,
      }}
    >
      <img
        src={src}
        alt="Logo"
        style={{ width: `${size.width}px`, height: `${size.height}px`, cursor: 'move' }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, id, 'logo');
        }}
      />
      {/* <div
        style={{
          width: '10px',
          height: '10px',
          background: 'white',
          cursor: 'nwse-resize',
          position: 'absolute',
          right: 0,
          bottom: 0,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onResize(id, e, 'logo');
        }}
      /> */}
    </div>
  );
};

const Overlay = () => {
  const [texts, setTexts] = useState([]);
  const [logos, setLogos] = useState([]);
  const [isDragging, setIsDragging] = useState({ id: null, type: null });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [resizingInfo, setResizingInfo] = useState({ id: null, type: null });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State for saved overlays and selected overlay
  const [savedOverlays, setSavedOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  const handleMouseDown = (e, id, type) => {
    e.preventDefault();
    setIsDragging({ id, type });
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isDragging.id) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;

      if (isDragging.type === 'text') {
        setTexts((prev) =>
          prev.map((text) =>
            text.id === isDragging.id
              ? { ...text, position: { x: text.position.x + dx, y: text.position.y + dy } }
              : text
          )
        );
      } else if (isDragging.type === 'logo') {
        setLogos((prev) =>
          prev.map((logo) =>
            logo.id === isDragging.id
              ? { ...logo, position: { x: logo.position.x + dx, y: logo.position.y + dy } }
              : logo
          )
        );
      }
      setStartPosition({ x: e.clientX, y: e.clientY });
    } else if (resizingInfo.id) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;

      if (resizingInfo.type === 'text') {
        setTexts((prev) =>
          prev.map((text) =>
            text.id === resizingInfo.id
              ? {
                  ...text,
                  fontSize: Math.max(10, (parseInt(text.fontSize) || 18) + dy), // Resize text dynamically
                }
              : text
          )
        );
      } else if (resizingInfo.type === 'logo') {
        setLogos((prev) =>
          prev.map((logo) =>
            logo.id === resizingInfo.id
              ? {
                  ...logo,
                  size: {
                    width: Math.max(10, logo.size.width + dx), // Resize logo dynamically
                    height: Math.max(10, logo.size.height + dy),
                  },
                }
              : logo
          )
        );
      }
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  

  const handleMouseUp = () => {
    setIsDragging({ id: null, type: null });
    setResizingInfo({ id: null, type: null });
  };

  const handleAddText = () => {
    setTexts([
      ...texts,
      {
        id: Date.now(),
        content: 'New Text',
        position: { x: 100, y: 100 },
        fontSize: 18,
      },
    ]);
  };

  const handleAddLogo = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogos([
        ...logos,
        {
          id: Date.now(),
          src: URL.createObjectURL(file),
          position: { x: 200, y: 200 },
          size: { width: 50, height: 50 },
        },
      ]);
    }
  };

  const handleTextChange = (id, newText) => {
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, content: newText } : text))
    );
  };


  

  // Submit overlay data to backend
  const handleSaveOverlay = async () => {
    const overlayData = { texts, logos };
    try {
      await axios.post('http://localhost:5000/overlay', overlayData); // Flask API on port 5000
      alert('Overlay saved successfully!');
      fetchSavedOverlays(); // Fetch saved overlays after saving
    } catch (error) {
      console.error('Error saving overlay:', error);
    }
  };

  // Fetch saved overlays
  const fetchSavedOverlays = async () => {
    try {
      const response = await axios.get('http://localhost:5000/overlay');
      setSavedOverlays(response.data);
    } catch (error) {
      console.error('Error fetching overlays:', error);
    }
  };

  const handleDeleteOverlay = async (overlayId) => {
    try {
      await axios.delete(`http://localhost:5000/overlay/${overlayId}`);
      alert('Overlay deleted successfully!');
      fetchSavedOverlays(); // Refresh overlays list after deletion
      if (overlayId === selectedOverlay) {
        setSelectedOverlay(null); // Clear selected overlay if deleted
        setTexts([]); // Clear texts and logos if the selected overlay was deleted
        setLogos([]);
      }
    } catch (error) {
      console.error('Error deleting overlay:', error);
    }
  };

  // Apply selected overlay
  const handleApplyOverlay = async (overlayId) => {
    try {
      const response = await axios.get(`http://localhost:5000/overlay/${overlayId}`);
      const { texts, logos } = response.data;
      setTexts(texts);
      setLogos(logos);
      setSelectedOverlay(overlayId);
    } catch (error) {
      console.error('Error applying overlay:', error);
    }
  };

  useEffect(() => {
    fetchSavedOverlays(); // Fetch saved overlays when component mounts
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <button onClick={handleAddText}>Add Text</button>
        <input type="file" onChange={handleAddLogo} style={{ marginRight: '10px' }} />
        <button onClick={handleSaveOverlay}>Save Overlay</button>
  
        {/* Dropdown to select saved overlays */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            style={{ padding: '10px', cursor: 'pointer' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedOverlay ? `Overlay ${selectedOverlay}` : 'Select a saved overlay'}
          </button>
  
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                zIndex: 1,
                width: '200px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {savedOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <span
                    style={{
                      cursor: 'pointer',
                      flexGrow: 1,
                      marginRight: '10px',
                    }}
                    onClick={() => handleApplyOverlay(overlay.id)}
                  >
                    Overlay {overlay.id}
                  </span>
                  <button
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '2px 5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteOverlay(overlay.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Render resizable texts */}
      {texts.map((text) => (
        <ResizableText
          key={text.id}
          id={text.id}
          content={text.content}
          position={text.position}
          onMouseDown={handleMouseDown}
          onChange={handleTextChange}
        />
      ))}
  
      {/* Render resizable logos */}
      {logos.map((logo) => (
        <ResizableLogo
          key={logo.id}
          id={logo.id}
          src={logo.src}
          position={logo.position}
          size={logo.size}
          onMouseDown={handleMouseDown}
        />
      ))}
    </div>
  );
}

export default Overlay;
