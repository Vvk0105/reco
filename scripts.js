// Loader
const loaderContainer = document.querySelector('.loader-container');
const pageContents = document.querySelector('#page-contents');

window.addEventListener('load', () => {
    loaderContainer.classList.add('hidden');
    pageContents.classList.add('visible');
});

// Service Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const togglePageBtn = document.getElementById('toggle-page');
    const servicesPage = document.getElementById('services-page');
    const welcomeSection = document.getElementById('welcome-section');
    let isOnHomePage = true;

    if(togglePageBtn && servicesPage && welcomeSection) {
        togglePageBtn.addEventListener('click', () => {
            isOnHomePage = !isOnHomePage;
            servicesPage.classList.toggle('active', !isOnHomePage);
            welcomeSection.classList.toggle('hidden', !isOnHomePage);
        });
    }

    // Service links hover effect
    const serviceLinks = document.querySelectorAll(".service-container ul li a");
    serviceLinks.forEach(link => {
        link.addEventListener("mouseover", () => {
            link.style.color = "#ff4b2b";
            link.style.transform = "scale(1.1)";
        });
        link.addEventListener("mouseout", () => {
            link.style.color = "#fff";
            link.style.transform = "scale(1)";
        });
    });

    // Scroll animations
    const sections = document.querySelectorAll('section');
    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        section.classList.add('fade-in-hidden');
        intersectionObserver.observe(section);
    });

    // Fixed nav when service menu is active
    const nav = document.querySelector("nav");
    const serviceContainer = document.querySelector(".service-container");

    if(nav && serviceContainer) {
        const mutationObserver = new MutationObserver(() => {
            nav.classList.toggle("nav-fixed", serviceContainer.classList.contains("active"));
        });
        mutationObserver.observe(serviceContainer, { attributes: true, attributeFilter: ["class"] });
    }

    // Logo color switching
    const logo = document.querySelector('.logo-top');
    // const servicesPage = document.getElementById('services-page');
    const blackLogoPages = ['people', 'contact', 'about', 'studio'];
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];

    if(logo) {
        // Initial logo setup
        if (blackLogoPages.includes(currentPage)) {
            logo.src = 'Logo/reco logo black.webp';
        } else {
            logo.src = 'Logo/reco logo white.webp';
        }

        // Watch for service section activation
        if(servicesPage) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('active')) {
                        logo.src = 'Logo/reco logo white.webp';
                    } else {
                        if (blackLogoPages.includes(currentPage)) {
                            logo.src = 'Logo/reco logo black.webp';
                        } else {
                            logo.src = 'Logo/reco logo white.webp';
                        }
                    }
                });
            });
            observer.observe(servicesPage, { attributes: true, attributeFilter: ['class'] });
        }
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitButton = document.getElementById('submitButton');
            
            if(submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if(data.success) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error sending message. Please try again.');
                }
            } catch (error) {
                alert('Network error. Please try again.');
            } finally {
                if(submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }
        });
    }

    // Fullscreen image viewer for projects
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    if(fullscreenOverlay) {
        const fullscreenImage = document.getElementById('fullscreen-image');
        const closeOverlay = document.getElementById('close-overlay');
        
        document.querySelectorAll('.view-project').forEach(button => {
            button.addEventListener('click', function() {
                const imageUrl = this.getAttribute('data-image');
                fullscreenImage.src = imageUrl;
                fullscreenOverlay.style.display = 'flex';
            });
        });

        closeOverlay.addEventListener('click', () => {
            fullscreenOverlay.style.display = 'none';
        });

        fullscreenOverlay.addEventListener('click', (e) => {
            if(e.target === fullscreenOverlay) {
                fullscreenOverlay.style.display = 'none';
            }
        });
    }
});

// Scroll animations for about page
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-fade');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };
    
    if(revealElements.length > 0) {
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }
});