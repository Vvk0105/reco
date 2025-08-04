document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("galleryModal");
    const slidesContainer = document.querySelector(".gallery-slides");
    const thumbnailsContainer = document.querySelector(".thumbnails");
    const captionElement = document.getElementById("caption");
    let currentSlide = 0;
    let currentGallery = [];

    const projectGalleries = {
    "Sukrithi": [
        { src: "compressed img/arjun/IMG_9181.avif" },
        { src: "compressed img/arjun/75747932-5885-4991-85de-b46393dab273.avif" },
        { src: "compressed img/arjun/4213b530-2344-4e69-ac5c-2b5a31595aeb.avif" }
    ],
    "Split Skin": [
        { src: "residential/split_skin/1.webp" },
        { src: "residential/split_skin/2.webp" },
        { src: "residential/split_skin/3.webp" }
    ],
    "Ekam": [
        { src: "residential/ekam/1.webp" },
        { src: "residential/ekam/2.webp" },
        { src: "residential/ekam/3.webp" }
    ]
    };

    // Project captions mapped separately
    const projectCaptions = {
    "Sukrithi": `Design and Execution: RECO Architects<br>
                Project Type: Residential<br>
                Location: Murinjapalam, Trivandrum<br>
                Design Lead: Ar. Nikhil Suresh`,
    "Split Skin": `Design and Execution: RECO Architects<br>
                    Project Type: Residential<br>
                    Location: Vellayambalam, Trivandrum<br>
                    Design Lead: Ar. Nikhil Suresh`,
    "Ekam": `Design and Execution: RECO Architects<br>
            Project Type: Residential<br>
            Location: Pangode, Trivandrum<br>
            Design Lead: Ar. Nikhil Suresh`
    };

    function openGallery(projectName) {
    const modal = document.getElementById('galleryModal');
    const slidesContainer = document.querySelector('.gallery-slides');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const captionElement = document.getElementById('caption');

    slidesContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';
    
    currentGallery = projectGalleries[projectName] || [];
    slides = [];
    thumbnails = [];

    currentGallery.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = `Slide ${index + 1}`;
        
        slide.appendChild(img);
        slidesContainer.appendChild(slide);
        slides.push(slide);

        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        thumbnail.onclick = () => goToSlide(index);

        const thumbImg = document.createElement('img');
        thumbImg.src = image.src;
        thumbImg.alt = `Thumbnail ${index + 1}`;
        
        thumbnail.appendChild(thumbImg);
        thumbnailsContainer.appendChild(thumbnail);
        thumbnails.push(thumbnail);
    });

    // Set the static project metadata as caption
    captionElement.innerHTML = projectCaptions[projectName] || "";

    modal.style.display = 'flex';
    currentSlide = 0;
    updateSliderPosition();

    document.body.classList.add('modal-open');
    }

    function updateGallery() {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        // captionElement.textContent = currentGallery[currentSlide].caption;

        document.querySelectorAll(".thumbnail").forEach((thumb, idx) => {
            thumb.classList.toggle("active", idx === currentSlide);
        });
    }

    function goToSlide(n) {
        if (n < 0) n = currentGallery.length - 1;
        if (n >= currentGallery.length) n = 0;
        currentSlide = n;
        updateGallery();
    }

    function closeGallery() {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    document.querySelectorAll(".view-project").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.project;
            openGallery(name);
        });
    });

    document.querySelector(".close-modal").addEventListener("click", closeGallery);
    document.querySelector(".prev").addEventListener("click", () => goToSlide(currentSlide - 1));
    document.querySelector(".next").addEventListener("click", () => goToSlide(currentSlide + 1));

    document.addEventListener("keydown", e => {
        if (modal.style.display === "flex") {
            if (e.key === "Escape") closeGallery();
            else if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
            else if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
        }
    });
});

document.getElementById("galleryModal").addEventListener("click", (e) => {
  if (e.target.id === "galleryModal") {
    closeGallery();
  }
});