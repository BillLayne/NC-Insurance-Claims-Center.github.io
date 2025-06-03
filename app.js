// NC Insurance Claims Guide - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for sticky navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbarMenu && navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Copy phone numbers to clipboard
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('data-phone');
            
            if (phoneNumber) {
                // Create a temporary input element to copy the phone number
                const tempInput = document.createElement('input');
                tempInput.value = phoneNumber;
                document.body.appendChild(tempInput);
                tempInput.select();
                
                try {
                    document.execCommand('copy');
                    showNotification(`Phone number ${formatPhoneNumber(phoneNumber)} copied to clipboard!`);
                    
                    // Update button text temporarily
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.background = 'var(--color-success)';
                    this.style.color = 'white';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                        this.style.color = '';
                    }, 2000);
                    
                } catch (err) {
                    showNotification('Failed to copy phone number. Please copy manually.', 'error');
                }
                
                document.body.removeChild(tempInput);
            }
        });
    });
    
    // Emergency call functionality
    const emergencyCallButtons = document.querySelectorAll('.emergency-call-btn');
    emergencyCallButtons.forEach(button => {
        button.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('data-phone');
            if (phoneNumber) {
                window.location.href = `tel:${phoneNumber}`;
            }
        });
    });
    
    // Format phone number for display
    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.length === 10) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
        } else if (phoneNumber.length === 3) {
            return phoneNumber; // For 911
        }
        return phoneNumber;
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            
            // Set notification style based on type
            if (type === 'error') {
                notification.style.background = 'var(--color-error)';
            } else {
                notification.style.background = 'var(--color-success)';
            }
            
            notification.classList.add('show');
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    // Add click-to-call functionality for all phone numbers
    const phoneNumbers = document.querySelectorAll('.phone-number span, .emergency-number span');
    phoneNumbers.forEach(phoneSpan => {
        const phoneText = phoneSpan.textContent.trim();
        
        // Extract phone number from text (remove emojis and formatting)
        const phoneMatch = phoneText.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{3})/);
        
        if (phoneMatch && phoneMatch[1]) {
            const cleanPhone = phoneMatch[1].replace(/[-.\s]/g, '');
            phoneSpan.style.cursor = 'pointer';
            phoneSpan.style.textDecoration = 'underline';
            phoneSpan.title = 'Click to call';
            
            phoneSpan.addEventListener('click', function() {
                window.location.href = `tel:${cleanPhone}`;
            });
        }
    });
    
    // Add animation to step cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe step cards for animation
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add hover effects to company cards
    const companyCards = document.querySelectorAll('.company-card');
    companyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape' && navbarMenu && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
        
        // Press 'C' to copy first visible phone number
        if (e.key === 'c' && e.ctrlKey && e.shiftKey) {
            const firstCopyBtn = document.querySelector('.copy-btn[data-phone]');
            if (firstCopyBtn) {
                firstCopyBtn.click();
            }
        }
    });
    
    // Add print functionality
    function addPrintButton() {
        const printButton = document.createElement('button');
        printButton.textContent = '🖨️ Print Guide';
        printButton.className = 'btn btn--outline';
        printButton.style.position = 'fixed';
        printButton.style.bottom = '20px';
        printButton.style.right = '20px';
        printButton.style.zIndex = '1000';
        printButton.title = 'Print this guide';
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        document.body.appendChild(printButton);
    }
    
    // Add print button on larger screens
    if (window.innerWidth > 768) {
        addPrintButton();
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile menu on resize to larger screen
            if (window.innerWidth > 768 && navbarMenu && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }, 250);
    });
    
    // Add scroll-to-top functionality
    let scrollToTopButton;
    
    function createScrollToTopButton() {
        scrollToTopButton = document.createElement('button');
        scrollToTopButton.innerHTML = '↑';
        scrollToTopButton.className = 'scroll-to-top';
        scrollToTopButton.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-primary);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollToTopButton);
    }
    
    createScrollToTopButton();
    
    // Show/hide scroll-to-top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });
    
    // Add enhanced accessibility features
    function enhanceAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content id
        const mainSection = document.querySelector('.hero');
        if (mainSection) {
            mainSection.id = 'main-content';
        }
        
        // Improve button accessibility
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });
        
        // Add role attributes where needed
        const cards = document.querySelectorAll('.step-card, .company-card, .resource-card');
        cards.forEach(card => {
            card.setAttribute('role', 'article');
        });
    }
    
    enhanceAccessibility();
    
    // Add focus management for better keyboard navigation
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Initialize focus trapping for mobile menu when open
    if (navbarMenu) {
        navbarMenu.addEventListener('keydown', function(e) {
            if (this.classList.contains('active') && e.key === 'Tab') {
                trapFocus(this);
            }
        });
    }
    
    // Add performance optimization for scroll events
    let ticking = false;
    
    function updateScrollElements() {
        // Update any scroll-dependent elements here
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate);
    
    // Initialize page
    console.log('NC Insurance Claims Guide loaded successfully');
    
    // Add analytics tracking for user interactions (placeholder)
    function trackInteraction(action, element) {
        // Placeholder for analytics tracking
        console.log(`User interaction: ${action} on ${element}`);
    }
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('button, .btn')) {
            trackInteraction('click', e.target.textContent || e.target.className);
        }
    });
    
});

// Service Worker registration for offline functionality (basic)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}