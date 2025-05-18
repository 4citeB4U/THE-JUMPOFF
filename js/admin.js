// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin interface
    initDeviceSelector();
    initEditButtons();
    initComponentPalette();
    initModalActions();
    initDragDrop();
    setupIframeInteraction();
    
    // Set up the publish button
    document.querySelector('.publish-button').addEventListener('click', function() {
        showNotification('Changes published successfully!');
    });
});

// Device preview selector
function initDeviceSelector() {
    const deviceButtons = document.querySelectorAll('.device-button');
    const iframeContainer = document.querySelector('.iframe-container');
    
    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update iframe container class
            const device = button.getAttribute('data-device');
            iframeContainer.className = `iframe-container ${device}`;
        });
    });
}

// Add component palette logic
function initComponentPalette() {
    const addComponentButton = document.getElementById('addComponentButton');
    const componentPalette = document.getElementById('componentPalette');
    
    // Toggle component palette visibility
    addComponentButton.addEventListener('click', () => {
        componentPalette.classList.toggle('active');
    });
    
    // Hide palette when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#componentPalette') && 
            !e.target.closest('#addComponentButton')) {
            componentPalette.classList.remove('active');
        }
    });
    
    // Component selection logic
    const componentOptions = document.querySelectorAll('.component-option');
    componentOptions.forEach(option => {
        option.addEventListener('click', () => {
            const componentType = option.getAttribute('data-type');
            addNewComponent(componentType);
            componentPalette.classList.remove('active');
        });
    });
}

// Add a new component
function addNewComponent(type) {
    // In a real implementation, this would insert a new component in the iframe
    showNotification(`Adding new ${type.replace('_', ' ')} component`);
    
    // For demo purposes, we'll just show a notification
    setTimeout(() => {
        showEditModal(`Edit ${type.replace('_', ' ')}`, getDefaultFormForComponent(type));
    }, 500);
}

// Get default form fields for a component type
function getDefaultFormForComponent(type) {
    // This would typically come from a template library
    // For demo purposes, we'll return basic fields
    switch(type) {
        case 'hero_section':
            return `
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-input" value="Your Music. Your Rules.">
                </div>
                <div class="form-group">
                    <label class="form-label">Subtitle</label>
                    <textarea class="form-input">Independent artist connecting directly with fans. No middleman.</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Background Image</label>
                    <div class="upload-container">
                        <div class="upload-icon">📷</div>
                        <div class="upload-text">Drag & drop an image or click to browse</div>
                        <div class="upload-subtext">Recommended size: 1920x1080px</div>
                    </div>
                </div>`;
        
        case 'text_block':
            return `
                <div class="form-group">
                    <label class="form-label">Heading</label>
                    <input type="text" class="form-input" value="Section Heading">
                </div>
                <div class="form-group">
                    <label class="form-label">Content</label>
                    <textarea class="form-input" rows="6">Enter your text content here...</textarea>
                </div>`;
        
        case 'video_player':
            return `
                <div class="form-group">
                    <label class="form-label">Video Title</label>
                    <input type="text" class="form-input" value="Latest Music Video">
                </div>
                <div class="form-group">
                    <label class="form-label">Video URL (YouTube, Vimeo, etc)</label>
                    <input type="text" class="form-input" placeholder="https://www.youtube.com/watch?v=...">
                </div>
                <div class="form-group">
                    <label class="form-label">Thumbnail Image (optional)</label>
                    <div class="upload-container">
                        <div class="upload-icon">📷</div>
                        <div class="upload-text">Drag & drop an image or click to browse</div>
                        <div class="upload-subtext">Recommended size: 1280x720px</div>
                    </div>
                </div>`;
                
        default:
            return `
                <div class="form-group">
                    <label class="form-label">Component Title</label>
                    <input type="text" class="form-input" value="New Component">
                </div>
                <div class="form-group">
                    <label class="form-label">Content</label>
                    <textarea class="form-input">Add your content here...</textarea>
                </div>`;
    }
}

// Edit buttons and overlay functionality
function initEditButtons() {
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');
    
    editButton.addEventListener('click', () => {
        showEditModal('Edit Hero Section');
    });
    
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this section?')) {
            showNotification('Section deleted');
        }
    });
}

// Modal actions
function initModalActions() {
    const modals = document.querySelectorAll('.edit-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-button');
    const backdrop = document.getElementById('backdrop');
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
            backdrop.classList.remove('active');
        });
    });
    
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
            backdrop.classList.remove('active');
        });
    }
    
    // Save button action
    const saveButtons = document.querySelectorAll('.save-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the modal this button belongs to
            const modal = this.closest('.edit-modal');
            
            // In a real implementation, we'd save the changes to the server/database
            showNotification('Changes saved successfully!');
            
            // Close the modal
            modals.forEach(modal => modal.classList.remove('active'));
            backdrop.classList.remove('active');
        });
    });
}

// Show edit modal with title and optional form content
function showEditModal(title, formContent = null) {
    const modal = document.getElementById('editModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const backdrop = document.getElementById('backdrop');
    
    // Set the title
    modalTitle.textContent = title;
    
    // Update form content if provided
    if (formContent) {
        modalBody.innerHTML = formContent;
    }
    
    // Show the modal and backdrop
    modal.classList.add('active');
    backdrop.classList.add('active');
}

// Drag and drop functionality
function initDragDrop() {
    // In a real implementation, this would handle dragging elements within the iframe
    // For demo purposes, we'll just add some basic event listeners to show the concept
    const dragIndicator = document.getElementById('dragIndicator');
    
    dragIndicator.addEventListener('mousedown', function(e) {
        // Prevent default to avoid text selection during drag
        e.preventDefault();
        
        // Show notification for demo purposes
        showNotification('Dragging section (demo)');
        
        // In a real implementation, we'd add mousemove and mouseup event listeners
        // to track the drag and eventually reposition the element
    });
}

// Set up iframe interaction
function setupIframeInteraction() {
    // This function simulates the interaction with the iframe content
    window.addEventListener('load', function() {
        setTimeout(() => {
            const iframe = document.getElementById('sitePreview');
            if (!iframe) return;
            
            const iframeRect = iframe.getBoundingClientRect();
            
            // Position the add component button between sections
            const addComponentButton = document.getElementById('addComponentButton');
            if (addComponentButton) {
                addComponentButton.style.top = (iframeRect.top + 500) + 'px';
            }
            
            // Set up edit overlay for demo purposes
            const elementOverlay = document.getElementById('elementOverlay');
            const editButton = document.getElementById('editButton');
            const dragIndicator = document.getElementById('dragIndicator');
            const deleteButton = document.getElementById('deleteButton');
            
            if (elementOverlay && editButton && dragIndicator && deleteButton) {
                // Position overlay and controls
                elementOverlay.style.left = iframeRect.left + 'px';
                elementOverlay.style.top = (iframeRect.top + 200) + 'px';
                elementOverlay.style.width = iframeRect.width + 'px';
                elementOverlay.style.height = '300px';
                
                editButton.style.top = (iframeRect.top + 210) + 'px';
                editButton.style.right = (window.innerWidth - iframeRect.right + 10) + 'px';
                
                dragIndicator.style.top = (iframeRect.top + 210) + 'px';
                dragIndicator.style.left = (iframeRect.left + 10) + 'px';
                
                deleteButton.style.top = (iframeRect.top + 210) + 'px';
                deleteButton.style.right = (window.innerWidth - iframeRect.right + 52) + 'px';
                
                // Show controls when hovering over the iframe
                iframe.addEventListener('mouseover', function() {
                    elementOverlay.classList.add('visible');
                    editButton.classList.add('visible');
                    dragIndicator.classList.add('visible');
                    deleteButton.classList.add('visible');
                });
            }
        }, 1000);
    });
    
    // Handle window resize to reposition elements
    window.addEventListener('resize', function() {
        // In a real implementation, we'd update the positions of all controls
        setupIframeInteraction();
    });
}

// Show notification message
function showNotification(message, type = 'success') {
    // Check if a notification element already exists
    let notification = document.querySelector('.admin-notification');
    
    // If not, create one
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'admin-notification';
        document.body.appendChild(notification);
        
        // Add styles if not already in CSS
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.backgroundColor = type === 'success' ? 'var(--accent-teal)' : 'var(--accent-coral)';
        notification.style.color = 'var(--primary-bg)';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.zIndex = '2000';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
    
    // Set message and type
    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? 'var(--accent-teal)' : 'var(--accent-coral)';
    
    // Show the notification
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Hide after a delay
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}