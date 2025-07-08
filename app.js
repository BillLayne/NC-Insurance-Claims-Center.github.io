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

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar-content')) {
                navbarMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking on a nav link
        const menuLinks = document.querySelectorAll('.navbar-menu .nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
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
        card.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
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
    
    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Track interaction (only if function exists)
            if (typeof trackInteraction === 'function') {
                trackInteraction('faq-toggle', this.querySelector('span').textContent);
            }
        });
        
        // Allow keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
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
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchResults = document.getElementById('searchResults');
    
    // Search data - compile all searchable content
    const searchData = [
        // Insurance companies with comprehensive information
        { 
            title: 'Alamance Farmers\' Mutual', 
            desc: 'Regional NC insurance carrier', 
            type: 'company',
            generalPhone: '1-336-226-7872',
            claimsPhone: '1-336-226-7872',
            website: 'https://alamancefarmers.com',
            paymentUrl: 'https://alamancefarmers.com/policyholders/',
            appStore: 'https://apps.apple.com/us/app/afmic-policyholder-portal/id1537256584',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.afmic.policyholder'
        },
        { 
            title: 'Allstate', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-800-255-7828',
            claimsPhone: '1-800-669-2214',
            website: 'https://www.allstate.com',
            paymentUrl: 'https://www.allstate.com/myaccount',
            appStore: 'https://apps.apple.com/us/app/allstate-mobile/id376476389',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.allstate.view'
        },
        { 
            title: 'American Modern', 
            desc: 'Specialized property insurance', 
            type: 'company',
            generalPhone: '1-800-543-2644',
            claimsPhone: '1-800-375-2075',
            website: 'https://www.amig.com',
            paymentUrl: 'https://policyholders.amig.com/content/munichre/amiggrp/policy-holder/storefront/en/landing-page/make-a-payment.html',
            appStore: null,
            googlePlay: null
        },
        { 
            title: 'Chubb', 
            desc: 'Premium insurance coverage', 
            type: 'company',
            generalPhone: 'Contact via local agent',
            claimsPhone: '1-800-252-4670',
            website: 'https://www.chubb.com',
            paymentUrl: 'https://www.chubb.com/securePersonal/login?redirect=true',
            appStore: 'https://apps.apple.com/us/app/chubb-mobile/id1348381518',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.chubb.na.prsautocard'
        },
        { 
            title: 'Dairyland', 
            desc: 'Affordable auto insurance', 
            type: 'company',
            generalPhone: '1-800-334-0090',
            claimsPhone: '1-800-334-0090',
            website: 'https://www.dairylandinsurance.com',
            paymentUrl: 'https://www.dairylandinsurance.com/make-a-payment',
            appStore: 'https://apps.apple.com/us/app/dairyland/id1499324843',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.dairyland.mobile'
        },
        { 
            title: 'Erie Insurance', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-800-458-0811',
            claimsPhone: '1-800-367-3743',
            website: 'https://www.erieinsurance.com',
            paymentUrl: 'https://www.erieinsurance.com/support-center/billing-and-payments',
            appStore: 'https://apps.apple.com/us/app/erie-insurance-mobile/id1447206059',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.erieinsurance.customermobile'
        },
        { 
            title: 'Foremost', 
            desc: 'Specialty insurance solutions', 
            type: 'company',
            generalPhone: '1-800-527-3905',
            claimsPhone: '1-800-527-3907',
            website: 'https://www.foremost.com',
            paymentUrl: 'https://www.foremost.com/payonline/',
            appStore: 'https://apps.apple.com/us/app/foremost-insurance-mobile/id1455533198',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.foremost.app'
        },
        { 
            title: 'GEICO', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-800-861-8380',
            claimsPhone: '1-800-861-8380',
            website: 'https://www.geico.com',
            paymentUrl: 'https://www.geico.com/information/make-a-payment/',
            appStore: 'https://apps.apple.com/us/app/geico-mobile-car-insurance/id331763306',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.geico.mobile'
        },
        { 
            title: 'The Hartford', 
            desc: 'AARP partner insurance carrier', 
            type: 'company',
            generalPhone: '1-800-423-6789',
            claimsPhone: '1-800-243-5860',
            website: 'https://www.thehartford.com',
            paymentUrl: 'https://account.thehartford.com/customer/',
            appStore: 'https://apps.apple.com/us/app/the-hartford-mobile/id1435233346',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.thehartford.mobile'
        },
        { 
            title: 'Liberty Mutual', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-800-290-7933',
            claimsPhone: '1-800-225-2467',
            website: 'https://www.libertymutual.com',
            paymentUrl: 'https://www.libertymutual.com/customer-support/billing-and-payment-options',
            appStore: 'https://apps.apple.com/us/app/liberty-mutual-mobile/id453676947',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.libertymutual.lm_android'
        },
        { 
            title: 'National General', 
            desc: 'Affordable coverage options', 
            type: 'company',
            generalPhone: '1-888-293-5108',
            claimsPhone: '1-800-468-3466',
            website: 'https://nationalgeneral.com',
            paymentUrl: 'https://service.nationalgeneral.com/QuickPay/',
            appStore: 'https://apps.apple.com/us/app/natgen-mobile/id1495393910',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.nationalgeneral.natgenmobile'
        },
        { 
            title: 'Nationwide', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-877-669-6877',
            claimsPhone: '1-800-421-3535',
            website: 'https://www.nationwide.com',
            paymentUrl: 'https://www.nationwide.com/personal/contact/pay-bill-details',
            appStore: 'https://apps.apple.com/us/app/nationwide-mobile/id311627534',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.nationwide.mobile.android.nwmobile'
        },
        { 
            title: 'NC Grange Mutual', 
            desc: 'Local NC insurance carrier', 
            type: 'company',
            generalPhone: '1-800-394-1236',
            claimsPhone: '1-800-394-1236 (press 3)',
            website: 'https://www.ncgrangemutual.com',
            paymentUrl: 'Contact Agent',
            appStore: null,
            googlePlay: null
        },
        { 
            title: 'Progressive', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-888-671-4405',
            claimsPhone: '1-800-776-4737',
            website: 'https://www.progressive.com',
            paymentUrl: 'https://account.apps.progressive.com/access/ez-payment/policy-info',
            appStore: 'https://apps.apple.com/us/app/progressive/id357563236',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.phonevalley.progressive'
        },
        { 
            title: 'Safeco', 
            desc: 'Liberty Mutual company', 
            type: 'company',
            generalPhone: '1-800-332-3226',
            claimsPhone: '1-800-332-3226',
            website: 'https://www.safeco.com',
            paymentUrl: 'https://www.safeco.com/customer-resources/customer-support/billing-payment',
            appStore: 'https://apps.apple.com/us/app/safeco-mobile/id1162648539',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.safecoinsurance.consumer'
        },
        { 
            title: 'State Farm', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-800-782-8332',
            claimsPhone: '1-800-732-5246',
            website: 'https://www.statefarm.com',
            paymentUrl: 'https://www.statefarm.com/customer-care/insurance-bill-pay',
            appStore: 'https://apps.apple.com/us/app/state-farm/id318211812',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.statefarm.pocketagent'
        },
        { 
            title: 'Travelers', 
            desc: '24/7 Claims Support Available', 
            type: 'company',
            generalPhone: '1-800-842-5075',
            claimsPhone: '1-800-252-4633',
            website: 'https://www.travelers.com',
            paymentUrl: 'https://www.travelers.com/pay-your-bill',
            appStore: 'https://apps.apple.com/us/app/travelers-mobile/id441862402',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.travelers.digitalservice'
        },
        { 
            title: 'Universal Property', 
            desc: 'Property insurance specialist', 
            type: 'company',
            generalPhone: '1-800-425-9113',
            claimsPhone: '1-800-470-0599',
            website: 'https://universalproperty.com',
            paymentUrl: 'https://customer.universalproperty.com/',
            appStore: 'https://apps.apple.com/us/app/upcic-mobile/id972768393',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.universalproperty.android'
        },
        { 
            title: 'USAA', 
            desc: 'Military members and families', 
            type: 'company',
            generalPhone: '1-210-531-8722',
            claimsPhone: '1-800-531-8722',
            website: 'https://www.usaa.com',
            paymentUrl: 'https://www.usaa.com/my/logon',
            appStore: 'https://apps.apple.com/us/app/usaa-mobile/id322383343',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.usaa.mobile.android.usaa'
        },
        // Topics
        { title: 'Auto Claims Process', desc: 'Step-by-step guide for filing auto insurance claims', type: 'topic', section: '#auto-claims' },
        { title: 'Home Claims Process', desc: 'Step-by-step guide for filing home insurance claims', type: 'topic', section: '#home-claims' },
        { title: 'NC Minimum Coverage', desc: '50/100/50 - Bodily Injury and Property Damage requirements', type: 'topic', section: '#resources' },
        { title: 'NC Insurance Points Calculator', desc: 'Calculate how violations affect your insurance rates', type: 'topic', section: '#points-system' },
        { title: 'Car Value Finder', desc: 'Find your car\'s Kelley Blue Book value instantly', type: 'topic', section: '#car-value' },
        { title: 'Emergency Contacts', desc: '911 Emergency Services, NC State Highway Patrol', type: 'topic', section: '#emergency' },
        { title: 'Accident Reports', desc: 'NC State Highway Patrol online accident reports', type: 'topic', section: '#resources' },
        { title: 'Tips and Preparation', desc: 'What to keep in your car and important documents', type: 'topic', section: '.tips-section' },
        { title: 'FAQ', desc: 'Frequently asked questions about insurance claims', type: 'topic', section: '#faq' }
    ];
    
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        const results = searchData.filter(item => {
            const searchString = `${item.title} ${item.desc}`.toLowerCase();
            return searchString.includes(query.toLowerCase());
        });
        
        if (results.length > 0) {
            displaySearchResults(results);
        } else {
            displayNoResults();
        }
    }
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        results.forEach(result => {
            const resultItem = document.createElement('div');
            
            if (result.type === 'company') {
                // Enhanced display for insurance companies
                resultItem.className = 'search-result-item company-result';
                resultItem.innerHTML = `
                    <div class="company-header">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-desc">${result.desc}</div>
                    </div>
                    <div class="company-details">
                        <div class="contact-section">
                            <div class="phone-numbers">
                                ${result.generalPhone !== 'Contact via local agent' ? `
                                    <div class="phone-item">
                                        <span class="phone-label">General:</span>
                                        <a href="tel:${result.generalPhone.replace(/\D/g,'')}" class="phone-link">
                                            <svg class="phone-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                            ${result.generalPhone}
                                        </a>
                                    </div>
                                ` : `<div class="phone-item"><span class="phone-label">General:</span> ${result.generalPhone}</div>`}
                                ${result.claimsPhone ? `
                                    <div class="phone-item">
                                        <span class="phone-label">Claims:</span>
                                        <a href="tel:${result.claimsPhone.replace(/\D/g,'')}" class="phone-link claims-phone">
                                            <svg class="phone-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                            ${result.claimsPhone}
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div class="action-buttons">
                            ${result.website ? `
                                <a href="${result.website}" target="_blank" class="action-btn website-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                    Website
                                </a>
                            ` : ''}
                            ${result.paymentUrl !== 'Contact Agent' ? `
                                <a href="${result.paymentUrl}" target="_blank" class="action-btn payment-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                    Pay Bill
                                </a>
                            ` : ''}
                            ${(result.appStore || result.googlePlay) ? `
                                <div class="app-links">
                                    ${result.appStore ? `
                                        <a href="${result.appStore}" target="_blank" class="action-btn app-btn" title="Download on App Store">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                            </svg>
                                            iOS
                                        </a>
                                    ` : ''}
                                    ${result.googlePlay ? `
                                        <a href="${result.googlePlay}" target="_blank" class="action-btn app-btn" title="Get it on Google Play">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                                            </svg>
                                            Android
                                        </a>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else {
                // Regular display for topics
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-desc">${result.desc}</div>
                `;
                
                resultItem.addEventListener('click', () => {
                    if (result.type === 'topic' && result.section) {
                        // Navigate to section
                        const targetSection = document.querySelector(result.section);
                        if (targetSection) {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            searchResults.classList.remove('active');
                            searchInput.value = '';
                        }
                    }
                });
            }
            
            searchResults.appendChild(resultItem);
        });
        searchResults.classList.add('active');
    }
    
    function displayNoResults() {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-title">No results found</div>
                <div class="search-result-desc">Try searching for insurance company names or topics like "auto claims"</div>
            </div>
        `;
        searchResults.classList.add('active');
    }
    
    // Search event listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(e.target.value);
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                searchResults.classList.remove('active');
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }
    
    // NC Insurance Points Calculator
    // NC Insurance Points rate increase percentages
    const rateIncreases = {
        0: 0,
        1: 30,
        2: 45,
        3: 60,
        4: 80,
        5: 110,
        6: 135,
        7: 165,
        8: 195,
        9: 225,
        10: 260,
        11: 295,
        12: 340
    };

    // Points calculator form submission handler
    const pointsCalcForm = document.getElementById('points-calculator-form');
    if (pointsCalcForm) {
        pointsCalcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculatePointsImpact();
        });
    }

    // Format currency for points calculator
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Calculate impact function
    function calculatePointsImpact() {
        // Get input values
        const currentPremium = parseFloat(document.getElementById('current-premium').value);
        const violationType = document.getElementById('violation-type');
        const selectedOption = violationType.options[violationType.selectedIndex];
        
        if (!currentPremium || !violationType.value) {
            return;
        }

        // Extract points from violation value
        const points = parseInt(violationType.value);
        const violationText = selectedOption.text;
        
        // Get rate increase percentage
        const increasePercentage = rateIncreases[points] || 0;
        
        // Calculate new premium and increase
        const increaseAmount = (currentPremium * increasePercentage) / 100;
        const newPremium = currentPremium + increaseAmount;
        
        // Update results
        document.getElementById('violation-name').textContent = violationText;
        document.getElementById('points-value').textContent = points;
        document.getElementById('increase-percentage').textContent = increasePercentage + '%';
        document.getElementById('annual-increase').textContent = formatCurrency(increaseAmount);
        document.getElementById('new-premium').textContent = formatCurrency(newPremium);
        
        // Update impact bar
        const impactFill = document.getElementById('impact-fill');
        const impactPercentageDisplay = document.getElementById('impact-percentage');
        const fillWidth = Math.min((increasePercentage / 340) * 100, 100);
        
        // Show results with animation
        const resultsSection = document.getElementById('results');
        resultsSection.classList.add('show');
        
        // Animate the bar after a short delay
        setTimeout(() => {
            impactFill.style.width = fillWidth + '%';
            impactPercentageDisplay.textContent = increasePercentage + '%';
        }, 100);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Add input formatting for premium field
    const premiumInput = document.getElementById('current-premium');
    if (premiumInput) {
        premiumInput.addEventListener('blur', function() {
            if (this.value) {
                const value = parseFloat(this.value);
                if (!isNaN(value)) {
                    this.value = value.toFixed(2);
                }
            }
        });
    }

    // Auto-calculate when violation is selected (if premium is already entered)
    const violationSelect = document.getElementById('violation-type');
    if (violationSelect) {
        violationSelect.addEventListener('change', function() {
            const premium = document.getElementById('current-premium').value;
            if (premium && this.value) {
                calculatePointsImpact();
            }
        });
    }

    // Car Value Finder Functionality
    const carValueForm = document.getElementById('carValueForm');
    if (carValueForm) {
        carValueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const year = document.getElementById('year').value;
            const make = document.getElementById('make').value;
            const modelInput = document.getElementById('model').value.trim();
            
            // Format the values for KBB URL
            const makeFormatted = make.toLowerCase().replace(/ /g, '-');
            const modelFormatted = modelInput.toLowerCase().replace(/ /g, '-');
            
            // Construct KBB URL
            const kbbUrl = `https://www.kbb.com/${makeFormatted}/${modelFormatted}/${year}/`;
            
            // Open in new tab
            window.open(kbbUrl, '_blank', 'noopener,noreferrer');
            
            // Show notification
            showNotification('Opening Kelley Blue Book for your vehicle valuation...', 'success');
        });
    }
    
    // Model input validation - allow only alphanumeric, spaces, and hyphens
    const modelInput = document.getElementById('model');
    if (modelInput) {
        modelInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9\s-]/g, '');
        });
    }
    
    // ZIP code input validation
    const zipInput = document.getElementById('zipcode');
    if (zipInput) {
        zipInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 5) {
                this.value = this.value.slice(0, 5);
            }
        });
    }
    
    // Remove scroll animations - all content visible on load
    
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