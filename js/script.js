// Enhanced Portfolio JavaScript with Fixed Progress Bars and Auto Theme Detection

// Global variables
let observer;
let certificateManager;
let skillBarsAnimated = false; // Prevent multiple animations
let slideIndex = 0;
const slideIndices = [];

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initializePortfolio();
});

// Main initialization function
function initializePortfolio() {
  try {
    // Initialize all components
    initAutoThemeDetection();
    initMobileNavigation();
    initSmoothScrolling();
    initTypingAnimation();
    initSkillBars();
    initNavbarScroll();
    initContactForm();
    initProjectCards();
    initScrollToTop();
    initCertificateManager();
    initActiveNavigation();

    console.log("Portfolio initialized successfully");
  } catch (error) {
    console.error("Error initializing portfolio:", error);
  }
}

// Automatic Theme Detection (No Manual Button) [web:368][web:371]
function initAutoThemeDetection() {
  const body = document.body;

  // Apply system theme automatically
  function applySystemTheme() {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    body.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");

    console.log(`Auto theme applied: ${systemPrefersDark ? "dark" : "light"}`);
  }

  // Apply theme on load
  applySystemTheme();

  // Listen for system theme changes [web:368]
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", applySystemTheme);
}

function showSlidesForContainer(container, index) {
  const slides = container.querySelectorAll(".slide");
  slides.forEach((slide) => (slide.style.display = "none"));
  slideIndices[index]++;
  if (slideIndices[index] > slides.length) slideIndices[index] = 1;
  slides[slideIndices[index] - 1].style.display = "block";
  setTimeout(() => showSlidesForContainer(container, index), 3000);
}

function initSlideshows() {
  const containers = document.querySelectorAll(".slideshow-container");
  containers.forEach((container, i) => {
    slideIndices[i] = 0;
    showSlidesForContainer(container, i);
  });
}

window.onload = initSlideshows;

// Enhanced Mobile Navigation
function initMobileNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!navToggle || !navMenu) {
    console.warn("Navigation elements not found");
    return;
  }

  navToggle.addEventListener("click", () => {
    const isActive = navMenu.classList.contains("active");
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? "" : "hidden";
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Enhanced Smooth scrolling with active navigation
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Active Navigation Highlighting
function initActiveNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  if (sections.length === 0) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: "-20% 0px -70% 0px",
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));
}

// Enhanced Typing animation
function initTypingAnimation() {
  const typingText = document.querySelector(".typing-text");
  if (!typingText) {
    console.warn("Typing text element not found");
    return;
  }

  const words = [
    "Data Analyst",
    "Python Developer",
    "Web Developer",
    "Machine Learning Enthusiast",
    "Database Designer",
    "Full Stack Developer",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    if (!typingText) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      setTimeout(() => (isDeleting = true), 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    const typeSpeed = isDeleting ? 50 : 100;
    setTimeout(typeWriter, typeSpeed);
  }

  // Start typing animation with delay
  setTimeout(typeWriter, 1000);
}

// FIXED: Enhanced Skill bars animation [web:359][web:373][web:370]
function initSkillBars() {
  const skillsSection = document.querySelector(".skills");
  if (!skillsSection) {
    console.warn("Skills section not found");
    return;
  }

  // Fixed Observer Options for better desktop performance [web:370]
  const observerOptions = {
    threshold: 0.3, // Reduced threshold for better desktop detection
    rootMargin: "0px 0px -20% 0px", // Better margin for desktop
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !skillBarsAnimated) {
        console.log("Skills section is visible, animating bars...");
        skillBarsAnimated = true; // Prevent multiple animations

        const skillBars = entry.target.querySelectorAll(".skill-progress");

        skillBars.forEach((bar, index) => {
          const width = bar.getAttribute("data-width");
          if (width) {
            // Force reset first [web:359]
            bar.style.width = "0%";
            bar.style.transition = "none";

            // Trigger reflow
            bar.offsetHeight;

            // Apply animation with staggered timing [web:373]
            setTimeout(() => {
              bar.style.transition = "width 2s cubic-bezier(0.4, 0, 0.2, 1)";
              bar.style.width = width;

              console.log(`Animating skill bar ${index + 1} to ${width}`);
            }, index * 300); // Increased delay for better effect
          }
        });
      }
    });
  }, observerOptions);

  observer.observe(skillsSection);

  // Also observe certificates section if it exists
  const certificatesSection = document.querySelector(".certificates");
  if (certificatesSection) {
    observer.observe(certificatesSection);
  }
}

// Enhanced Navbar scroll
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) {
    console.warn("Navbar not found");
    return;
  }

  let lastScrollTop = 0;
  let isNavbarHidden = false;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class for styling
    if (scrollTop > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show navbar on scroll (optional)
    if (scrollTop > lastScrollTop && scrollTop > 200 && !isNavbarHidden) {
      // Scrolling down
      navbar.style.transform = "translateY(-100%)";
      isNavbarHidden = true;
    } else if (scrollTop < lastScrollTop && isNavbarHidden) {
      // Scrolling up
      navbar.style.transform = "translateY(0)";
      isNavbarHidden = false;
    }

    lastScrollTop = scrollTop;
  });
}

// Enhanced Contact form handler
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) {
    console.warn("Contact form not found");
    return;
  }

  const formMessage = document.getElementById("form-message");
  const submitBtn = document.getElementById("submit-btn");

  if (!submitBtn) {
    console.warn("Submit button not found");
    return;
  }

  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      if (btnText) btnText.textContent = "Sending...";
      if (btnLoading) btnLoading.style.display = "inline-block";
      if (formMessage) formMessage.style.display = "none";

      // Get form data
      const formData = new FormData(this);

      // Submit to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Success message with animation
        if (formMessage) {
          formMessage.innerHTML =
            '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.';
          formMessage.className = "form-message success";
          formMessage.style.display = "block";

          // Animate success message
          setTimeout(() => {
            formMessage.style.transform = "scale(1.05)";
            setTimeout(() => {
              formMessage.style.transform = "scale(1)";
            }, 200);
          }, 100);
        }

        // Reset form
        this.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      // Error message
      if (formMessage) {
        formMessage.innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Sorry, there was an error sending your message. Please try again.';
        formMessage.className = "form-message error";
        formMessage.style.display = "block";
      }
      console.error("Form submission error:", error);
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (btnText) btnText.textContent = "Send Message";
      if (btnLoading) btnLoading.style.display = "none";
    }
  });
}

// Enhanced Project cards animation
function initProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");
  if (projectCards.length === 0) {
    console.warn("No project cards found");
    return;
  }

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  projectCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    cardObserver.observe(card);
  });
}

// Enhanced Scroll to top functionality
function initScrollToTop() {
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: var(--text-inverse);
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-normal);
        z-index: 999;
        box-shadow: var(--shadow-md);
    `;

  document.body.appendChild(scrollToTopBtn);

  let isVisible = false;

  window.addEventListener("scroll", () => {
    const shouldShow = window.pageYOffset > 300;

    if (shouldShow && !isVisible) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.visibility = "visible";
      scrollToTopBtn.style.transform = "scale(1)";
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.visibility = "hidden";
      scrollToTopBtn.style.transform = "scale(0.8)";
      isVisible = false;
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Add click animation
    scrollToTopBtn.style.transform = "scale(0.9)";
    setTimeout(() => {
      scrollToTopBtn.style.transform = "scale(1)";
    }, 150);
  });
}

// Certificate Manager initialization
function initCertificateManager() {
  const certificatesContainer = document.getElementById("certificates-grid");
  if (!certificatesContainer) {
    console.warn(
      "Certificates container not found - certificates section may not be added to HTML yet"
    );
    return;
  }

  certificateManager = new CertificateManager();
}

// Enhanced Certificate Manager Class
class CertificateManager {
  constructor() {
    this.certificatesContainer = document.getElementById("certificates-grid");
    this.configPath = "certificates/certificates-config.json";

    if (!this.certificatesContainer) {
      console.error("Certificates container not found");
      return;
    }

    console.log(
      "Certificate Manager initialized, loading from:",
      this.configPath
    );
    this.init();
  }

  async init() {
    try {
      await this.loadCertificates();
    } catch (error) {
      console.error("Certificate loading error:", error);
      this.showError("Failed to load certificates: " + error.message);
    }
  }

  async loadCertificates() {
    console.log("Attempting to fetch certificates from:", this.configPath);

    try {
      const response = await fetch(this.configPath);
      console.log("Fetch response status:", response.status);
      console.log("Fetch response ok:", response.ok);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Certificates data loaded:", data);

      if (!data.certificates) {
        throw new Error("No certificates array found in JSON data");
      }

      this.renderCertificates(data.certificates);
    } catch (error) {
      console.error("Error details:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        this.showError(
          "Certificate config file not found. Please ensure certificates/certificates-config.json exists."
        );
      } else if (error.name === "SyntaxError") {
        this.showError("Invalid JSON format in certificates config file.");
      } else {
        this.showNoCertificates();
      }
    }
  }

  renderCertificates(certificates) {
    console.log("Rendering certificates:", certificates.length);

    if (!certificates || certificates.length === 0) {
      this.showNoCertificates();
      return;
    }

    const certificatesHTML = certificates
      .map((cert, index) => {
        console.log(`Processing certificate ${index + 1}:`, cert.name);
        return this.createCertificateCard(cert);
      })
      .join("");

    this.certificatesContainer.innerHTML = certificatesHTML;

    // Add smooth reveal animation
    setTimeout(() => {
      const cards =
        this.certificatesContainer.querySelectorAll(".certificate-card");
      console.log("Animating certificates:", cards.length);
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 150);
      });
    }, 200);
  }

  createCertificateCard(cert) {
    if (!cert.name || !cert.issuer) {
      console.warn("Certificate missing required fields:", cert);
      return "";
    }

    const skills = cert.skills
      ? cert.skills
          .map(
            (skill) =>
              `<span class="cert-skill">${this.escapeHtml(skill)}</span>`
          )
          .join("")
      : "";

    return `
            <div class="certificate-card">
                <div class="certificate-image">
                    <img src="${this.escapeHtml(
                      cert.image || ""
                    )}" alt="${this.escapeHtml(cert.name)}" 
                         onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:3rem;\\'><i class=\\'fas fa-certificate\\'></i></div>'; console.error('Failed to load certificate image:', '${
                           cert.image
                         }');">
                    <div class="certificate-overlay">
                        <div class="certificate-links">
                            <a href="${this.escapeHtml(
                              cert.pdf || "#"
                            )}" target="_blank" class="cert-btn">
                                <i class="fas fa-eye"></i> View
                            </a>
                            <a href="${this.escapeHtml(
                              cert.pdf || "#"
                            )}" download class="cert-btn">
                                <i class="fas fa-download"></i> Download
                            </a>
                        </div>
                    </div>
                </div>
                <div class="certificate-content">
                    <h3>${this.escapeHtml(cert.name)}</h3>
                    <p class="certificate-issuer">${this.escapeHtml(
                      cert.issuer
                    )}</p>
                    <div class="cert-date">${this.escapeHtml(
                      cert.date || ""
                    )}</div>
                    ${
                      cert.type
                        ? `<div class="cert-type">${this.escapeHtml(
                            cert.type
                          )}</div>`
                        : ""
                    }
                    ${skills ? `<div class="cert-skills">${skills}</div>` : ""}
                </div>
            </div>
        `;
  }

  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.toString().replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  showNoCertificates() {
    this.certificatesContainer.innerHTML = `
            <div class="no-certificates">
                <i class="fas fa-certificate" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-secondary); margin-bottom: 0.5rem;">No Certificates Found</h3>
                <p style="color: var(--text-tertiary);">Please check if certificates/certificates-config.json file exists and contains valid certificate data.</p>
            </div>
        `;
  }

  showError(message) {
    this.certificatesContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>Error Loading Certificates</h3>
                <p>${this.escapeHtml(message)}</p>
                <button onclick="certificateManager.refresh()" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
  }

  async refresh() {
    if (!this.certificatesContainer) return;

    this.certificatesContainer.innerHTML = `
            <div class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Refreshing certificates...</p>
            </div>
        `;
    await this.loadCertificates();
  }
}

// Enhanced Global utility functions
window.portfolioUtils = {
  refreshCertificates() {
    if (certificateManager) {
      certificateManager.refresh();
    } else {
      console.warn("Certificate manager not initialized");
    }
  },

  resetSkillBars() {
    skillBarsAnimated = false;
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
      bar.style.width = "0%";
    });
    console.log("Skill bars reset");
  },

  getStatus() {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    return {
      systemTheme: systemTheme,
      certificateManager: !!certificateManager,
      observer: !!observer,
      contactForm: !!document.querySelector(".contact-form"),
      skillsSection: !!document.querySelector(".skills"),
      skillBarsAnimated: skillBarsAnimated,
    };
  },
};

// Console welcome message
console.log(`
🚀 Portfolio Loaded Successfully!
👨‍💻 Developer: K E Komuktheswaran
🌓 Auto Theme: Detecting system preference
🛠️  Status: All systems operational

Use portfolioUtils.getStatus() to check system status
Use portfolioUtils.resetSkillBars() to reset skill animations
`);
