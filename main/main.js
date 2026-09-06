document.addEventListener('DOMContentLoaded', () => {
    // Restore saved theme before anything renders
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    const sections = document.querySelectorAll('section:not(#first)'); // Select all sections except the first one

    // Apply typing effect to elements in the first section on load
    const firstSectionTypingElements = document.querySelectorAll('#first .typing-effect');
    firstSectionTypingElements.forEach(el => {
        startTyping(el);
    });

    // Initialize IntersectionObserver for other sections (for fade-in + typing effect)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-hidden');
                
                // Trigger typing effect on text within the intersecting section
                const typingElements = entry.target.querySelectorAll('.typing-effect');
                typingElements.forEach((el, index) => {
                    startTyping(el, index);
                });
                
                // Add fade-in effect once the section is visible
                const fadeInElements = entry.target.querySelectorAll('.fade-in');
                fadeInElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible'); // Add the class to trigger fade-in with delay
                    }, index * 300); // Stagger the fade-in by 300ms per element
                });
            } 
        });
    }, { threshold: 0.3 }); // Trigger when 30% of the section is in view

    // Observe all sections except the first one
    sections.forEach(section => {
        observer.observe(section);
    });

    // Typing effect function
    function startTyping(element, index) {
        const text = element.textContent;
        element.textContent = '';
        let currentIndex = 0;

        // Adjust typing speed with index delay
        function type() {
            if (currentIndex < text.length) {
                element.textContent += text.charAt(currentIndex);
                currentIndex++;
                setTimeout(type, 75); // Adjust typing speed here
            } else {
                // Remove the caret after typing is finished
                element.classList.remove('typing-effect');
            }
        }
        setTimeout(type, index * 300); // Delay each typing effect by index * 300ms
    }

    // Initialize Owl Carousel after DOM is fully loaded
    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        margin: 24,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1      // 1 card on mobile screens
            },
            1000: {
                items: 2      // 2 cards side by side on larger screens
            }
        }
    });

    const footerYear = document.getElementById("footer-year");
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // Sky parallax: feed scroll progress (0..1) to the layers, which translate
    // at different rates. Progress rather than raw pixels keeps the travel
    // bounded however long the page gets.
    const sky = document.getElementById("sky");
    const stillPreferred = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sky && !stillPreferred) {
        let queued = false;

        const applySkyOffset = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max > 0 ? window.scrollY / max : 0;
            sky.style.setProperty("--sky-p", progress.toFixed(4));
            queued = false;
        };

        const onScroll = () => {
            if (!queued) {
                queued = true;
                requestAnimationFrame(applySkyOffset);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        applySkyOffset();
    }

    const body = document.body;
    const flashlightContainer = document.getElementById("flashlight-container");
    const flashlightLabel = document.getElementById("flashlight-label");

    // Label always advertises where the toggle takes you next
    function syncFlashlightLabel() {
        const isDark = body.classList.contains("dark-mode");
        flashlightLabel.textContent = isDark ? "day mode" : "night mode";
        flashlightContainer.setAttribute(
            "aria-label",
            isDark ? "Switch to day mode" : "Switch to night mode"
        );
    }
    syncFlashlightLabel();

    // Toggle night mode when the flashlight container is clicked
    flashlightContainer.addEventListener("click", (e) => {
    // Prevent propagation
    e.stopPropagation();

    // Toggle dark mode and save theme
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
    syncFlashlightLabel();

    // Create ripple element
    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    // Remove the ripple after its animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
});
});

/* ---- Konami code: ↑↑↓↓←→←→BA turns the portfolio into the pixel world ---- */
(() => {
    const SEQUENCE = ["arrowup", "arrowup", "arrowdown", "arrowdown",
                      "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    function announce(text) {
        let toast = document.getElementById("pixel-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "pixel-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.classList.remove("show");
        void toast.offsetWidth; // reflow so the animation restarts
        toast.classList.add("show");
    }

    // Match against a rolling window of the last N keys. Tracking a single
    // index instead would desync on a repeated key (up-up-up-down...) and
    // never recover, which reads as "the easter egg is broken".
    const recent = [];

    document.addEventListener("keydown", (event) => {
        recent.push(event.key.toLowerCase());
        if (recent.length > SEQUENCE.length) recent.shift();

        if (recent.length === SEQUENCE.length &&
            SEQUENCE.every((key, i) => key === recent[i])) {
            recent.length = 0;
            const on = document.body.classList.toggle("pixel-mode");
            announce(on ? "PIXEL MODE ON" : "PIXEL MODE OFF");
        }
    });
})();

document.addEventListener("scroll", () => {
    const progress = document.getElementById("scroll-progress");
    const scrollTop = window.scrollY; // current scroll position
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progress.style.width = scrollPercentage + "%";
  });

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    navLinks.classList.toggle('active');

    // Trigger animations for links when menu is toggled
    if (navLinks.classList.contains('active')) {
        links.forEach(link => {
            link.style.animation = '';
            setTimeout(() => {
                link.style.animation = ''; // Reset animation to allow retriggering
            }, 0);
        });
    }
}

  