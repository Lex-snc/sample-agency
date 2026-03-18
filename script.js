document.addEventListener('DOMContentLoaded', () => {

    // 0. Scroll Transparency for Navigation
    const header = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Hamburger Animation (Optional simple toggle)
        hamburger.classList.toggle('toggle');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 2. Smooth Scroll Reveal Animation (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Run once
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 3. Dynamic Typewriter Effect in Hero
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["convert.", "inspire.", "disrupt."];
    const typingDelay = 100;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start typing effect on load
    if (textArray.length) setTimeout(type, newTextDelay + 250);
    
    // 4. Enhanced Form Functionality
    const contactForm = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.querySelector('.submit-btn');
    const btnContent = document.querySelector('.btn-content');
    const btnLoading = document.querySelector('.btn-loading');
    
    // Character counter
    if (messageTextarea && charCount) {
        const maxChars = 500;
        
        messageTextarea.addEventListener('input', () => {
            const currentLength = messageTextarea.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > maxChars * 0.9) {
                charCount.parentElement.classList.add('warning');
            } else {
                charCount.parentElement.classList.remove('warning');
            }
            
            if (currentLength > maxChars) {
                messageTextarea.value = messageTextarea.value.substring(0, maxChars);
                charCount.textContent = maxChars;
            }
        });
    }
    
    // Form validation and submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Basic validation
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                const formGroup = field.closest('.form-group');
                formGroup.classList.add('error');
                isValid = false;
                
                // Remove error after 3 seconds
                setTimeout(() => {
                    formGroup.classList.remove('error');
                }, 3000);
            }
        });
        
        if (!isValid) {
            // Shake the form
            contactForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                contactForm.style.animation = '';
            }, 500);
            return;
        }
        
        // Show loading state
        btnContent.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        
        // Show loading modal
        Swal.fire({
            title: 'Sending your message...',
            html: 'Please wait while we process your submission.',
            allowOutsideClick: false,
            showConfirmButton: false,
            background: '#0a0a0c',
            color: '#ffffff',
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-text'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Prepare form data
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch('https://formspree.io/f/xgonpjjv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Reset button state
            btnContent.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            
            if (response.ok) {
                // Add success animation to form wrapper
                const formWrapper = document.querySelector('.form-wrapper');
                formWrapper.classList.add('success');
                setTimeout(() => {
                    formWrapper.classList.remove('success');
                }, 600);
                
                // Close loading modal
                Swal.close();
                
                // Show success modal
                Swal.fire({
                    title: 'Message Sent! 🎉',
                    html: 'Thank you for reaching out!<br>We\'ll get back to you within 24 hours.',
                    icon: 'success',
                    confirmButtonText: 'Awesome!',
                    background: '#0a0a0c',
                    color: '#ffffff',
                    confirmButtonColor: '#ff5e14',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-confirm'
                    }
                });
                
                // Reset form
                contactForm.reset();
                if (charCount) {
                    charCount.textContent = '0';
                }
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Reset button state
            btnContent.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            
            // Close loading modal
            Swal.close();
            
            // Show error modal
            Swal.fire({
                title: 'Oops! 😅',
                html: 'Something went wrong.<br>Please try again or contact us directly.',
                icon: 'error',
                confirmButtonText: 'Try Again',
                background: '#0a0a0c',
                color: '#ffffff',
                confirmButtonColor: '#ff5e14',
                customClass: {
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    confirmButton: 'custom-swal-confirm'
                }
            });
        }
    });
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // 5. Process Steps Animation
    const processSteps = document.querySelectorAll('.step');
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const stepNumber = entry.target.querySelector('.step-number');
                const stepProgress = entry.target.querySelector('.step-progress');
                
                // Animate number with delay
                setTimeout(() => {
                    if (stepNumber) {
                        stepNumber.style.animation = 'countUp 1s ease-out forwards';
                    }
                }, index * 200);
                
                // Animate progress bar
                setTimeout(() => {
                    if (stepProgress) {
                        stepProgress.style.transform = 'scaleX(1)';
                    }
                }, index * 200 + 500);
            }
        });
    }, { threshold: 0.5 });
    
    processSteps.forEach(step => processObserver.observe(step));

    // 6. Testimonials Slide-in Animation
    const testimonials = document.querySelectorAll('.testimonial-item');
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });
    
    // Set initial state for animations
    testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateX(50px)';
        testimonial.style.transition = 'all 0.8s ease-out';
        testimonialObserver.observe(testimonial);
    });

    // Particle Effect for Hero and Sections
    const heroCanvas = document.getElementById('particle-canvas');
    const sectionCanvases = document.querySelectorAll('.section-particles');
    
    // Initialize hero particles
    if (heroCanvas) {
        initCanvasParticles(heroCanvas);
    }
    
    // Initialize section particles
    sectionCanvases.forEach(canvas => {
        initCanvasParticles(canvas);
    });
    
    function initCanvasParticles(canvas) {
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        let particles = [];
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = 'rgba(255, 94, 20, 0.15)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
        
        // Handle resize
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                canvas.width = entry.contentRect.width;
                canvas.height = entry.contentRect.height;
                initParticles();
            }
        });
        resizeObserver.observe(canvas.parentElement);
    }
});