document.addEventListener('DOMContentLoaded', () => {
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
        items: 1,           // Show 1 item by default (even for larger screens)
        loop: true,
        margin: 10,        
        autoplay: true,
        autoplayTimeout: 5000,  // Set autoplay timeout
        responsive: {
            0: {
                items: 1      // 1 item on mobile screens
            },
            600: {
                items: 1      // 1 item on medium screens
            },
            1000: {
                items: 1      // 1 item on larger screens
            }
        }
    });

    const body = document.body;
    const flashlightContainer = document.getElementById("flashlight-container");

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

