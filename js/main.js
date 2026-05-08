/**
 * Unity MicroFund - Main JavaScript
 * Shariah Compliant Micro Investment Platform
 */

// ========================================
// DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initSmoothScroll();
    initProjectFilters();
    initFormValidation();
    initBackToTop();
    initModal();
    initFooterAccordion();
    initFAQs();
    initTestimonials();
});

// ========================================
// Testimonials - Dynamic CSV Loading
// ========================================
async function initTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;

    const csvFile = window.location.pathname.includes('index-bn') 
        ? 'sources/member/memberSpeechBn.csv' 
        : 'sources/member/memberSpeech.csv';

    try {
        const response = await fetch(csvFile);
        if (!response.ok) throw new Error('Failed to load CSV');
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        if (data.length < 2) return;
        
        const headers = data[0].map(h => h.toLowerCase().trim());
        const rows = data.slice(1).filter(row => row.length >= headers.length);
        
        generateTestimonialCards(container, rows, headers);
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function parseCSV(text) {
    const result = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                cell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(cell.trim());
            cell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (cell || row.length > 0) {
                row.push(cell.trim());
                result.push(row);
                row = [];
                cell = '';
            }
            if (char === '\r' && nextChar === '\n') i++;
        } else if (char !== '\r') {
            cell += char;
        }
    }
    
    if (cell || row.length > 0) {
        row.push(cell.trim());
        result.push(row);
    }
    
    return result;
}

function generateTestimonialCards(container, rows, headers) {
    const index = {
        name: headers.indexOf('member name'),
        designation: headers.indexOf('designation'),
        company: headers.indexOf('company'),
        area: headers.indexOf('area'),
        image: headers.indexOf('member image'),
        text: headers.indexOf('member speech text')
    };
    
    rows.forEach(row => {
        const name = row[index.name] || '';
        const designation = row[index.designation] || '';
        const company = row[index.company] || '';
        const area = row[index.area] || '';
        const imageFile = row[index.image] || 'default.jpg';
        const speechText = row[index.text] || '';
        
        const imagePath = `sources/member/${imageFile}`;
        
        const card = createTestimonialCard({
            name, designation, company, area, imagePath, speechText
        });
        
        container.appendChild(card);
    });
    
    // Duplicate for infinite scroll effect
    rows.forEach(row => {
        const name = row[index.name] || '';
        const designation = row[index.designation] || '';
        const company = row[index.company] || '';
        const area = row[index.area] || '';
        const imageFile = row[index.image] || 'default.jpg';
        const speechText = row[index.text] || '';
        
        const imagePath = `sources/member/${imageFile}`;
        
        const card = createTestimonialCard({
            name, designation, company, area, imagePath, speechText
        });
        
        container.appendChild(card);
    });
}

function createTestimonialCard(data) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <div class="testimonial-top">
            <img src="${data.imagePath}" alt="${data.name}" class="testimonial-avatar-img" onerror="this.src='https://randomuser.me/api/portraits/men/32.jpg'">
            <div class="testimonial-info">
                <h4>${data.name}</h4>
                <div class="testimonial-detail">
                    <i class="fas fa-briefcase"></i>
                    <span>${data.designation}</span>
                </div>
                <div class="testimonial-detail">
                    <i class="fas fa-building"></i>
                    <span>${data.company}</span>
                </div>
                <div class="testimonial-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${data.area}</span>
                </div>
            </div>
        </div>
        <div class="testimonial-text-wrapper">
            <p class="testimonial-text">"${data.speechText}"</p>
        </div>
    `;
    return card;
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ========================================
// Scroll Effects
// ========================================
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.value-card, .step, .project-card, .policy-card').forEach(el => {
        observer.observe(el);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }, 500);
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#register') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========================================
// Project Filters
// ========================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('fade-in-up');
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ========================================
// Form Validation
// ========================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showFormSuccess(this);
            }
        });
    });
    
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (input) {
            input.addEventListener('focus', function() {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    group.classList.remove('focused');
                }
            });
            
            if (input.value) {
                group.classList.add('focused');
            }
        }
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
        
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }
        
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;
            if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });
    
    return isValid;
}

function showFormSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-check"></i> Submitted';
    btn.style.background = 'var(--success)';
    btn.style.borderColor = 'var(--success)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
    }, 3000);
}

// ========================================
// Back to Top
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// Modal Functions
// ========================================
function initModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const policyCards = document.querySelectorAll('.policy-card');
    
    if (!overlay || !closeBtn) return;
    
    policyCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(modalId) {
    const overlay = document.getElementById('modal-overlay');
    const contents = document.querySelectorAll('.modal-content');
    
    contents.forEach(content => content.classList.remove('active'));
    
    const targetModal = document.getElementById('modal-' + modalId);
    if (targetModal) {
        targetModal.classList.add('active');
    }
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// Footer Accordion
// ========================================
function initFooterAccordion() {
    const columns = document.querySelectorAll('.footer-column');
    
    columns.forEach(column => {
        const header = column.querySelector('.footer-column-header');
        
        if (header) {
            header.addEventListener('click', function() {
                const isActive = column.classList.contains('active');
                
                // Close all columns
                columns.forEach(col => col.classList.remove('active'));
                
                // Toggle current column
                if (!isActive) {
                    column.classList.add('active');
                }
            });
        }
    });
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}