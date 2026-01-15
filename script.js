// ==========================================
// AZIENDA METALMECCANICA - JAVASCRIPT
// ==========================================

// === NAVBAR FUNCTIONALITY ===
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navCenter = document.querySelector('.nav-center');

// Sticky navbar on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    if (navMenu) navMenu.classList.toggle('active');
    if (navCenter) navCenter.classList.toggle('active');
    document.body.style.overflow = (navMenu && navMenu.classList.contains('active')) ? 'hidden' : '';
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (navCenter) navCenter.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = navCenter ? navCenter.contains(e.target) : (navMenu && navMenu.contains(e.target));
    if (!isClickInsideNav && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (navCenter) navCenter.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if href is just "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.settore-card, .case-study-card, .stat-item');

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
};

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// === STATS COUNTER ANIMATION ===
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
};

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// === TIMELINE INTERACTION ===
const initTimeline = () => {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineProgress = document.getElementById('timelineProgress');
    const processoDetails = document.querySelectorAll('.processo-detail');

    if (timelineSteps.length === 0) return;

    // Funzione per attivare uno step
    const activateStep = (stepNumber) => {
        // Rimuovi active da tutti
        timelineSteps.forEach(step => step.classList.remove('active'));
        processoDetails.forEach(detail => detail.classList.remove('active'));

        // Aggiungi active allo step selezionato
        const selectedStep = document.querySelector(`.timeline-step[data-step="${stepNumber}"]`);
        const selectedDetail = document.querySelector(`.processo-detail[data-detail="${stepNumber}"]`);

        if (selectedStep && selectedDetail) {
            selectedStep.classList.add('active');
            selectedDetail.classList.add('active');

            // Anima la progress bar
            const progressWidth = ((stepNumber - 1) / (timelineSteps.length - 1)) * 90;
            timelineProgress.style.width = `${progressWidth}%`;

            // Marca come completati gli step precedenti
            timelineSteps.forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                if (stepNum < stepNumber) {
                    step.classList.add('completed');
                } else {
                    step.classList.remove('completed');
                }
            });
        }
    };

    // Click handler per ogni step
    timelineSteps.forEach((step) => {
        step.addEventListener('click', () => {
            const stepNumber = parseInt(step.dataset.step);
            activateStep(stepNumber);
        });
    });

    // Attiva il primo step di default
    activateStep(1);
};

// Inizializza timeline quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
} else {
    initTimeline();
}

// === FORM VALIDATION (for contact page) ===
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
        }
    }

    // Phone validation
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput && phoneInput.value) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(phoneInput.value)) {
            isValid = false;
            phoneInput.classList.add('error');
        }
    }

    return isValid;
};

// === LAZY LOADING IMAGES ===
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

lazyLoadImages();

// === BACK TO TOP BUTTON ===
const createBackToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Torna su');
    document.body.appendChild(button);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .back-to-top:hover {
            transform: translateY(-5px);
            background-color: var(--primary-dark);
        }
    `;
    document.head.appendChild(style);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

createBackToTop();

// === PAGE LOAD ANIMATION ===
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// === PREVENT ORPHAN WORDS IN HEADINGS ===
const preventOrphans = () => {
    const headings = document.querySelectorAll('h1, h2, h3');

    headings.forEach(heading => {
        const text = heading.textContent;
        const words = text.split(' ');

        if (words.length > 2) {
            const lastTwo = words.slice(-2).join(' ');
            const rest = words.slice(0, -2).join(' ');
            heading.innerHTML = rest + '&nbsp;' + lastTwo.replace(' ', '&nbsp;');
        }
    });
};

preventOrphans();

// === CONSOLE LOG (remove in production) ===
console.log('%Azienda Metalmeccanica', 'font-size: 20px; font-weight: bold; color: #e74c3c;');
console.log('%cDeveloped by TableHero', 'font-size: 12px; color: #7f8c8d;');
console.log('🔧 Artigiani 4.0 dal 1968');
