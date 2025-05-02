document.addEventListener('DOMContentLoaded', function() {
    const statusCodesContainer = document.getElementById('statusCodes');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const closeButton = document.querySelector('.close');
    
    // Add audio elements
    const backgroundMusic = setupAudioPlayer();
    const soundEffects = {
        explode: new Audio('explode.mp3'),
        notify: new Audio('notify.mp3'),
        tada: new Audio('tada.mp3'),
        criticalError: new Audio('critical-error-windows-xp-system-sound.mp3'),
        dialUp: new Audio('dial_up-[AudioTrimmer.com]_(2)_out.mp3')
    };
    
    // Render all status codes initially
    renderStatusCodes(statusCodes);
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredCodes = statusCodes.filter(code => 
            code.code.toString().includes(searchTerm) || 
            code.name.toLowerCase().includes(searchTerm) ||
            code.description.toLowerCase().includes(searchTerm)
        );
        
        renderStatusCodes(filteredCodes);
    });
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterClass = this.getAttribute('data-class');
            let filteredCodes;
            
            if (filterClass === 'all') {
                filteredCodes = statusCodes;
            } else if (filterClass === 'unofficial') {
                filteredCodes = statusCodes.filter(code => !code.official);
            } else if (filterClass === 'visible') {
                // Filter for codes that actually display something to users (3xx, 4xx, 5xx)
                filteredCodes = statusCodes.filter(code => 
                    code.class === '3xx' || code.class === '4xx' || code.class === '5xx' || code.class === '9xx'
                );
            } else {
                filteredCodes = statusCodes.filter(code => code.class === filterClass);
            }
            
            renderStatusCodes(filteredCodes);
        });
    });
    
    // Close modal
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Also close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Render status codes function
    function renderStatusCodes(codes) {
        statusCodesContainer.innerHTML = '';
        
        if (codes.length === 0) {
            statusCodesContainer.innerHTML = '<p class="no-results">No status codes found matching your search.</p>';
            return;
        }
        
        codes.forEach(code => {
            const codeElement = document.createElement('div');
            codeElement.className = `status-code c${code.class}`;
            if (!code.official) {
                codeElement.classList.add('unofficial');
            }
            
            codeElement.innerHTML = `
                <h3>${code.code}</h3>
                <p>${code.name}</p>
            `;
            
            codeElement.addEventListener('click', () => showStatusCodeDetails(code));
            statusCodesContainer.appendChild(codeElement);
        });
    }
    
    // Show status code details
    function showStatusCodeDetails(code) {
        // Create the content for the modal
        modalContent.innerHTML = `
            <h2>${code.code} - ${code.name}</h2>
            <p><strong>Class:</strong> ${getClassDescription(code.class)}</p>
            <p><strong>Official:</strong> ${code.official ? 'Yes' : 'No'}</p>
            <p><strong>Source:</strong> ${code.source || 'Unknown'}</p>
            <p><strong>Description:</strong> ${code.description}</p>
            
            <div class="preview-buttons">
                <button class="preview-button" id="showPreviewBtn">Show Error Page Preview</button>
                <button class="preview-button stylish-button" id="showStylishPreviewBtn">Show Stylish View</button>
            </div>
            
            <div class="fullscreen-preview" id="fullscreenPreview">
                <div class="fullscreen-content">
                    <button class="exit-preview" id="exitPreviewBtn">&times;</button>
                    ${generateErrorPagePreview(code)}
                </div>
            </div>
            
            <div class="fullscreen-preview" id="stylishPreview">
                <div class="fullscreen-content">
                    <button class="exit-preview" id="exitStylishPreviewBtn">&times;</button>
                    ${generateStylishErrorPage(code)}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Add event listeners for the preview buttons
        document.getElementById('showPreviewBtn').addEventListener('click', function() {
            document.getElementById('fullscreenPreview').style.display = 'block';
            document.getElementById('stylishPreview').style.display = 'none';
            // Play sound effect when preview button is clicked
            playStatusCodeSound(code.class);
            pauseBackgroundMusic(); // Pause music when preview is shown
        });
        
        document.getElementById('showStylishPreviewBtn').addEventListener('click', function() {
            document.getElementById('stylishPreview').style.display = 'block';
            document.getElementById('fullscreenPreview').style.display = 'none';
            // Play sound effect when stylish view button is clicked
            playStatusCodeSound(code.class);
            pauseBackgroundMusic(); // Pause music when stylish view is shown
            
            // Check if it's the Peter Griffin error and initialize animation
            if (code.code === 566) {
                handlePeterAnimation();
            }
        });
        
        document.getElementById('exitPreviewBtn').addEventListener('click', function() {
            document.getElementById('fullscreenPreview').style.display = 'none';
            resumeBackgroundMusic(); // Resume music when preview is closed
        });
        
        document.getElementById('exitStylishPreviewBtn').addEventListener('click', function() {
            document.getElementById('stylishPreview').style.display = 'none';
            resumeBackgroundMusic(); // Resume music when stylish view is closed
        });
    }
    
    // Helper function to get class description
    function getClassDescription(classCode) {
        const descriptions = {
            '1xx': 'Informational responses',
            '2xx': 'Success responses',
            '3xx': 'Redirection responses',
            '4xx': 'Client error responses',
            '5xx': 'Server error responses',
            '9xx': 'Unofficial/Joke responses'
        };
        
        return descriptions[classCode] || classCode;
    }
    
    // Generate stylish error page
    function generateStylishErrorPage(code) {
        // Get appropriate colors and icons based on status code class
        const colors = getErrorColors(code.class);
        const icon = getErrorIcon(code);
        
        return `
            <div class="stylish-error-page" style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);">
                <div class="stylish-content">
                    <div class="stylish-icon">${icon}</div>
                    <div class="stylish-code">${code.code}</div>
                    <h1 class="stylish-title">${code.name}</h1>
                    <div class="stylish-message">${code.message}</div>
                    ${getStylishExtraContent(code)}
                </div>
            </div>
        `;
    }
    
    // Helper functions for stylish error page
    function getErrorColors(classCode) {
        const colorSchemes = {
            '1xx': { primary: '#3498db', secondary: '#2980b9' },
            '2xx': { primary: '#2ecc71', secondary: '#27ae60' },
            '3xx': { primary: '#f39c12', secondary: '#d35400' },
            '4xx': { primary: '#e74c3c', secondary: '#c0392b' },
            '5xx': { primary: '#9b59b6', secondary: '#8e44ad' },
            '9xx': { primary: '#95a5a6', secondary: '#7f8c8d' }
        };
        
        return colorSchemes[classCode] || { primary: '#34495e', secondary: '#2c3e50' };
    }
    
    function getErrorIcon(code) {
        // SVG icons for different error types
        const icons = {
            '1xx': '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
            '2xx': '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            '3xx': '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74L11.17 11.17L8.75 12.25L10.17 14.75C10.75 14.92 11.33 15 12 15C14.5 15 16.5 13 16.5 10.5C16.5 8 14.5 5.5 12 5.5"/></svg>',
            '4xx': '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
            '5xx': '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-2h2V7h-2v7z"/></svg>',
            '9xx': '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.59-8-8s3.58-8 8-8 8 3.59 8 8-3.58 8-8 8z"/></svg>'
        };
        
        // Special cases for unique error codes
        if (code.code === 418) {
            return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M6,2C3.79,2 2,3.79 2,6v4c0,2.21 1.79,4 4,4h1v7h2v-7h6v7h2v-7h1c2.21,0 4,-1.79 4,-4V6c0,-2.21 -1.79,-4 -4,-4H6zM3.75,3.75c0.69,0 1.25,0.56 1.25,1.25C5,5.69 4.44,6.25 3.75,6.25S2.5,5.69 2.5,5C2.5,4.31 3.06,3.75 3.75,3.75zM6,4h12c1.1,0 2,0.9 2,2v3H4V6C4,4.9 4.9,4 6,4z"/></svg>';
        } else if (code.code === 404) {
            return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M11,7h2v2h-2V7z M11,11h2v6h-2V11z M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10s10,-4.48 10,-10S17.52,2 12,2z M12,20c-4.41,0 -8,-3.59 -8,-8s3.59,-8 8,-8s8,3.59 8,8S16.41,20 12,20z"/></svg>';
        } else if (code.code === 429) {
            return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M16.5,12A2.5,2.5 0 0,0 19,9.5A2.5,2.5 0 0,0 16.5,7A2.5,2.5 0 0,0 14,9.5A2.5,2.5 0 0,0 16.5,12M9,11A3,3 0 0,0 12,8A3,3 0 0,0 9,5A3,3 0 0,0 6,8A3,3 0 0,0 9,11M16.5,14C14.67,14 11,14.92 11,16.75V19H22V16.75C22,14.92 18.33,14 16.5,14M9,13C6.67,13 2,14.17 2,16.5V19H9V16.75C9,15.9 9.33,14.41 11.37,13.28C10.5,13.1 9.66,13 9,13Z"/></svg>';
        } else if (code.code === 500) {
            return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,5.5C9.5,5.5 7.5,7.5 7.5,10C7.5,10.11 7.5,10.22 7.5,10.33L9.83,9.17L11.17,11.17L8.75,12.25L10.17,14.75C10.75,14.92 11.33,15 12,15C14.5,15 16.5,13 16.5,10.5C16.5,8 14.5,5.5 12,5.5"/></svg>';
        }
        
        return icons[code.class] || icons['9xx'];
    }
    
    function getStylishExtraContent(code) {
        // Add custom elements based on specific error types
        if (code.code === 566) {
            return `
                <div class="peter-container">
                    <div class="peter-animation">
                        <img src="Peter_Griffin.png" class="peter-character" alt="Peter Griffin">
                        <img src="explode.gif" class="explosion" alt="Explosion">
                        <div class="binary-bits"></div>
                    </div>
                </div>
            `;
        } else if (code.code === 404) {
            return `
                <div class="stylish-extra">
                    <svg viewBox="0 0 100 20" class="stylish-wave">
                        <path fill="rgba(255,255,255,0.2)" d="M0,10 C30,0 40,20 50,10 C60,0 70,20 100,10 L100,20 L0,20 Z"></path>
                    </svg>
                    <svg class="stylish-magnify" width="120" height="120" viewBox="0 0 24 24">
                        <path fill="rgba(255,255,255,0.3)" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M12,14L13.5,17H10.5L12,14Z" />
                    </svg>
                </div>
            `;
        } else if (code.code === 500) {
            return `
                <div class="stylish-extra">
                    <svg viewBox="0 0 100 50" class="stylish-gears">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" />
                        <circle cx="70" cy="30" r="20" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" />
                        <rect x="25" y="27.5" width="10" height="5" fill="rgba(255,255,255,0.3)" />
                        <rect x="27.5" y="25" width="5" height="10" fill="rgba(255,255,255,0.3)" />
                        <rect x="65" y="27.5" width="10" height="5" fill="rgba(255,255,255,0.3)" />
                        <rect x="67.5" y="25" width="5" height="10" fill="rgba(255,255,255,0.3)" />
                    </svg>
                </div>
            `;
        } else if (code.code === 418) {
            return `
                <div class="stylish-extra">
                    <svg viewBox="0 0 100 60" class="stylish-teapot">
                        <path fill="rgba(255,255,255,0.3)" d="M30,20 C30,15 40,15 40,20 L40,35 L20,35 L20,20 C20,15 30,15 30,20 Z" />
                        <path fill="rgba(255,255,255,0.3)" d="M20,35 L40,35 L42,45 L18,45 Z" />
                        <path fill="rgba(255,255,255,0.3)" d="M40,25 C60,25 60,40 40,40" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none" />
                    </svg>
                </div>
            `;
        } else if (code.code === 429) {
            return `
                <div class="stylish-extra">
                    <svg class="stylish-tomatoes" viewBox="0 0 100 40">
                        <circle cx="20" cy="20" r="8" fill="rgba(255,80,80,0.7)" />
                        <circle cx="40" cy="10" r="6" fill="rgba(255,80,80,0.7)" />
                        <circle cx="60" cy="25" r="7" fill="rgba(255,80,80,0.7)" />
                        <circle cx="75" cy="15" r="5" fill="rgba(255,80,80,0.7)" />
                        <circle cx="85" cy="30" r="8" fill="rgba(255,80,80,0.7)" />
                    </svg>
                    <div class="stylish-stick-figure">
                        <svg viewBox="0 0 50 50" width="100" height="100">
                            <circle cx="25" cy="10" r="8" fill="white" />
                            <line x1="25" y1="18" x2="25" y2="35" stroke="white" stroke-width="2" />
                            <line x1="25" y1="35" x2="15" y2="45" stroke="white" stroke-width="2" />
                            <line x1="25" y1="35" x2="35" y2="45" stroke="white" stroke-width="2" />
                            <line x1="25" y1="25" x2="10" y2="15" stroke="white" stroke-width="2" />
                            <line x1="25" y1="25" x2="40" y2="15" stroke="white" stroke-width="2" />
                        </svg>
                    </div>
                </div>
            `;
        } else if (code.class === '3xx') {
            // Handle all redirects
            if (code.code === 300) {
                return `
                    <div class="stylish-extra">
                        <div class="redirect-options">
                            <div class="redirect-site">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="white" d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M12,14L13.5,17H10.5L12,14Z" />
                                </svg>
                                <p>mobile.site.com</p>
                            </div>
                            <div class="redirect-site">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="white" d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                                <p>desktop.site.com</p>
                            </div>
                            <div class="redirect-site">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="white" d="M4,6H20V16H4V6M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" />
                                </svg>
                                <p>docs.site.com</p>
                            </div>
                        </div>
                        <div class="redirect-arrow">
                            <svg viewBox="0 0 24 24" width="60" height="60">
                                <path fill="white" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                            </svg>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="stylish-extra">
                        <div class="redirect-container">
                            <div class="redirect-site">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="white" d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                                <p>new-location.example.com</p>
                            </div>
                            <div class="redirect-arrow">
                                <svg viewBox="0 0 24 24" width="60" height="60">
                                    <path fill="white" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        return '';
    }
    
    // Generate error page preview
    function generateErrorPagePreview(code) {
        // Different HTML based on the class of status code
        let previewHTML = '';
        
        // Informational responses usually don't show a page, just inform the client
        if (code.class === '1xx') {
            previewHTML = `
                <div class="preview-informational">
                    <p>Informational responses typically don't display a page to the user, but send a header to the client.</p>
                    <p>Header: <code>HTTP/1.1 ${code.code} ${code.name}</code></p>
                    <p>User might see: <em>Nothing, the client continues with the request.</em></p>
                </div>
            `;
        } 
        // Success responses usually return the requested content
        else if (code.class === '2xx') {
            previewHTML = `
                <div class="preview-success">
                    <p>Success responses typically return the requested content without showing an error.</p>
                    <p>Header: <code>HTTP/1.1 ${code.code} ${code.name}</code></p>
                    <p>User might see: <em>The requested content, not an error page.</em></p>
                </div>
            `;
        }
        // For redirection codes
        else if (code.class === '3xx') {
            if (code.code === 300) {
                previewHTML = `
                    <div class="preview-redirect">
                        <h1>${code.code} - ${code.name}</h1>
                        <p>${code.message}</p>
                        <p>Please choose one of the following options:</p>
                        <ul>
                            <li><a href="#">Mobile version</a></li>
                            <li><a href="#">Desktop version</a></li>
                            <li><a href="#">Documentation</a></li>
                        </ul>
                        <p><small>Your browser should automatically select the best option based on your device.</small></p>
                    </div>
                `;
            } else {
                previewHTML = `
                    <div class="preview-redirect">
                        <h1>${code.code} - ${code.name}</h1>
                        <p>${code.message}</p>
                        <p>You are being redirected to: <a href="#">new-location.example.com</a></p>
                        <p><small>If you are not redirected automatically, please click the link above.</small></p>
                    </div>
                `;
            }
        }
        // For client errors
        else if (code.class === '4xx') {
            previewHTML = `
                <div class="preview-client-error">
                    <h1>${code.code} - ${code.name}</h1>
                    <p>${code.message}</p>
                    <hr>
                    <p>Please check your request and try again. If you believe this is an error, contact the website administrator.</p>
                    <button>Go back</button> <button>Try again</button>
                </div>
            `;
        }
        // For server errors
        else if (code.class === '5xx') {
            previewHTML = `
                <div class="preview-server-error">
                    <h1>${code.code} - ${code.name}</h1>
                    <p>${code.message}</p>
                    <hr>
                    <p>Our team has been notified and is working to resolve the issue. Please try again later.</p>
                    <p><small>Error reference: REF-${Math.floor(Math.random() * 1000000)}</small></p>
                    <button>Go back</button> <button>Go to homepage</button>
                </div>
            `;
        }
        // For unofficial/joke codes
        else {
            previewHTML = `
                <div class="preview-unofficial">
                    <h1>${code.code} - ${code.name}</h1>
                    <p>${code.message}</p>
                    <hr>
                    <p>This is an unofficial status code that you might never see in the wild!</p>
                    <button>Go back to reality</button>
                </div>
            `;
        }
        
        return previewHTML;
    }
    
    // Function to handle Peter Griffin animation
    function handlePeterAnimation() {
        const peterChar = document.querySelector('.peter-character');
        const explosion = document.querySelector('.explosion');
        const binaryBits = document.querySelector('.binary-bits');
        
        if (peterChar && explosion && binaryBits) {
            setTimeout(() => {
                explosion.style.display = 'block';
                peterChar.classList.add('jumping');
                soundEffects.explode.play();
                
                setTimeout(() => {
                    peterChar.style.display = 'none';
                    binaryBits.style.display = 'block';
                }, 800);
            }, 3000);
        }
    }
    
    // Function to play sound effect based on status code class
    function playStatusCodeSound(codeClass) {
        if (codeClass === '1xx') {
            soundEffects.notify.play();
        } else if (codeClass === '2xx') {
            soundEffects.tada.play();
        } else if (codeClass === '3xx' || codeClass === '4xx') {
            soundEffects.criticalError.play();
        } else if (codeClass === '5xx' || codeClass === '9xx') {
            soundEffects.dialUp.play();
        }
    }
    
    // Setup audio player with playlist functionality
    function setupAudioPlayer() {
        const playlist = [
            {title: 'Chess (sped up)', src: 'chess (sped up).wav'},
            {title: 'M.U.L.E. (Bitblaster Mix)', src: '8 Bit Weapon - M.U.L.E. (Bitblaster Mix) - Roblox Remastered Soundtrack.mp3'},
            {title: 'Background Music', src: 'Background Music.m4a'}
        ];
        
        let currentTrack = 0;
        const audioPlayer = new Audio(playlist[currentTrack].src);
        audioPlayer.volume = 0.5;
        
        // Create music player UI
        const musicPlayer = document.createElement('div');
        musicPlayer.className = 'music-player';
        musicPlayer.innerHTML = `
            <div class="music-controls">
                <button id="prevTrack">⏮</button>
                <button id="playPause">▶</button>
                <button id="nextTrack">⏭</button>
                <div class="volume-control">
                    <span>🔊</span>
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="0.5">
                </div>
            </div>
            <div class="now-playing">
                <span>Now Playing: </span>
                <span id="trackTitle">${playlist[currentTrack].title}</span>
            </div>
        `;
        
        // Add music player to DOM
        document.body.appendChild(musicPlayer);
        
        // Add event listeners for music controls
        document.getElementById('playPause').addEventListener('click', togglePlay);
        document.getElementById('nextTrack').addEventListener('click', nextTrack);
        document.getElementById('prevTrack').addEventListener('click', prevTrack);
        document.getElementById('volumeSlider').addEventListener('input', function() {
            audioPlayer.volume = this.value;
        });
        
        // Handle track ending
        audioPlayer.addEventListener('ended', nextTrack);
        
        // Toggle play/pause
        function togglePlay() {
            const playPauseBtn = document.getElementById('playPause');
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.textContent = '⏸';
            } else {
                audioPlayer.pause();
                playPauseBtn.textContent = '▶';
            }
        }
        
        // Play next track
        function nextTrack() {
            currentTrack = (currentTrack + 1) % playlist.length;
            changeTrack();
        }
        
        // Play previous track
        function prevTrack() {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            changeTrack();
        }
        
        // Change the current track
        function changeTrack() {
            const wasPlaying = !audioPlayer.paused;
            audioPlayer.src = playlist[currentTrack].src;
            document.getElementById('trackTitle').textContent = playlist[currentTrack].title;
            
            // If it was playing before, continue playing the new track
            if (wasPlaying) {
                audioPlayer.play();
                document.getElementById('playPause').textContent = '⏸';
            } else {
                document.getElementById('playPause').textContent = '▶';
            }
        }
        
        // Auto-play the first track
        audioPlayer.play().then(() => {
            document.getElementById('playPause').textContent = '⏸';
        }).catch(e => {
            console.log('Auto-play prevented:', e);
            document.getElementById('playPause').textContent = '▶';
        });
        
        return audioPlayer;
    }
    
    // Function to pause background music
    function pauseBackgroundMusic() {
        backgroundMusic.pause();
        document.getElementById('playPause').textContent = '▶';
    }
    
    // Function to resume background music
    function resumeBackgroundMusic() {
        backgroundMusic.play().then(() => {
            document.getElementById('playPause').textContent = '⏸';
        }).catch(e => {
            console.log('Auto-play prevented on resume:', e);
            document.getElementById('playPause').textContent = '▶';
        });
    }
});