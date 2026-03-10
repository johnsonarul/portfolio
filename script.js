// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Initialize Typed.js for the hero section
const typed = new Typed('.typing', {
    strings: [
        'React Enthusiast', 
        'UI/UX Designer', 
        'Problem Solver', 
        'Full-Stack Learner'
    ],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '15px 0';
        navbar.style.background = 'rgba(10, 11, 18, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.background = 'rgba(10, 11, 18, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Menu Toggle (Basic implementation)
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // You would add CSS for .nav-links.active to show the menu on mobile
    alert('Mobile menu functionality can be expanded with more CSS!');
});

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Submission (Mockup)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate API Call
        setTimeout(() => {
            alert('Thank you, Johnson! Your message has been "sent" (simulation).');
            contactForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

// Add hover effect for skill tags
const skillTags = document.querySelectorAll('.skill-tags span');
skillTags.forEach(tag => {
    tag.addEventListener('mouseover', () => {
        tag.style.transform = 'scale(1.1) translateY(-5px)';
    });
    tag.addEventListener('mouseout', () => {
        tag.style.transform = 'scale(1) translateY(0)';
    });
});
