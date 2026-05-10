// ============================================
// GEN-Z FUTURISTIC PORTFOLIO - MAIN JS
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // LOADER ANIMATION
    // ============================================
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    }

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower && window.innerWidth > 968) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        });

        const hoverElements = document.querySelectorAll('a, button, .project-card, .nav-link, .social-link');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
                cursorFollower.style.borderColor = '#dc143c';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.borderColor = 'rgba(220, 20, 60, 0.5)';
            });
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // MOBILE MENU TOGGLE - FULLY FIXED
    // ============================================
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }
        });
    }

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (menuBtn && !menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = 'auto';
            }
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968) {
            if (menuBtn) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = 'auto';
            }
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navLinks && navLinks.classList.contains('active')) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = 'auto';
            }
        }
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // STAT COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            updateNumber();
        });
    }

    const statsSection = document.querySelector('.hero-stats');
    let animated = false;

    function checkStats() {
        if (!animated && statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                animateNumbers();
                animated = true;
            }
        }
    }

    window.addEventListener('scroll', checkStats);
    checkStats();

    // ============================================
    // SKILL BARS ANIMATION
    // ============================================
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    function animateSkills() {
        if (!skillsAnimated) {
            const skillsSection = document.querySelector('#skills');
            if (skillsSection) {
                const rect = skillsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-skill');
                        bar.style.width = width + '%';
                    });
                    skillsAnimated = true;
                }
            }
        }
    }

    window.addEventListener('scroll', animateSkills);
    animateSkills();

    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // EXPLORE BUTTON SCROLL
    // ============================================
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ============================================
    // CONTACT FORM SUBMISSION
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[placeholder="Your Name"]').value;
            const email = this.querySelector('input[placeholder="Your Email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (name && email && message) {
                alert('✨ Thank you ' + name + '! Your message has been sent. I\'ll get back to you soon!');
                this.reset();
            } else {
                alert('⚠️ Please fill in all fields!');
            }
        });
    }

    // ============================================
    // PARALLAX EFFECT ON HERO
    // ============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const spheres = document.querySelectorAll('.gradient-sphere, .gradient-sphere-2');
        spheres.forEach((sphere, index) => {
            const speed = index === 0 ? 0.5 : 0.3;
            sphere.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // PROJECT CARD HOVER 3D EFFECT
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ============================================
    // TYPING ANIMATION FOR CODE WINDOW
    // ============================================
    const codeLines = document.querySelectorAll('.code-line');
    if (codeLines.length > 0) {
        codeLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
            line.style.transition = `all 0.3s ease ${index * 0.1}s`;
            
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, 500 + (index * 100));
        });
    }

    // ============================================
    // PREVENT RIGHT CLICK ON IMAGES
    // ============================================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });

    // ============================================
    // ADD GLOW EFFECT ON SCROLL
    // ============================================
    const sectionsToGlow = document.querySelectorAll('.skill-category, .project-card, .about-content');
    
    function checkGlow() {
        sectionsToGlow.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                section.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2)';
            }
        });
    }
    
    window.addEventListener('scroll', checkGlow);
    checkGlow();

    // ============================================
    // DYNAMIC YEAR IN FOOTER
    // ============================================
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.innerHTML = `© ${year} | Built with 💻 by Bhavy Panchal`;
    }

    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================
    console.log('%c⚡ BHAVY PANCHAL - FUTURISTIC PORTFOLIO', 'color: #dc143c; font-size: 20px; font-weight: bold;');
    console.log('%cWelcome to my digital space! 🚀', 'color: #ffffff; font-size: 14px;');
    console.log('%cCheck out my work and feel free to connect!', 'color: #a1a1aa; font-size: 12px;');

    // ============================================
    // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ============================================
    const fadeElements = document.querySelectorAll('.skill-category, .project-card, .about-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// PRELOADER FOR IMAGES
// ============================================
window.addEventListener('load', function() {
    console.log('✅ Portfolio fully loaded!');
});
