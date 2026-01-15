// ==========================================
// CAROUSEL SETTORI - JAVASCRIPT (V2 FIXED)
// ==========================================

class Carousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        if (!this.container) return;

        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
        this.prevBtn = this.container.querySelector('.carousel-btn.prev');
        this.nextBtn = this.container.querySelector('.carousel-btn.next');

        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Event listeners per i bottoni
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.stopAutoPlay();
                this.prev();
                this.startAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.stopAutoPlay();
                this.next();
                this.startAutoPlay();
            });
        }

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // Responsive
        window.addEventListener('resize', () => {
            this.updateCarousel();
        });

        // Initial render
        this.updateCarousel();

        // Start autoplay
        this.startAutoPlay();
    }

    updateCarousel() {
        const isMobile = window.innerWidth < 768;
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 32; // 2rem in px

        // Calcola l'offset basandosi sulla slide corrente
        let offset;

        if (isMobile) {
            // Mobile: mostra una slide alla volta, centrata
            offset = -this.currentIndex * (slideWidth + gap);
        } else {
            // Desktop: mostra 3 slide, con quella centrale più grande
            // Offset per centrare la slide corrente nel viewport
            const containerWidth = this.container.offsetWidth;
            offset = -(this.currentIndex * (slideWidth + gap)) + (containerWidth / 2) - (slideWidth / 2);
        }

        this.track.style.transform = `translateX(${offset}px)`;

        // Applica classi per styling
        this.slides.forEach((slide, index) => {
            slide.classList.remove('center', 'side');

            if (isMobile) {
                // Mobile: la slide corrente è center
                if (index === this.currentIndex) {
                    slide.classList.add('center');
                }
            } else {
                // Desktop: centrale più grande, laterali più piccole
                if (index === this.currentIndex) {
                    slide.classList.add('center');
                } else if (index === this.currentIndex - 1 || index === this.currentIndex + 1) {
                    slide.classList.add('side');
                }
            }
        });
    }

    next() {
        this.isTransitioning = true;
        this.currentIndex++;

        // Loop: torna all'inizio quando arriva alla fine
        if (this.currentIndex >= this.slides.length) {
            this.currentIndex = 0;
        }

        this.updateCarousel();

        // Reset transitioning flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600); // Match CSS transition duration
    }

    prev() {
        this.isTransitioning = true;
        this.currentIndex--;

        // Loop: vai all'ultima quando vai indietro dalla prima
        if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
        }

        this.updateCarousel();

        // Reset transitioning flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    startAutoPlay() {
        this.stopAutoPlay(); // Previeni multipli interval
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000); // Cambia slide ogni 4 secondi
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Carousel();
    });
} else {
    new Carousel();
}

// Lightbox per immagini
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');

    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const img = slide.querySelector('img');
            if (!img) return;

            // Crea lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox-close" aria-label="Chiudi">&times;</button>
                </div>
            `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Aggiungi stili lightbox se non esistono
            if (!document.getElementById('lightbox-styles')) {
                const style = document.createElement('style');
                style.id = 'lightbox-styles';
                style.textContent = `
                    .lightbox {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: fadeIn 0.3s ease;
                    }

                    .lightbox-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0,0,0,0.9);
                        cursor: pointer;
                    }

                    .lightbox-content {
                        position: relative;
                        max-width: 90%;
                        max-height: 90vh;
                        z-index: 2;
                        animation: zoomIn 0.3s ease;
                    }

                    .lightbox-content img {
                        max-width: 100%;
                        max-height: 90vh;
                        object-fit: contain;
                        border-radius: 8px;
                        box-shadow: 0 10px 50px rgba(0,0,0,0.5);
                    }

                    .lightbox-close {
                        position: absolute;
                        top: -40px;
                        right: 0;
                        background: none;
                        border: none;
                        color: white;
                        font-size: 40px;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: transform 0.2s ease;
                    }

                    .lightbox-close:hover {
                        transform: scale(1.2);
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes zoomIn {
                        from { 
                            opacity: 0;
                            transform: scale(0.8); 
                        }
                        to { 
                            opacity: 1;
                            transform: scale(1); 
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            // Close handlers
            const close = () => {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            lightbox.querySelector('.lightbox-close').addEventListener('click', close);
            lightbox.querySelector('.lightbox-overlay').addEventListener('click', close);

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    close();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
});