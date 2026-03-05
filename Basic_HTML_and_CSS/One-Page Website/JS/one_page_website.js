// Slideshow + Lightbox for Raw Cat Food website
document.addEventListener('DOMContentLoaded', function () {

    // --- MAIN ELEMENTS ---
    const slides = document.querySelectorAll('.main-slide'); // all main slides (images & video)
    const thumbnails = document.querySelectorAll('.thumbnail'); // all thumbnail images
    const prevButton = document.querySelector('.slide-prev'); // left arrow button
    const nextButton = document.querySelector('.slide-next'); // right arrow button
    const currentDisplay = document.querySelector('.current-slide'); // counter: current slide
    const totalDisplay = document.querySelector('.total-slides'); // counter: total slides

    // Lightbox elements
    const lightbox = document.getElementById('lightbox-modal'); // lightbox modal container
    const lightboxImage = document.querySelector('.lightbox-image'); // img element inside lightbox
    const lightboxVideoContainer = document.querySelector('.lightbox-video-container'); // div container for video
    const lightboxVideo = document.querySelector('.lightbox-video'); // iframe for video
    const lightboxClose = document.querySelector('.lightbox-close'); // close button
    const lightboxPrev = document.querySelector('.lightbox-prev'); // left arrow in lightbox
    const lightboxNext = document.querySelector('.lightbox-next'); // right arrow in lightbox

    // --- STATE VARIABLES ---
    let currentSlideIndex = 0; // tracks current slide
    const totalSlides = slides.length; // total number of slides

    // Update the total slide counter in UI
    if (totalDisplay) totalDisplay.textContent = totalSlides;

    // --- HELPER FUNCTION: SHOW SLIDE ---
    function showSlide(index) {
        // Wrap around if index is out of bounds
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;

        // Remove "active" class from all slides and thumbnails
        slides.forEach(slide => slide.classList.remove('active'));
        thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));

        // Activate the selected slide
        slides[index].classList.add('active');
        thumbnails[index].classList.add('active');

        // Scroll the active thumbnail into view
        thumbnails[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });

        // Update current slide counter
        if (currentDisplay) currentDisplay.textContent = index + 1;

        // Update the global current slide index
        currentSlideIndex = index;
    }

    // --- NAVIGATION BUTTONS ---
    if (prevButton) {
        prevButton.addEventListener('click', function (e) {
            e.preventDefault(); // prevent default link behavior
            showSlide(currentSlideIndex - 1); // show previous slide
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            showSlide(currentSlideIndex + 1); // show next slide
        });
    }

    // --- THUMBNAIL CLICK ---
    thumbnails.forEach((thumbnail, i) => {
        thumbnail.addEventListener('click', function (e) {
            e.preventDefault();
            showSlide(i); // show the slide corresponding to clicked thumbnail
        });
    });

    // --- SLIDE CLICK: OPEN LIGHTBOX ---
    slides.forEach((slide, i) => {
        slide.addEventListener('click', function (e) {
            if (e.target.tagName === 'IFRAME') return; // don't open lightbox when clicking on video controls
            openLightbox(i); // open the clicked slide in lightbox
        });
    });

    // --- LIGHTBOX FUNCTIONS ---
    function openLightbox(index) {
        const slide = slides[index]; // get slide element
        const type = slide.dataset.type; // "image" or "video"
        const src = slide.dataset.src; // source URL

        lightbox.classList.add('active'); // show modal
        lightbox.dataset.currentIndex = index; // track current slide in lightbox

        if (type === 'image') {
            lightboxImage.style.display = 'block';
            lightboxVideoContainer.style.display = 'none';
            lightboxImage.src = src; // set image source
            lightboxVideo.src = ''; // clear video
        } else {
            lightboxImage.style.display = 'none';
            lightboxVideoContainer.style.display = 'block';
            const iframe = slide.querySelector('iframe');
            if (iframe) lightboxVideo.src = iframe.src; // set video source
        }

        // Disable page scroll while lightbox is open
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxVideo.src = ''; // stop video
        lightboxImage.src = ''; // clear image
        document.body.style.overflow = 'auto'; // restore scroll
    }

    // Change slide inside lightbox
    function lightboxShow(index) {
        const slide = slides[index];
        const type = slide.dataset.type;
        const src = slide.dataset.src;

        if (type === 'image') {
            lightboxImage.style.display = 'block';
            lightboxVideoContainer.style.display = 'none';
            lightboxImage.src = src;
            lightboxVideo.src = '';
        } else {
            lightboxImage.style.display = 'none';
            lightboxVideoContainer.style.display = 'block';
            const iframe = slide.querySelector('iframe');
            if (iframe) lightboxVideo.src = iframe.src;
        }

        lightbox.dataset.currentIndex = index; // update lightbox index
    }

    function lightboxNextSlide() {
        let idx = parseInt(lightbox.dataset.currentIndex);
        idx = (idx + 1) % totalSlides; // wrap around
        lightboxShow(idx);
    }

    function lightboxPrevSlide() {
        let idx = parseInt(lightbox.dataset.currentIndex);
        idx = (idx - 1 + totalSlides) % totalSlides; // wrap around
        lightboxShow(idx);
    }

    // --- LIGHTBOX EVENT LISTENERS ---
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', lightboxNextSlide);
    if (lightboxPrev) lightboxPrev.addEventListener('click', lightboxPrevSlide);

    // Close lightbox when clicking outside content
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // --- KEYBOARD NAVIGATION ---
    document.addEventListener('keydown', function (e) {
        if (lightbox.classList.contains('active')) {
            // Lightbox controls
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') lightboxPrevSlide();
            else if (e.key === 'ArrowRight') lightboxNextSlide();
        } else {
            // Main slideshow controls
            if (e.key === 'ArrowLeft') showSlide(currentSlideIndex - 1);
            else if (e.key === 'ArrowRight') showSlide(currentSlideIndex + 1);
        }
    });

    // --- INITIALIZE ---
    showSlide(0); // start with the first slide
});
