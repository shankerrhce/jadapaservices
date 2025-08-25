// Mobile menu toggle
const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobile-menu");

mobileToggle?.addEventListener("click", () => {
  const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
  mobileToggle.setAttribute("aria-expanded", String(!expanded));
  mobileMenu.hidden = expanded;
});

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();

        // Calculate scroll position with header offset
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 100;
        const elementPosition = el.offsetTop - headerHeight - 20; // Extra 20px for breathing room

        console.log(`🎯 Scrolling to ${id}:`, {
          elementTop: el.offsetTop,
          headerHeight: headerHeight,
          calculatedPosition: elementPosition,
          currentScrollY: window.scrollY,
        });

        // Use scrollIntoView for more reliable scrolling
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

        // Also manually adjust for header offset after smooth scroll
        setTimeout(() => {
          const currentScrollY = window.scrollY;
          const targetScrollY = el.offsetTop - headerHeight - 20;
          if (Math.abs(currentScrollY - targetScrollY) > 10) {
            window.scrollTo({
              top: targetScrollY,
              behavior: "smooth",
            });
          }

          // Force navigation update after scroll completes
          setTimeout(() => {
            updateActiveNavigation();
          }, 200);

          // Also immediately highlight the clicked navigation item
          const allNavLinks = document.querySelectorAll(
            '#desktopMenu a, #mobile-menu a, nav a[href^="#"]'
          );
          allNavLinks.forEach((link) => {
            link.classList.remove("active-nav");
          });

          // Highlight the clicked section
          const activeLink = document.querySelector(`a[href="${id}"]`);
          if (activeLink) {
            activeLink.classList.add("active-nav");
          }
        }, 100);

        if (!mobileMenu.hidden) {
          mobileMenu.hidden = true;
          mobileToggle.setAttribute("aria-expanded", "false");
        }
      }
    }
  });
});

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Portfolio gallery population and filter logic
function populatePortfolioGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // Clear loading placeholder
  gallery.innerHTML = "";

  // Create portfolio tiles dynamically
  portfolioImages.forEach((image, index) => {
    // Determine span class based on image importance and category
    let spanClass = "span-3"; // Default small tile

    // Make some images larger for visual interest
    if (index === 0 || index % 7 === 0) spanClass = "span-6"; // Large tiles
    else if (index % 5 === 0) spanClass = "span-4"; // Medium tiles

    // Create tile element
    const tile = document.createElement("figure");
    tile.className = `tile ${spanClass}`;
    tile.dataset.category = image.category;

    // Create image element with proper loading
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = image.alt;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    // Add loading state
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";

    // Handle image loading
    img.addEventListener("load", () => {
      img.style.opacity = "1";
      console.log(`✅ Portfolio image loaded: ${image.title}`);
    });

    img.addEventListener("error", () => {
      console.error(`❌ Portfolio image failed to load: ${image.src}`);
      // Show fallback content
      img.style.display = "none";
      const fallback = document.createElement("div");
      fallback.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.1);
        color: var(--muted);
        font-size: 0.9rem;
        text-align: center;
        padding: 1rem;
      `;
      fallback.textContent = `Image not available\n${image.title}`;
      tile.appendChild(fallback);
    });

    // Create caption
    const caption = document.createElement("figcaption");
    caption.className = "cap";
    caption.textContent = image.title;

    // Add click event for lightbox (optional)
    tile.addEventListener("click", () => {
      showImageLightbox(image);
    });

    // Assemble tile
    tile.appendChild(img);
    tile.appendChild(caption);
    gallery.appendChild(tile);

    // Set image source after adding to DOM and setting up event listeners
    img.src = image.src;
  });

  console.log(
    `✅ Portfolio gallery populated with ${portfolioImages.length} images`
  );
}

// Portfolio filter logic
function initializePortfolioFilters() {
  const filterButtons = document.querySelectorAll(".filters .pill");
  const tiles = document.querySelectorAll("#gallery .tile");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const f = btn.dataset.filter;
      tiles.forEach((t) => {
        const show = f === "all" || t.dataset.category === f;
        t.style.display = show ? "block" : "none";
      });

      console.log(
        `🔍 Filtered portfolio to show: ${f === "all" ? "all categories" : f}`
      );
    });
  });
}

// Enhanced lightbox function with navigation
function showImageLightbox(image) {
  // Find current image index
  let currentIndex = portfolioImages.findIndex((img) => img.src === image.src);

  // Create lightbox overlay
  const lightbox = document.createElement("div");
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: default;
    backdrop-filter: blur(10px);
  `;

  // Create image container
  const imgContainer = document.createElement("div");
  imgContainer.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  // Create loading indicator
  const loading = document.createElement("div");
  loading.style.cssText = `
    color: white;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;
  loading.innerHTML = `
    <div style="width: 20px; height: 20px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    Loading image...
  `;

  // Create image with proper error handling
  const img = document.createElement("img");
  img.style.cssText = `
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    display: none;
  `;

  // Create caption
  const caption = document.createElement("div");
  caption.style.cssText = `
    margin-top: 1rem;
    text-align: center;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    background: rgba(0,0,0,0.7);
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    backdrop-filter: blur(10px);
  `;
  caption.textContent = image.title;

  // Create navigation controls
  const navControls = document.createElement("div");
  navControls.style.cssText = `
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    pointer-events: none;
    z-index: 10;
  `;

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "‹";
  prevBtn.style.cssText = `
    width: 60px;
    height: 60px;
    border: none;
    background: rgba(0,0,0,0.7);
    color: white;
    font-size: 2rem;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    ${currentIndex === 0 ? "opacity: 0.3; cursor: not-allowed;" : ""}
  `;

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "›";
  nextBtn.style.cssText = `
    width: 60px;
    height: 60px;
    border: none;
    background: rgba(0,0,0,0.7);
    color: white;
    font-size: 2rem;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    ${
      currentIndex === portfolioImages.length - 1
        ? "opacity: 0.3; cursor: not-allowed;"
        : ""
    }
  `;

  // Hover effects for navigation buttons
  prevBtn.addEventListener("mouseenter", () => {
    if (currentIndex > 0) {
      prevBtn.style.background = "rgba(0,212,255,0.8)";
      prevBtn.style.transform = "scale(1.1)";
    }
  });

  prevBtn.addEventListener("mouseleave", () => {
    if (currentIndex > 0) {
      prevBtn.style.background = "rgba(0,0,0,0.7)";
      prevBtn.style.transform = "scale(1)";
    }
  });

  nextBtn.addEventListener("mouseenter", () => {
    if (currentIndex < portfolioImages.length - 1) {
      nextBtn.style.background = "rgba(0,212,255,0.8)";
      nextBtn.style.transform = "scale(1.1)";
    }
  });

  nextBtn.addEventListener("mouseleave", () => {
    if (currentIndex < portfolioImages.length - 1) {
      nextBtn.style.background = "rgba(0,0,0,0.7)";
      nextBtn.style.transform = "scale(1)";
    }
  });

  // Navigation functions
  function showImage(index) {
    const newImage = portfolioImages[index];
    if (!newImage) return;

    // Update current index
    currentIndex = index;

    // Reset loading state
    loading.style.display = "flex";
    img.style.display = "none";
    loading.innerHTML = `
      <div style="width: 20px; height: 20px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      Loading image...
    `;

    // Update image and caption
    img.src = newImage.src;
    img.alt = newImage.alt;
    caption.textContent = newImage.title;

    // Update button states
    prevBtn.style.opacity = index === 0 ? "0.3" : "1";
    prevBtn.style.cursor = index === 0 ? "not-allowed" : "pointer";
    nextBtn.style.opacity = index === portfolioImages.length - 1 ? "0.3" : "1";
    nextBtn.style.cursor =
      index === portfolioImages.length - 1 ? "not-allowed" : "pointer";

    console.log(
      `🖼️ Showing image ${index + 1}/${portfolioImages.length}: ${
        newImage.title
      } (currentIndex: ${currentIndex})`
    );
  }

  // Navigation event listeners
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      showImage(currentIndex - 1);
    }
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex < portfolioImages.length - 1) {
      showImage(currentIndex + 1);
    }
  });

  // Add loading and error handling
  img.addEventListener("load", () => {
    loading.style.display = "none";
    img.style.display = "block";
    console.log(`✅ Image loaded successfully: ${image.title}`);
  });

  img.addEventListener("error", () => {
    loading.innerHTML = `
      <div style="color: #ff6b6b; font-size: 2rem;">❌</div>
      Failed to load image
    `;
    console.error(`❌ Failed to load image: ${image.src}`);
  });

  // Set image source after adding event listeners
  img.src = image.src;
  img.alt = image.alt;

  // Add close functionality (click outside image)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      document.body.removeChild(lightbox);
    }
  });

  // Add keyboard support
  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      document.body.removeChild(lightbox);
      document.removeEventListener("keydown", handleKeydown);
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
      showImage(currentIndex - 1);
    } else if (
      e.key === "ArrowRight" &&
      currentIndex < portfolioImages.length - 1
    ) {
      showImage(currentIndex + 1);
    }
  };

  document.addEventListener("keydown", handleKeydown);

  // Assemble lightbox
  imgContainer.appendChild(loading);
  imgContainer.appendChild(img);
  imgContainer.appendChild(caption);
  lightbox.appendChild(imgContainer);

  // Add navigation controls
  navControls.appendChild(prevBtn);
  navControls.appendChild(nextBtn);
  lightbox.appendChild(navControls);

  document.body.appendChild(lightbox);

  console.log(
    `🖼️ Lightbox opened for: ${image.title} (${currentIndex + 1}/${
      portfolioImages.length
    })`
  );
}

// Subtle reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 500, easing: "ease-out", fill: "forwards" }
        );
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll(".service, .tile, .video-card, .about .card")
  .forEach((el) => observer.observe(el));

// Contact form handler with validation and email functionality
const form = document.getElementById("quoteForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Validate form fields
  if (!validateForm(data)) {
    return;
  }

  // Prepare email content
  const subject = encodeURIComponent(
    `New Project Inquiry • ${data.service} • ${data.name}`
  );
  const body = encodeURIComponent(
    `📋 NEW PROJECT INQUIRY

👤 Contact Information:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone || "Not provided"}

🎯 Service Requested:
• Service: ${data.service}

💬 Project Details:
${data.message || "No additional message provided"}

---
This inquiry was submitted from your website contact form.
Please respond within 24 hours.`
  );

  // Show success message
  showFormSuccess();

  // Reset the form to clear all fields
  form.reset();

  // Send email to jadapaservices@gmail.com
  setTimeout(() => {
    window.location.href = `mailto:jadapaservices@gmail.com?subject=${subject}&body=${body}`;
  }, 1500);
});

// Form validation function
function validateForm(data) {
  const errors = [];

  // Required field validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email is required");
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Please enter a valid email address");
  }

  // Phone number validation (optional but if provided, must be valid)
  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(data.phone.trim())) {
      errors.push("Please enter a valid phone number (10-15 digits)");
    }
  }

  // Service validation
  if (!data.service || data.service === "Select a service") {
    errors.push("Please select a service type");
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  // Display errors if any
  if (errors.length > 0) {
    showFormErrors(errors);
    return false;
  }

  return true;
}

// Display form validation errors
function showFormErrors(errors) {
  // Remove any existing error messages
  const existingErrors = document.querySelectorAll(".form-error");
  existingErrors.forEach((error) => error.remove());

  // Create error container
  const errorContainer = document.createElement("div");
  errorContainer.className = "form-errors";
  errorContainer.style.cssText = `
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    color: #c33;
    font-size: 0.9rem;
  `;

  // Add error title
  const errorTitle = document.createElement("h4");
  errorTitle.textContent = "Please fix the following errors:";
  errorTitle.style.cssText = "margin: 0 0 0.5rem 0; color: #c33;";
  errorContainer.appendChild(errorTitle);

  // Add error list
  const errorList = document.createElement("ul");
  errorList.style.cssText = "margin: 0; padding-left: 1.5rem;";
  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    errorList.appendChild(li);
  });
  errorContainer.appendChild(errorList);

  // Insert errors before the form
  const form = document.getElementById("quoteForm");
  form.parentNode.insertBefore(errorContainer, form);

  // Auto-remove errors after 5 seconds
  setTimeout(() => {
    if (errorContainer.parentNode) {
      errorContainer.remove();
    }
  }, 5000);
}

// Display form success message
function showFormSuccess() {
  // Remove any existing messages
  const existingMessages = document.querySelectorAll(
    ".form-errors, .form-success"
  );
  existingMessages.forEach((msg) => msg.remove());

  // Create success container
  const successContainer = document.createElement("div");
  successContainer.className = "form-success";

  // Add success content
  successContainer.innerHTML = `
    <h4>✅ Form Submitted Successfully!</h4>
    <p>Your email client will open with a pre-filled message to jadapaservices@gmail.com.<br>
    Please review and send the email to complete your inquiry.</p>
  `;

  // Insert success message before the form
  const form = document.getElementById("quoteForm");
  form.parentNode.insertBefore(successContainer, form);

  // Auto-remove success message after 8 seconds
  setTimeout(() => {
    if (successContainer.parentNode) {
      successContainer.remove();
    }
  }, 8000);
}

// Local hero video with audio handling
const heroVideo = document.getElementById("heroVideo");
const videoLoading = document.getElementById("videoLoading");
const videoHint = document.getElementById("videoHint");
const audioToggle = document.getElementById("audioToggle");
const audioIcon = document.getElementById("audioIcon");

// Initialize video with audio immediately
console.log("🎬 Initializing hero video with audio...");

if (heroVideo) {
  // Ensure video starts unmuted and with audio
  heroVideo.muted = false;
  heroVideo.volume = 1.0;

  // Set audio icon to indicate audio is enabled
  if (audioIcon) {
    audioIcon.textContent = "🔊";
  }

  // Show loading indicator initially
  if (videoLoading) {
    videoLoading.style.display = "block";
  }

  // Video loaded successfully
  heroVideo.addEventListener("loadeddata", () => {
    if (videoLoading) {
      videoLoading.style.display = "none";
    }
    // Force video to start playing with audio
    startVideoWithAudio();
  });

  // Video can start playing
  heroVideo.addEventListener("canplay", () => {
    if (videoLoading) {
      videoLoading.style.display = "none";
    }
    // Force video to start playing with audio
    startVideoWithAudio();
  });

  // Aggressive autoplay strategy with automatic unmuting
  function startVideoWithAudio() {
    // First try: unmuted autoplay (most browsers block this)
    heroVideo.muted = false;
    heroVideo.volume = 1.0;

    heroVideo
      .play()
      .then(() => {
        console.log("✅ Video autoplay with audio successful!");
        if (audioIcon) audioIcon.textContent = "🔊";
      })
      .catch((error) => {
        console.log("🔇 Autoplay with audio blocked, trying muted fallback...");

        // Second try: muted autoplay (most browsers allow this)
        heroVideo.muted = true;
        heroVideo
          .play()
          .then(() => {
            console.log(
              "✅ Video autoplay muted successful, attempting auto-unmute..."
            );
            if (audioIcon) audioIcon.textContent = "🔇";

            // Try to unmute multiple times with increasing delays
            const unmuteAttempts = [100, 300, 500, 1000, 2000];
            let unmuteSuccessful = false;

            unmuteAttempts.forEach((delay, index) => {
              setTimeout(() => {
                if (unmuteSuccessful) return; // Stop if already successful

                try {
                  const wasMuted = heroVideo.muted;
                  heroVideo.muted = false;
                  heroVideo.volume = 1.0;

                  console.log(
                    `🔊 Unmute attempt ${index + 1}/${
                      unmuteAttempts.length
                    } after ${delay}ms`
                  );
                  console.log(
                    `- Was muted: ${wasMuted}, Now muted: ${heroVideo.muted}`
                  );

                  // Check if unmute was actually successful
                  if (!heroVideo.muted) {
                    console.log("✅ Auto-unmute successful!");
                    if (audioIcon) audioIcon.textContent = "🔊";
                    unmuteSuccessful = true;
                    return; // Stop trying
                  } else if (index === unmuteAttempts.length - 1) {
                    // Last attempt failed, set up interaction unmute
                    console.log(
                      "⚠️ All auto-unmute attempts failed, setting up interaction unmute"
                    );
                    setupUnmuteOnInteraction();
                  }
                } catch (e) {
                  console.log(`❌ Unmute attempt ${index + 1} failed:`, e);
                  if (index === unmuteAttempts.length - 1) {
                    setupUnmuteOnInteraction();
                  }
                }
              }, delay);
            });

            // Also try unmuting on video events
            heroVideo.addEventListener(
              "canplaythrough",
              () => {
                try {
                  heroVideo.muted = false;
                  heroVideo.volume = 1.0;
                  if (!heroVideo.muted && audioIcon) {
                    audioIcon.textContent = "🔊";
                    console.log("✅ Unmuted on canplaythrough event");
                  }
                } catch (e) {
                  console.log("❌ Canplaythrough unmute failed:", e);
                }
              },
              { once: true }
            );

            // Try a more aggressive approach: pause and resume to force unmute
            setTimeout(() => {
              if (heroVideo.muted) {
                console.log("🎬 Trying pause/resume unmute strategy...");
                try {
                  const wasPlaying = !heroVideo.paused;
                  if (wasPlaying) {
                    heroVideo.pause();
                  }

                  heroVideo.muted = false;
                  heroVideo.volume = 1.0;

                  if (wasPlaying) {
                    heroVideo.play().then(() => {
                      if (!heroVideo.muted) {
                        console.log("✅ Pause/resume unmute successful!");
                        if (audioIcon) audioIcon.textContent = "🔊";
                        unmuteSuccessful = true;
                      }
                    });
                  }
                } catch (e) {
                  console.log("❌ Pause/resume unmute failed:", e);
                }
              }
            }, 1500);

            // If all auto-unmute attempts fail, try to force unmute directly
            setTimeout(() => {
              if (heroVideo.muted) {
                console.log("🎯 Attempting final force unmute...");
                try {
                  // Try multiple unmute strategies
                  heroVideo.muted = false;
                  heroVideo.volume = 1.0;

                  // Force a video restart to trigger unmute
                  const currentTime = heroVideo.currentTime;
                  heroVideo.currentTime = currentTime + 0.1;

                  // Try to unmute again after the seek
                  setTimeout(() => {
                    heroVideo.muted = false;
                    heroVideo.volume = 1.0;
                    console.log("🔊 Final unmute attempt after seek");
                  }, 100);
                } catch (e) {
                  console.log("❌ Final unmute attempt failed:", e);
                }
              }
            }, 3000);
          })
          .catch((muteError) => {
            console.log(
              "❌ Even muted autoplay failed, waiting for user interaction"
            );
            // Try to force unmute with video manipulation
            setTimeout(() => {
              console.log(
                "🎯 Attempting force unmute with video manipulation..."
              );
              try {
                // Try to trigger unmute by manipulating video properties
                heroVideo.muted = false;
                heroVideo.volume = 1.0;

                // Force a small seek to trigger unmute
                const currentTime = heroVideo.currentTime;
                heroVideo.currentTime = currentTime + 0.01;

                // Try unmute again after seek
                setTimeout(() => {
                  heroVideo.muted = false;
                  heroVideo.volume = 1.0;
                  console.log("🔊 Force unmute attempt after seek");
                }, 50);
              } catch (e) {
                console.log("❌ Force unmute attempt failed:", e);
              }
            }, 500);
            // Set up play on any user interaction
            document.addEventListener("click", forcePlayOnClick, {
              once: true,
            });
            document.addEventListener("scroll", forcePlayOnClick, {
              once: true,
            });
          });
      });
  }

  // Setup unmute on user interaction
  function setupUnmuteOnInteraction() {
    const unmuteOnInteraction = () => {
      try {
        console.log("👆 User interaction detected, attempting to unmute...");

        // Force unmute multiple times to ensure it works
        heroVideo.muted = false;
        heroVideo.volume = 1.0;

        // Also try to play if paused
        if (heroVideo.paused) {
          heroVideo
            .play()
            .then(() => {
              // Double-check unmute after play
              heroVideo.muted = false;
              heroVideo.volume = 1.0;

              if (!heroVideo.muted) {
                console.log(
                  "🔊 Video unmuted and playing on user interaction!"
                );
                if (audioIcon) audioIcon.textContent = "🔊";

                // Hide interaction hint if it was showing
                if (videoHint) videoHint.style.display = "none";

                // Remove all listeners
                removeUnmuteListeners();
              }
            })
            .catch((e) => {
              console.log("❌ Failed to play video on interaction:", e);
            });
        } else {
          // Video is already playing, just unmute
          if (!heroVideo.muted) {
            console.log("🔊 Video unmuted on user interaction!");
            if (audioIcon) audioIcon.textContent = "🔊";

            // Hide interaction hint if it was showing
            if (videoHint) videoHint.style.display = "none";

            // Remove all listeners
            removeUnmuteListeners();
          }
        }
      } catch (e) {
        console.log("❌ Unmute on interaction failed:", e);
      }
    };

    function removeUnmuteListeners() {
      document.removeEventListener("click", unmuteOnInteraction);
      document.removeEventListener("scroll", unmuteOnInteraction);
      document.removeEventListener("keydown", unmuteOnInteraction);
      document.removeEventListener("touchstart", unmuteOnInteraction);
      document.removeEventListener("mousemove", unmuteOnInteraction);
    }

    // Listen for ANY user interaction
    document.addEventListener("click", unmuteOnInteraction, { once: true });
    document.addEventListener("scroll", unmuteOnInteraction, { once: true });
    document.addEventListener("keydown", unmuteOnInteraction, { once: true });
    document.addEventListener("touchstart", unmuteOnInteraction, {
      once: true,
    });
    document.addEventListener("mousemove", unmuteOnInteraction, { once: true });

    console.log("🎯 Set up unmute listeners for user interaction");
  }

  // Force play on any user click
  function forcePlayOnClick() {
    heroVideo.muted = false;
    heroVideo.volume = 1.0;
    heroVideo
      .play()
      .then(() => {
        console.log("✅ Video started playing with audio on user interaction!");
        if (audioIcon) audioIcon.textContent = "🔊";
        // Hide interaction hint when video starts
        if (videoHint) videoHint.style.display = "none";
      })
      .catch((error) => {
        console.log("❌ Failed to play video:", error);
      });
  }

  // Try to start video immediately
  startVideoWithAudio();

  // Also try on page interactions as backup
  document.addEventListener("click", forcePlayOnClick, { once: true });
  document.addEventListener("scroll", forcePlayOnClick, { once: true });
} else {
  console.log("❌ Hero video element not found");
}

// Audio control functionality
if (audioToggle && heroVideo && audioIcon) {
  audioToggle.addEventListener("click", () => {
    // Start video if not playing
    if (heroVideo.paused) {
      heroVideo.muted = false;
      heroVideo.volume = 1.0;
      heroVideo.play();
      audioIcon.textContent = "🔊";
    } else {
      // Toggle audio on/off
      if (heroVideo.muted) {
        heroVideo.muted = false;
        heroVideo.volume = 1.0;
        audioIcon.textContent = "🔊";
      } else {
        heroVideo.muted = true;
        audioIcon.textContent = "🔇";
      }
    }
  });

  // Update button state when video plays
  heroVideo.addEventListener("play", () => {
    if (audioIcon) {
      audioIcon.textContent = heroVideo.muted ? "🔇" : "🔊";
    }
  });
}

function showVideoError() {
  const heroVideoContainer = document.querySelector(".hero-video");
  if (heroVideoContainer) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "video-error";
    errorDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(255,0,150,0.1));
      border-radius: 15px;
      border: 1px solid rgba(255,255,255,0.2);
      color: var(--text);
      max-width: 300px;
      z-index: 10;
    `;

    errorDiv.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 1rem;">🎬</div>
      <h4 style="color: var(--primary); margin-bottom: 1rem;">Video Unavailable</h4>
      <p style="color: var(--muted); margin-bottom: 1rem; font-size: 0.9rem;">
        The showcase video couldn't load. Please check your connection or view our portfolio below.
      </p>
      <a href="#portfolio" style="padding: 8px 16px; background: var(--primary); color: #000; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Portfolio →
      </a>
    `;

    heroVideoContainer.appendChild(errorDiv);
    console.log("💬 Video error message displayed");
  }
}

// Initialize portfolio gallery
console.log("🎨 Initializing portfolio gallery...");
if (typeof portfolioImages !== "undefined") {
  populatePortfolioGallery();
  initializePortfolioFilters();
} else {
  console.log("❌ Portfolio images configuration not loaded");
}

// Header scroll effect
function handleHeaderScroll() {
  const header = document.querySelector("header");
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
}

// Add scroll event listener
window.addEventListener("scroll", handleHeaderScroll);

// Active navigation highlighting with simplified logic
function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(
    '#desktopMenu a, #mobile-menu a, nav a[href^="#"]'
  );

  let currentSection = "";
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  // Find the section that's most visible in the viewport
  let maxVisibility = 0;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // Calculate how much of the section is visible
    const visibleTop = Math.max(0, -sectionTop);
    const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibility = visibleHeight / sectionHeight;

    // Section is considered if it has significant visibility
    if (visibility > 0.1 && sectionTop < windowHeight * 0.8) {
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        currentSection = section.getAttribute("id");
      }
    }
  });

  // Remove active class from all navigation links first
  navLinks.forEach((link) => {
    link.classList.remove("active-nav");
  });

  // Add active class to current section link
  if (currentSection) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSection}`) {
        link.classList.add("active-nav");
      }
    });
  }

  // Handle home link (when at top of page or when no section is active)
  if (scrollY < 100 || !currentSection) {
    const homeLinks = document.querySelectorAll('a[href="#top"]');
    homeLinks.forEach((link) => link.classList.add("active-nav"));
    currentSection = "top";
  } else {
    const homeLinks = document.querySelectorAll('a[href="#top"]');
    homeLinks.forEach((link) => link.classList.remove("active-nav"));
  }

  // Also handle the brand logo as home link
  const brandLink = document.querySelector(".brand");
  if (brandLink) {
    if (scrollY < 100 || !currentSection) {
      brandLink.classList.add("active-nav");
    } else {
      brandLink.classList.remove("active-nav");
    }
  }

  // Debug logging for section detection
  if (currentSection) {
    console.log(`📍 Current active section: ${currentSection}`);
    console.log(`📊 Max visibility: ${(maxVisibility * 100).toFixed(1)}%`);
  } else {
    console.log(`📍 No section detected, defaulting to home`);
  }

  // Log all sections for debugging
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const visibleTop = Math.max(0, -sectionTop);
    const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibility = visibleHeight / sectionHeight;

    console.log(
      `🔍 ${section.id}: top=${sectionTop.toFixed(0)}, visibility=${(
        visibility * 100
      ).toFixed(1)}%`
    );
  });
}

// Debounce function to limit how often updateActiveNavigation runs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add scroll event listener for navigation highlighting with debouncing
window.addEventListener("scroll", debounce(updateActiveNavigation, 50));

// Initialize active navigation on page load
document.addEventListener("DOMContentLoaded", updateActiveNavigation);

// Animated counters for About section
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/\D/g, "")); // Extract number
    const suffix = counter.textContent.replace(/\d/g, ""); // Extract + symbol
    let current = 0;
    const increment = target / 100; // Smooth increment

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        if (current > target) current = target;
        counter.textContent = Math.floor(current) + suffix;

        // Add visual effect during animation
        counter.classList.add("animating");

        requestAnimationFrame(updateCounter);
      } else {
        // Remove animation class when complete
        setTimeout(() => {
          counter.classList.remove("animating");
        }, 300);
      }
    };

    // Start animation when counter is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

// Initialize counters when page loads
document.addEventListener("DOMContentLoaded", animateCounters);

// Scroll progress indicator
function updateScrollProgress() {
  const header = document.querySelector("header");
  if (header) {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    header.style.setProperty("--scroll-progress", `${scrollPercent}%`);

    // Update the progress bar width
    const progressBar = header.querySelector("::after");
    if (progressBar) {
      header.style.setProperty("--scroll-width", `${scrollPercent}%`);
    }
  }
}

// Add scroll event listener for progress indicator
window.addEventListener("scroll", updateScrollProgress);

// No additional legacy YouTube code needed - local video handling is complete
