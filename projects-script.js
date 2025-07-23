// CODIVA Projects Portfolio - JavaScript Functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollAnimations();
    initProjectCardInteractions();
    initSmoothScrolling();
    initHeaderEffects();
    
    console.log('🚀 CODIVA Projects Portfolio Loaded Successfully!');
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add staggered animation for project grids
                if (entry.target.classList.contains('projects-grid')) {
                    animateProjectCards(entry.target);
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Apply observer to project grids for staggered animations
    document.querySelectorAll('.projects-grid').forEach(grid => {
        revealObserver.observe(grid);
    });
}

// Animate Project Cards with Staggered Effect
function animateProjectCards(grid) {
    const cards = grid.querySelectorAll('.project-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        }, index * 200);
    });
}

// Project Card Interactions
function initProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Click to navigate to project link
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.project-link')) {
                const link = this.querySelector('.project-link');
                if (link) {
                    // Add click effect
                    this.style.transform = 'translateY(-15px) scale(0.98)';
                    
                    setTimeout(() => {
                        this.style.transform = 'translateY(-15px) scale(1)';
                        // Simulate click on project link
                        showProjectPreview(this);
                    }, 150);
                }
            }
        });

        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Add glow effect to project icon
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // Reset icon
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.filter = 'none';
            }
        });

        // Project link interactions
        const projectLink = card.querySelector('.project-link');
        if (projectLink) {
            projectLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add ripple effect
                createRippleEffect(this, e);
                
                // Show project preview
                setTimeout(() => {
                    showProjectPreview(card);
                }, 300);
            });
        }
    });

    // Tech tag interactions
    document.querySelectorAll('.tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 4px 15px rgba(90, 200, 250, 0.3)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });

        tag.addEventListener('click', function() {
            // Filter projects by technology
            filterProjectsByTech(this.textContent);
        });
    });
}

// Create Ripple Effect
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show Project Preview Modal
function showProjectPreview(card) {
    const title = card.querySelector('.project-title').textContent;
    const description = card.querySelector('.project-description').textContent;
    const features = Array.from(card.querySelectorAll('.project-features li')).map(li => li.textContent);
    const techs = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
    
    // Create modal
    const modal = createProjectModal(title, description, features, techs);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Create Project Modal
function createProjectModal(title, description, features, techs) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-description">${description}</p>
                <div class="modal-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-tech">
                    <h4>Technologies Used:</h4>
                    <div class="modal-tech-tags">
                        ${techs.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-contact">Contact Us About This Project</button>
                <button class="btn-close">Close</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .project-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            margin: 5% auto;
            transform: translateY(30px) scale(0.95);
            transition: all 0.3s ease;
        }
        
        .project-modal.show .modal-content {
            transform: translateY(0) scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .modal-header h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--gray-dark);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .modal-description {
            font-size: 1.1rem;
            color: var(--gray-dark);
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .modal-features h4,
        .modal-tech h4 {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }
        
        .modal-features ul {
            list-style: none;
            padding: 0;
        }
        
        .modal-features li {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
            color: var(--gray-dark);
        }
        
        .modal-features li::before {
            content: '\\f00c';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            color: var(--primary-color);
            margin-right: 0.8rem;
        }
        
        .modal-tech {
            margin-top: 2rem;
        }
        
        .modal-tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .modal-tech-tag {
            background: var(--light-primary);
            color: var(--primary-color);
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .modal-footer {
            padding: 2rem;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .btn-contact,
        .btn-close {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-contact {
            background: var(--primary-color);
            color: white;
        }
        
        .btn-contact:hover {
            background: var(--dark-primary);
            transform: translateY(-2px);
        }
        
        .btn-close {
            background: var(--gray-light);
            color: var(--gray-dark);
        }
        
        .btn-close:hover {
            background: var(--gray-medium);
        }
        
        @media (max-width: 576px) {
            .modal-content {
                width: 95%;
                margin: 2% auto;
            }
            
            .modal-header,
            .modal-body,
            .modal-footer {
                padding: 1.5rem;
            }
            
            .modal-footer {
                flex-direction: column;
            }
            
            .btn-contact,
            .btn-close {
                width: 100%;
            }
        }
    `;
    
    // Add styles to document if not already added
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = modalStyles;
        document.head.appendChild(style);
    }
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.btn-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modal));
    
    modal.querySelector('.btn-contact').addEventListener('click', () => {
        closeModal(modal);
        window.location.href = 'index.html#contact';
    });
    
    return modal;
}

// Close Modal
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Filter Projects by Technology
function filterProjectsByTech(tech) {
    const allCards = document.querySelectorAll('.project-card');
    
    allCards.forEach(card => {
        const cardTechs = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
        
        if (cardTechs.includes(tech)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.95)';
        }
    });
    
    // Show notification
    showNotification(`Showing projects using ${tech}`, 'info');
    
    // Reset filter after 3 seconds
    setTimeout(() => {
        allCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        showNotification('Filter cleared - showing all projects', 'success');
    }, 3000);
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-left: 4px solid var(--primary-color);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem 1.5rem;
        max-width: 400px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Header Effects
function initHeaderEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        // Header background opacity based on scroll
        if (scrollTop > 80) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.12)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        // Hide header on scroll down, show on scroll up (mobile)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility Functions

// Add ripple animation keyframes
function addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-dark);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--gray-dark);
            cursor: pointer;
            margin-left: auto;
            padding: 0.2rem;
            border-radius: 50%;
            transition: background 0.2s ease;
        }
        
        .notification-close:hover {
            background: var(--gray-light);
        }
    `;
    document.head.appendChild(style);
}

// Initialize ripple animation on load
addRippleAnimation();

// Performance optimization for scroll events
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Handle scroll-based animations here
            ticking = false;
        });
        ticking = true;
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Export functions for external use (if needed)
window.CODIVA_Projects = {
    showNotification,
    createProjectModal,
    filterProjectsByTech
};