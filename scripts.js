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
    const blackLogoPages = ['people', 'about', 'studio', 'projects', 'residential', 'project-detail', 'interiors', 'commercial', 'landscape'];
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

// Gallery functionality
let currentSlide = 0;
let currentGallery = [];

const projectGalleries = {
    "Arjun Residence": [
        { src: "compressed img/arjun/1.avif", caption: "" },
        { src: "compressed img/arjun/2.avif", caption: "" },
        { src: "compressed img/arjun/3.avif", caption: "" },
    ],
    "Church": [
        { src: "compressed img/church/1.avif", caption: "Church project" },
        { src: "compressed img/church/2.avif", caption: "Church interior" },
        { src: "compressed img/church/3.avif", caption: "Church exterior" }
    ],
    // Add all other projects with their respective images
    // ...
};

function openGallery(projectName) {
    const modal = document.getElementById('galleryModal');
    const slidesContainer = document.querySelector('.gallery-slides');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const captionElement = document.getElementById('caption');

    // Clear previous content
    slidesContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';

    // Set current gallery and reset slide index
    currentGallery = projectGalleries[projectName] || [];
    currentSlide = 0;

    // Create slides and thumbnails
    currentGallery.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.caption;
        slide.appendChild(img);
        slidesContainer.appendChild(slide);

        // Create thumbnail
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        if (index === 0) thumb.classList.add('active');
        const thumbImg = document.createElement('img');
        thumbImg.src = image.src;
        thumbImg.alt = `Thumbnail ${index + 1}`;
        thumb.appendChild(thumbImg);
        thumb.addEventListener('click', () => goToSlide(index));
        thumbnailsContainer.appendChild(thumb);
    });

    // Set initial caption
    if (currentGallery.length > 0) {
        captionElement.textContent = currentGallery[0].caption || '';
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // Position the slides correctly
    updateSliderPosition();
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function plusSlides(n) {
    currentSlide = (currentSlide + n + currentGallery.length) % currentGallery.length;
    updateSliderPosition();
}

function goToSlide(n) {
    currentSlide = n;
    updateSliderPosition();
}

function updateSliderPosition() {
    const slidesContainer = document.querySelector('.gallery-slides');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const captionElement = document.getElementById('caption');

    if (slidesContainer && thumbnails && captionElement) {
        // Move slides container to show current slide
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active thumbnail
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentSlide);
        });

        // Update caption
        if (currentGallery[currentSlide]) {
            captionElement.textContent = currentGallery[currentSlide].caption || '';
        }
    }
}

// Initialize gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Attach click handlers to all view project buttons
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function() {
            const projectName = this.closest('.overlay-content').querySelector('h3').textContent;
            openGallery(projectName);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('galleryModal');
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                plusSlides(-1);
            } else if (e.key === 'ArrowRight') {
                plusSlides(1);
            } else if (e.key === 'Escape') {
                closeGallery();
            }
        }
    });

    // Close modal when clicking outside
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGallery();
            }
        });
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

document.addEventListener("DOMContentLoaded", function () {
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const viewMoreBtn = document.getElementById("view-more-btn");

  // Show only the first 6 items initially
  const visibleCount = 6;

  portfolioItems.forEach((item, index) => {
    if (index >= visibleCount) {
      item.style.display = "none";
    }
  });

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function () {
      portfolioItems.forEach(item => {
        item.style.display = "block";
      });
      viewMoreBtn.style.display = "none";
    });
  }
});

// New Gallery Functionality
let newCurrentSlide = 0;
let newCurrentGallery = [];

const newProjectGalleries = {
  "Arjun Residence": [
    { src: "compressed img/arjun/1.avif", caption: "" },
    { src: "compressed img/arjun/2.avif", caption: "" },
    { src: "compressed img/arjun/3.avif", caption: "" },
    { src: "compressed img/arjun/4.avif", caption: "" },
    { src: "compressed img/arjun/5.avif", caption: "" },
    { src: "compressed img/arjun/6.avif", caption: "" },
    { src: "compressed img/arjun/7.avif", caption: "" },
    { src: "compressed img/arjun/8.avif", caption: "" },
    { src: "compressed img/arjun/9.avif", caption: "" },
    { src: "compressed img/arjun/10.avif", caption: "" },
    { src: "compressed img/arjun/11.avif", caption: "" },
    { src: "compressed img/arjun/12.avif", caption: "" },
    { src: "compressed img/arjun/13.avif", caption: "" },
    { src: "compressed img/arjun/14.avif", caption: "" },
  ],
 
  "Sibi": [
    { src: "compressed img/sibi/1.avif", caption: "" },
    { src: "compressed img/sibi/2.avif", caption: "" },
    { src: "compressed img/sibi/3.avif", caption: "" },
    { src: "compressed img/sibi/4.avif", caption: "" },
    { src: "compressed img/sibi/5.avif", caption: "" },
    { src: "compressed img/sibi/6.avif", caption: "" },
    { src: "compressed img/sibi/7.avif", caption: "" },
    { src: "compressed img/sibi/8.avif", caption: "" },
    { src: "compressed img/sibi/9.avif", caption: "" },
    { src: "compressed img/sibi/10.avif", caption: "" },
    { src: "compressed img/sibi/11.avif", caption: "" },
    { src: "compressed img/sibi/12.avif", caption: "" },
    { src: "compressed img/sibi/13.avif", caption: "" },
    { src: "compressed img/sibi/14.avif", caption: "" },
    { src: "compressed img/sibi/15.avif", caption: "" },
    { src: "compressed img/sibi/16.avif", caption: "" },
    { src: "compressed img/sibi/17.avif", caption: "" },
    { src: "compressed img/sibi/18.avif", caption: "" },
    { src: "compressed img/sibi/19.avif", caption: "" },
    { src: "compressed img/sibi/20.avif", caption: "" },
    { src: "compressed img/sibi/21.avif", caption: "" },
    { src: "compressed img/sibi/22.avif", caption: "" },
    { src: "compressed img/sibi/23.avif", caption: "" },
    { src: "compressed img/sibi/24.avif", caption: "" },
    { src: "compressed img/sibi/25.avif", caption: "" },
    { src: "compressed img/sibi/26.avif", caption: "" },
    { src: "compressed img/sibi/27.avif", caption: "" },
    { src: "compressed img/sibi/28.avif", caption: "" },
    { src: "compressed img/sibi/29.avif", caption: "" },
    { src: "compressed img/sibi/30.avif", caption: "" },
    { src: "compressed img/sibi/31.avif", caption: "" }

  ],
  "Kalyan Landscape": [
    { src: "compressed img/KL/1.avif", caption: "" },
    { src: "compressed img/KL/2.avif", caption: "" },
    { src: "compressed img/KL/3.avif", caption: "" },
    { src: "compressed img/KL/4.avif", caption: "" },
    { src: "compressed img/KL/5.avif", caption: "" },
    { src: "compressed img/KL/6.avif", caption: "" },
    { src: "compressed img/KL/7.avif", caption: "" },
    { src: "compressed img/KL/8.avif", caption: "" },
    { src: "compressed img/KL/9.avif", caption: "" },
    { src: "compressed img/KL/10.avif", caption: "" },
    { src: "compressed img/KL/11.avif", caption: "" },
    { src: "compressed img/KL/12.avif", caption: "" },
    { src: "compressed img/KL/13.avif", caption: "" },
    { src: "compressed img/KL/14.avif", caption: "" },
    { src: "compressed img/KL/15.avif", caption: "" },
    { src: "compressed img/KL/16.avif", caption: "" },
    { src: "compressed img/KL/17.avif", caption: "" },
    { src: "compressed img/KL/18.avif", caption: "" },
    { src: "compressed img/KL/19.avif", caption: "" },
    { src: "compressed img/KL/20.avif", caption: "" },
    { src: "compressed img/KL/21.avif", caption: "" },
  ],
  "Sathish": [
    { src: "compressed img/Sathish/1.avif", caption: "" },
    { src: "compressed img/Sathish/2.avif", caption: "" },
    { src: "compressed img/Sathish/3.avif", caption: "" },
    { src: "compressed img/Sathish/4.avif", caption: "" },
    { src: "compressed img/Sathish/5.avif", caption: "" },
    { src: "compressed img/Sathish/6.avif", caption: "" },
    { src: "compressed img/Sathish/7.avif", caption: "" },
    { src: "compressed img/Sathish/8.avif", caption: "" },
    { src: "compressed img/Sathish/9.avif", caption: "" },
    { src: "compressed img/Sathish/10.avif", caption: "" },
    { src: "compressed img/Sathish/11.avif", caption: "" },
    { src: "compressed img/Sathish/12.avif", caption: "" },
    { src: "compressed img/Sathish/13.avif", caption: "" },
    { src: "compressed img/Sathish/14.avif", caption: "" },
    { src: "compressed img/Sathish/15.avif", caption: "" },
    { src: "compressed img/Sathish/16.avif", caption: "" },
    { src: "compressed img/Sathish/17.avif", caption: "" },
    { src: "compressed img/Sathish/18.avif", caption: "" },
    { src: "compressed img/Sathish/19.avif", caption: "" },
  ],
  "Lourde": [
    { src: "compressed img/Lourde/1.avif", caption: "" },
    { src: "compressed img/Lourde/2.avif", caption: "" },
    { src: "compressed img/Lourde/3.avif", caption: "" },
    { src: "compressed img/Lourde/4.avif", caption: "" },
    { src: "compressed img/Lourde/5.avif", caption: "" },
    { src: "compressed img/Lourde/6.avif", caption: "" },
    { src: "compressed img/Lourde/7.avif", caption: "" },
    { src: "compressed img/Lourde/8.avif", caption: "" },
    { src: "compressed img/Lourde/9.avif", caption: "" },
    { src: "compressed img/Lourde/10.avif", caption: "" },
    { src: "compressed img/Lourde/11.avif", caption: "" },
    { src: "compressed img/Lourde/12.avif", caption: "" },
    { src: "compressed img/Lourde/13.avif", caption: "" },
    { src: "compressed img/Lourde/14.avif", caption: "" },
    { src: "compressed img/Lourde/15.avif", caption: "" },
    { src: "compressed img/Lourde/16.avif", caption: "" },
    { src: "compressed img/Lourde/17.avif", caption: "" },
    { src: "compressed img/Lourde/18.avif", caption: "" },
  ],
  "Reco": [
    { src: "compressed img/reco/1.avif", caption: "" },
    { src: "compressed img/reco/2.avif", caption: "" },
    { src: "compressed img/reco/3.avif", caption: "" },
    { src: "compressed img/reco/4.avif", caption: "" },
    { src: "compressed img/reco/5.avif", caption: "" },
    { src: "compressed img/reco/6.avif", caption: "" },
    { src: "compressed img/reco/7.avif", caption: "" },
    { src: "compressed img/reco/8.avif", caption: "" },
    { src: "compressed img/reco/9.avif", caption: "" },
    { src: "compressed img/reco/10.avif", caption: "" },
    { src: "compressed img/reco/11.avif", caption: "" },
    { src: "compressed img/reco/12.avif", caption: "" },
    { src: "compressed img/reco/13.avif", caption: "" },
    { src: "compressed img/reco/14.avif", caption: "" },
    { src: "compressed img/reco/15.avif", caption: "" },
    { src: "compressed img/reco/16.avif", caption: "" },
    { src: "compressed img/reco/17.avif", caption: "" },
    { src: "compressed img/reco/18.avif", caption: "" },
    { src: "compressed img/reco/19.avif", caption: "" },
    { src: "compressed img/reco/20.avif", caption: "" },
  ],
  "Church": [
    { src: "compressed img/church/1.avif", caption: "" },
    { src: "compressed img/church/2.avif", caption: "" },
    { src: "compressed img/church/3.avif", caption: "" },
    { src: "compressed img/church/4.avif", caption: "" },
    { src: "compressed img/church/5.avif", caption: "" },
    { src: "compressed img/church/6.avif", caption: "" },
    { src: "compressed img/church/7.avif", caption: "" },
    { src: "compressed img/church/8.avif", caption: "" },
    { src: "compressed img/church/9.avif", caption: "" },
    { src: "compressed img/church/10.avif", caption: "" },
    { src: "compressed img/church/11.avif", caption: "" },
    { src: "compressed img/church/12.avif", caption: "" },
    { src: "compressed img/church/13.avif", caption: "" },
    { src: "compressed img/church/14.avif", caption: "" },
    { src: "compressed img/church/15.avif", caption: "" },
  ],
  "Clinic": [
    { src: "compressed img/clinic/1.avif", caption: "" },
    { src: "compressed img/clinic/2.avif", caption: "" },
    { src: "compressed img/clinic/3.avif", caption: "" },
    { src: "compressed img/clinic/4.avif", caption: "" },
    { src: "compressed img/clinic/5.avif", caption: "" },
    { src: "compressed img/clinic/6.avif", caption: "" },
    { src: "compressed img/clinic/7.avif", caption: "" },
    { src: "compressed img/clinic/8.avif", caption: "" },
    { src: "compressed img/clinic/9.avif", caption: "" },
    { src: "compressed img/clinic/10.avif", caption: "" },
    { src: "compressed img/clinic/11.avif", caption: "" }

  ],
  "Gym": [
    { src: "compressed img/gym/1.avif", caption: "" },
    { src: "compressed img/gym/2.avif", caption: "" },
    { src: "compressed img/gym/3.avif", caption: "" },
    { src: "compressed img/gym/4.avif", caption: "" },
    { src: "compressed img/gym/5.avif", caption: "" },
    { src: "compressed img/gym/6.avif", caption: "" },
    { src: "compressed img/gym/7.avif", caption: "" },
    { src: "compressed img/gym/8.avif", caption: "" }
  ],
  "Rock": [
    { src: "compressed img/rock/1.avif", caption: "" },
    { src: "compressed img/rock/2.avif", caption: "" },
    { src: "compressed img/rock/3.avif", caption: "" },
    { src: "compressed img/rock/4.avif", caption: "" },
    { src: "compressed img/rock/5.avif", caption: "" },
    { src: "compressed img/rock/6.avif", caption: "" },
  ]

};

function openNewGallery(projectName) {
  const modal = document.getElementById('newGalleryModal');
  const slidesContainer = document.querySelector('.new-gallery-slides');
  const thumbnailsContainer = document.querySelector('.new-gallery-thumbnails');
  const captionElement = document.getElementById('newCaption');

  // Clear previous content
  slidesContainer.innerHTML = '';
  thumbnailsContainer.innerHTML = '';

  // Set current gallery and reset slide index
  newCurrentGallery = newProjectGalleries[projectName] || [];
  newCurrentSlide = 0;

  // Create slides and thumbnails
  newCurrentGallery.forEach((image, index) => {
    // Create slide
    const slide = document.createElement('div');
    slide.className = 'new-gallery-slide';
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.caption;
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    // Create thumbnail
    const thumb = document.createElement('div');
    thumb.className = 'new-gallery-thumbnail';
    if (index === 0) thumb.classList.add('active');
    const thumbImg = document.createElement('img');
    thumbImg.src = image.src;
    thumbImg.alt = `Thumbnail ${index + 1}`;
    thumb.appendChild(thumbImg);
    thumb.addEventListener('click', () => newGoToSlide(index));
    thumbnailsContainer.appendChild(thumb);
  });

  // Set initial caption
  if (newCurrentGallery.length > 0) {
    captionElement.textContent = newCurrentGallery[0].caption || '';
  }
  
  // Show modal
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
  
  // Position the slides correctly
  newUpdateSliderPosition();
}

function closeNewGallery() {
  document.getElementById('newGalleryModal').style.display = 'none';
  document.body.classList.remove('modal-open');
}

function newPlusSlides(n) {
  newCurrentSlide = (newCurrentSlide + n + newCurrentGallery.length) % newCurrentGallery.length;
  newUpdateSliderPosition();
}

function newGoToSlide(n) {
  newCurrentSlide = n;
  newUpdateSliderPosition();
}

function newUpdateSliderPosition() {
  const slidesContainer = document.querySelector('.new-gallery-slides');
  const thumbnails = document.querySelectorAll('.new-gallery-thumbnail');
  const captionElement = document.getElementById('newCaption');

  if (slidesContainer && thumbnails && captionElement) {
    // Move slides container to show current slide
    slidesContainer.style.transform = `translateX(-${newCurrentSlide * 100}%)`;
    
    // Update active thumbnail
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === newCurrentSlide);
    });

    // Update caption
    if (newCurrentGallery[newCurrentSlide]) {
      captionElement.textContent = newCurrentGallery[newCurrentSlide].caption || '';
    }
  }
}

// Initialize new gallery functionality
document.addEventListener('DOMContentLoaded', function() {
  // Attach click handlers to all view project buttons
  document.querySelectorAll('.gallery-view-btn').forEach(button => {
    button.addEventListener('click', function() {
      const projectName = this.closest('.overlay-content').querySelector('h3').textContent;
      openNewGallery(projectName);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('newGalleryModal');
    if (modal && modal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        newPlusSlides(-1);
      } else if (e.key === 'ArrowRight') {
        newPlusSlides(1);
      } else if (e.key === 'Escape') {
        closeNewGallery();
      }
    }
  });

  // Close modal when clicking outside
  const modal = document.getElementById('newGalleryModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeNewGallery();
      }
    });
  }
});