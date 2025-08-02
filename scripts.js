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
    const blackLogoPages = ['people', 'about', 'studio', 'projects'];
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

let currentSlide = 0;
let currentGallery = [];
let slides = [];
let thumbnails = [];

const projectGalleries = {
    "Arjun Residence": [
        { src: "compressed img/arjun/75747932-5885-4991-85de-b46393dab273.avif", caption: "" },
        { src: "compressed img/arjun/4213b530-2344-4e69-ac5c-2b5a31595aeb.avif", caption: "" },
        { src: "compressed img/arjun/IMG_9181.avif", caption: "" },
    ],
    "Church": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Concordia": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Dental Clinic": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Gym Hyd": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Kalyan Landscape": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Lourde": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Reco": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Sathish": [
        { src: "compressed img/IMG_0911.webp", caption: "dadsa" },
        { src: "compressed img/IMG_0911.webp", caption: "fdsfdsf" },
        { src: "compressed img/IMG_0911.webp", caption: "fsdfdsf" }
    ],
    "Sibi": [
        { src: "compressed img/sibi/IMG_9383.avif", caption: "dadsa" },
        { src: "compressed img/sibi/IMG_9510.avif", caption: "fdsfdsf" },
        { src: "compressed img/sibi/IMG_9438.avif", caption: "fsdfdsf" }
    ],
};

function openGallery(projectName) {
    const modal = document.getElementById('galleryModal');
    const slidesContainer = document.querySelector('.gallery-slides');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const captionElement = document.getElementById('caption');

    slidesContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';

    currentGallery = projectGalleries[projectName];
    slides = [];
    thumbnails = [];

    currentGallery.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.innerHTML = `<img src="${image.src}" alt="${image.caption}">`;
        slidesContainer.appendChild(slide);
        slides.push(slide);

        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        if (index === 0) thumb.classList.add('active');
        thumb.innerHTML = `<img src="${image.src}" alt="Thumbnail ${index + 1}">`;
        thumb.onclick = () => goToSlide(index);
        thumbnailsContainer.appendChild(thumb);
        thumbnails.push(thumb);
    });

    captionElement.textContent = currentGallery[0]?.caption || '';
    modal.style.display = 'flex';
    currentSlide = 0;
    updateSliderPosition();
    document.body.classList.add('modal-open');
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function plusSlides(n) {
    goToSlide(currentSlide + n);
}

function goToSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    updateSliderPosition();
}

function updateSliderPosition() {
    const slidesContainer = document.querySelector('.gallery-slides');
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlide);
    });
    document.getElementById('caption').textContent = currentGallery[currentSlide]?.caption || '';
}

document.querySelectorAll('.view-project').forEach(button => {
    button.addEventListener('click', function () {
        const projectName = this.closest('.overlay-content').querySelector('h3').textContent;
        openGallery(projectName);
    });
});

document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('galleryModal');
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') plusSlides(-1);
        else if (e.key === 'ArrowRight') plusSlides(1);
        else if (e.key === 'Escape') closeGallery();
    }
});


document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.portfolio-slider');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (slider && prevBtn && nextBtn) {
    let currentIndex = 0;
    const itemWidth = portfolioItems[0].offsetWidth + 30; // width + gap
    
    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      
      // Disable prev button if at start
      prevBtn.disabled = currentIndex === 0;
      
      // Disable next button if at end (showing last full item)
      nextBtn.disabled = currentIndex >= portfolioItems.length - Math.floor(slider.offsetWidth / itemWidth);
    }
    
    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });
    
    nextBtn.addEventListener('click', function() {
      if (currentIndex < portfolioItems.length - 1) {
        currentIndex++;
        updateSlider();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      itemWidth = portfolioItems[0].offsetWidth + 30;
      updateSlider();
    });
    
    // Initialize
    updateSlider();
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        // Swipe left - next
        if (currentIndex < portfolioItems.length - 1) {
          currentIndex++;
          updateSlider();
        }
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe right - prev
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      }
    }
  }
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  loader.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
});