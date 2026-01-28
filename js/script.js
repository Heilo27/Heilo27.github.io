// HeiloProjects Main Script

(function() {
    'use strict';

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('nav-open');
            this.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                mobileMenuBtn.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"></circle>
                </svg>
                <span>Sending...</span>
            `;

            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simulate form submission (replace with actual API call)
            try {
                // In production, replace this with actual form submission
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success state
                showFormSuccess(contactForm);
            } catch (error) {
                // Show error state
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                alert('Something went wrong. Please try again or email us directly.');
            }
        });
    }

    function showFormSuccess(form) {
        form.innerHTML = `
            <div class="form-success">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. We'll get back to you within 1-2 business days.</p>
            </div>
        `;
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .app-card, .value-item').forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    // Add CSS for fade-in animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .spinner {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .form-success {
            text-align: center;
            padding: 40px 20px;
        }
        .form-success svg {
            margin-bottom: 24px;
        }
        .form-success h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--accent);
            margin-bottom: 8px;
        }
        .form-success p {
            color: var(--text-muted);
            max-width: 320px;
            margin: 0 auto;
        }
        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 64px;
                left: 0;
                right: 0;
                background: var(--card-bg);
                border-bottom: 1px solid var(--border);
                padding: 24px;
                flex-direction: column;
                gap: 0;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .nav-links.nav-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
                display: flex;
            }
            .nav-links li {
                border-bottom: 1px solid var(--border-subtle);
            }
            .nav-links li:last-child {
                border-bottom: none;
            }
            .nav-links a {
                display: block;
                padding: 16px 0;
                font-size: 1.125rem;
            }
            .mobile-menu-btn.menu-open span:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
            }
            .mobile-menu-btn.menu-open span:nth-child(2) {
                opacity: 0;
            }
            .mobile-menu-btn.menu-open span:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
            }
        }
    `;
    document.head.appendChild(style);

})();
