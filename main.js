// ========================================
// Main JavaScript - Miyabi Portfolio
// ========================================

class MiyabiApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupTheme();
        this.setupAudio();
        this.setupHTMX();
        this.setupAnimations();
        this.setupFormHandling();
    }
    
    setupTheme() {
        const themeBtn = document.getElementById('theme-btn');
        const sunIcon = themeBtn?.querySelector('.sun-icon');
        const moonIcon = themeBtn?.querySelector('.moon-icon');
        const body = document.body;
        
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('miyabi-theme') || 'dark';
        this.applyTheme(savedTheme, sunIcon, moonIcon);
        
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                this.applyTheme(newTheme, sunIcon, moonIcon);
                localStorage.setItem('miyabi-theme', newTheme);
            });
        }
    }
    
    applyTheme(theme, sunIcon, moonIcon) {
        const body = document.body;
        
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            body.removeAttribute('data-theme');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
        
        // Update sakura colors for theme
        this.updateSakuraColors(theme);
    }
    
    updateSakuraColors(theme) {
        // The sakura system will adapt via CSS variables
        // This method can be extended for dynamic color changes
        const sakuraCanvas = document.getElementById('sakura-canvas');
        if (sakuraCanvas && window.sakuraSystem) {
            // Trigger a re-render with new colors if needed
            window.sakuraSystem.updateTheme(theme);
        }
    }
    
    setupNavigation() {
        // Update active nav state based on current section
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
        
        // Scroll-based section detection
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNav(sectionId);
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    
    updateActiveNav(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    }
    
    setupAudio() {
        const audioBtn = document.getElementById('audio-btn');
        const ambientAudio = document.getElementById('ambient-audio');
        
        if (audioBtn && ambientAudio) {
            audioBtn.addEventListener('click', () => {
                if (ambientAudio.paused) {
                    ambientAudio.volume = 0.3;
                    ambientAudio.play().catch(() => {
                        console.log('Audio autoplay prevented');
                    });
                    audioBtn.classList.add('active');
                } else {
                    ambientAudio.pause();
                    audioBtn.classList.remove('active');
                }
            });
        }
    }
    
    setupHTMX() {
        // HTMX event handlers for smooth transitions
        document.body.addEventListener('htmx:beforeRequest', () => {
            document.body.classList.add('htmx-loading');
        });
        
        document.body.addEventListener('htmx:afterSwap', (evt) => {
            document.body.classList.remove('htmx-loading');
            
            // Re-initialize section-specific scripts
            const target = evt.detail.target;
            const section = target.querySelector('.section');
            
            if (section) {
                this.initializeSection(section.id);
            }
            
            // Trigger entrance animations
            this.triggerEntranceAnimations(target);
        });
        
        document.body.addEventListener('htmx:load', () => {
            document.body.classList.remove('htmx-loading');
        });
    }
    
    initializeSection(sectionId) {
        switch(sectionId) {
            case 'garden':
                this.initGardenAnimations();
                break;
            case 'scroll':
                this.initScrollSection();
                break;
            case 'ryokan':
                this.initRyokanAnimations();
                break;
        }
    }
    
    initGardenAnimations() {
        // Staggered stone animations
        const stones = document.querySelectorAll('.garden-stone');
        stones.forEach((stone, index) => {
            stone.style.opacity = '0';
            stone.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                stone.style.transition = 'all 0.6s ease';
                stone.style.opacity = '1';
                stone.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Stone flip on click
        stones.forEach(stone => {
            stone.addEventListener('click', () => {
                stone.classList.toggle('flipped');
            });
        });
    }
    
    initScrollSection() {
        const scrollContainer = document.querySelector('.emakimono-scroll');
        if (!scrollContainer) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.classList.add('active');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.classList.remove('active');
        });
        
        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.classList.remove('active');
        });
        
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
            this.updateScrollProgress(scrollContainer);
        });
        
        // Scroll wheel horizontal scroll
        scrollContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY;
            this.updateScrollProgress(scrollContainer);
        });
        
        // Navigation buttons
        const prevBtn = document.querySelector('.scroll-nav-btn.prev');
        const nextBtn = document.querySelector('.scroll-nav-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
                setTimeout(() => this.updateScrollProgress(scrollContainer), 300);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
                setTimeout(() => this.updateScrollProgress(scrollContainer), 300);
            });
        }
        
        // Panel entrance animations
        const panels = document.querySelectorAll('.scroll-panel');
        const panelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.5 });
        
        panels.forEach(panel => panelObserver.observe(panel));
        
        // Initial progress update
        this.updateScrollProgress(scrollContainer);
    }
    
    updateScrollProgress(container) {
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (!progressBar || !container) return;
        
        const scrollWidth = container.scrollWidth - container.clientWidth;
        const scrolled = container.scrollLeft;
        const progress = (scrolled / scrollWidth) * 100;
        progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
    
    initRyokanAnimations() {
        // Shoji door opening animation
        const shojiPaper = document.querySelector('.shoji-paper');
        if (shojiPaper) {
            shojiPaper.style.opacity = '0';
            shojiPaper.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                shojiPaper.style.transition = 'all 0.8s ease';
                shojiPaper.style.opacity = '1';
                shojiPaper.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Lantern sway animation
        const lantern = document.querySelector('.hanging-lantern');
        if (lantern) {
            lantern.style.animation = 'sway 4s ease-in-out infinite';
        }
        
        // Stamp entrance
        const stamps = document.querySelectorAll('.ink-stamp');
        stamps.forEach((stamp, index) => {
            stamp.style.opacity = '0';
            stamp.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                stamp.style.transition = 'all 0.4s ease';
                stamp.style.opacity = '1';
                stamp.style.transform = 'translateY(0)';
            }, 600 + index * 100);
        });
    }
    
    setupAnimations() {
        // Initial page load animations
        gsap.registerPlugin();
        
        // Animate gate content on load
        const gateContent = document.querySelector('.gate-content');
        if (gateContent) {
            gsap.from('.torii-gate', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });
            
            gsap.from('.hero-text > *', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                delay: 0.5,
                ease: 'power2.out'
            });
            
            gsap.from('.gate-cta', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                delay: 1.2,
                ease: 'power2.out'
            });
        }
    }
    
    triggerEntranceAnimations(container) {
        const elements = container.querySelectorAll('.section-title, .section-subtitle, .garden-stone, .scroll-panel, .shoji-form, .ink-info');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 80);
        });
    }
    
    setupFormHandling() {
        // Contact form handling
        document.addEventListener('submit', (e) => {
            const form = e.target.closest('.contact-form');
            if (form) {
                e.preventDefault();
                
                // Show success message
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Sent!</span><span class="btn-kanji">届</span>';
                submitBtn.style.background = 'rgba(46, 204, 113, 0.2)';
                submitBtn.style.borderColor = '#2ecc71';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    form.reset();
                }, 3000);
            }
        });
    }
}

// Make updateActiveNav globally available for HTMX onclick handlers
window.updateActiveNav = function(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.miyabiApp = new MiyabiApp();
});
