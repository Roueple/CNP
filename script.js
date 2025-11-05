// ==========================================
// JAVASCRIPT FOR HOSPITALITY REPORT
// ==========================================

// ==========================================
// MODERN COLLAPSIBLE MENU
// ==========================================
function initializeMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    const menuLinks = document.querySelectorAll('.menu-link[href], .submenu-link');

    // Toggle menu open/close
    function openMenu() {
        menuPanel.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuPanel.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (menuPanel.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Submenu toggles
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentItem = toggle.closest('.has-submenu');
            
            // Close other submenus
            document.querySelectorAll('.has-submenu').forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('open');
                }
            });
            
            // Toggle current submenu
            parentItem.classList.toggle('open');
        });
    });

    // Close menu when clicking on a link
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                setTimeout(() => {
                    closeMenu();
                }, 300);
            }
        });
    });

    // Highlight active menu item based on scroll position
    function updateActiveMenuItem() {
        const sections = document.querySelectorAll('section[id], div[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Update active item on scroll
    window.addEventListener('scroll', updateActiveMenuItem);
    updateActiveMenuItem();

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Initialize Mermaid with custom configuration
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#87A96B',
        primaryTextColor: '#2C3E50',
        primaryBorderColor: '#D4A574',
        lineColor: '#8B7355',
        secondaryColor: '#F8F6F0',
        tertiaryColor: '#FFFFFF',
        background: '#FFFFFF',
        mainBkg: '#F8F6F0',
        secondBkg: '#FFFFFF',
        tertiaryBkg: '#87A96B',
        nodeBkg: '#FFFFFF',
        clusterBkg: '#F8F6F0',
        edgeLabelBackground: '#FFFFFF',
        nodeTextColor: '#2C3E50',
        textColor: '#2C3E50'
    },
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20
    },
    fontSize: 14,
    fontFamily: 'Inter, sans-serif'
});

// ==========================================
// MERMAID CONTROLS (Zoom, Pan, Fullscreen)
// ==========================================
function initializeMermaidControls() {
    const containers = document.querySelectorAll('.mermaid-container');

    containers.forEach(container => {
        const mermaidElement = container.querySelector('.mermaid');
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        // Touch state management
        let isTouch = false;
        let touchStartTime = 0;
        let initialDistance = 0;
        let initialScale = 1;
        let isPinching = false;

        // Zoom controls
        const zoomInBtn = container.querySelector('.zoom-in');
        const zoomOutBtn = container.querySelector('.zoom-out');
        const resetBtn = container.querySelector('.reset-zoom');
        const fullscreenBtn = container.querySelector('.fullscreen');

        function updateTransform() {
            mermaidElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

            if (scale > 1) {
                container.classList.add('zoomed');
            } else {
                container.classList.remove('zoomed');
            }

            mermaidElement.style.cursor = isDragging ? 'grabbing' : 'grab';
        }

        // Zoom In Button
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                scale = Math.min(scale * 1.25, 4);
                updateTransform();
            });
        }

        // Zoom Out Button
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                scale = Math.max(scale / 1.25, 0.3);
                if (scale <= 1) {
                    translateX = 0;
                    translateY = 0;
                }
                updateTransform();
            });
        }

        // Reset Button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform();
            });
        }

        // Fullscreen Button
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            });
        }

        // Mouse Events
        mermaidElement.addEventListener('mousedown', (e) => {
            if (isTouch) return; // Jika perangkat touch, abaikan mouse

            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            mermaidElement.style.cursor = 'grabbing';
            updateTransform();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && !isTouch) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging && !isTouch) {
                isDragging = false;
                mermaidElement.style.cursor = 'grab';
                updateTransform();
            }
        });

        document.addEventListener('mouseleave', () => {
            if (isDragging && !isTouch) {
                isDragging = false;
                mermaidElement.style.cursor = 'grab';
                updateTransform();
            }
        });

        // Wheel zoom
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(Math.max(scale * delta, 0.3), 4);

            // Adjust translation to zoom towards center
            if (newScale !== scale) {
                const scaleDiff = newScale / scale;
                translateX = translateX * scaleDiff;
                translateY = translateY * scaleDiff;
                scale = newScale;

                if (scale <= 1) {
                    translateX = 0;
                    translateY = 0;
                }

                updateTransform();
            }
        });

        // Touch Events - Touch state management
        container.addEventListener('touchstart', (e) => {
            isTouch = true;
            touchStartTime = Date.now();

            if (e.touches.length === 1) {
                // Single finger drag
                isPinching = false;
                isDragging = true;

                const touch = e.touches[0];
                startX = touch.clientX - translateX;
                startY = touch.clientY - translateY;

            } else if (e.touches.length === 2) {
                // Two finger pinch
                isPinching = true;
                isDragging = false;

                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                initialScale = scale;
            }

            e.preventDefault();
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging && !isPinching) {
                // Single finger drag
                const touch = e.touches[0];
                translateX = touch.clientX - startX;
                translateY = touch.clientY - startY;
                updateTransform();

            } else if (e.touches.length === 2 && isPinching) {
                // Two finger pinch
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                if (initialDistance > 0) {
                    const newScale = Math.min(Math.max(
                        initialScale * (currentDistance / initialDistance),
                        0.3
                    ), 4);
                    scale = newScale;
                    updateTransform();
                }
            }

            e.preventDefault();
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
            // Reset state
            if (e.touches.length === 0) {
                isDragging = false;
                isPinching = false;
                initialDistance = 0;

                // Delayed reset isTouch to avoid mouse event immediately after touch
                setTimeout(() => {
                    isTouch = false;
                }, 100);
            } else if (e.touches.length === 1 && isPinching) {
                // Switch from pinch to drag
                isPinching = false;
                isDragging = true;

                const touch = e.touches[0];
                startX = touch.clientX - translateX;
                startY = touch.clientY - translateY;
            }

            updateTransform();
        });

        container.addEventListener('touchcancel', (e) => {
            isDragging = false;
            isPinching = false;
            initialDistance = 0;

            setTimeout(() => {
                isTouch = false;
            }, 100);

            updateTransform();
        });

        // Initialize display
        updateTransform();
    });
}

// ==========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// HOVER EFFECTS FOR CITATION LINKS
// ==========================================
document.querySelectorAll('.citation-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-1px)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ==========================================
// INITIALIZE ON DOM CONTENT LOADED
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu
    initializeMenu();
    
    // Initialize mermaid controls
    initializeMermaidControls();
    
    // Add fade-in animation to elements
    const observerAnim = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.glass-effect, .stat-card, .pull-quote').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observerAnim.observe(el);
    });
});

// ==========================================
// HANDLE WINDOW RESIZE
// ==========================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reinitialize mermaid controls on resize
        initializeMermaidControls();
    }, 250);
});
