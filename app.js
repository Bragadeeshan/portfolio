/* =========================
   CUSTOM CURSOR
========================= */

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (cursor && ring) {
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateCursor() {
    cursor.style.left = `${mx}px`;
    cursor.style.top = `${my}px`;

    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;

    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* =========================
   NAV SCROLL EFFECT
========================= */

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
});

/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

/* =========================
   SCROLL REVEAL ANIMATIONS
========================= */

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

function observeReveals(scope = document) {
  scope.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

observeReveals();

/* =========================
   PROJECTS RENDERER
========================= */

async function buildProjects() {

  const container = document.getElementById('projectsGrid');
  if (!container) return;

  container.innerHTML = `
    <div class="project-loading">
      <div class="project-state-title">LOADING PROJECTS</div>
      <p class="project-state-text">Preparing selected work...</p>
    </div>
  `;

  try {

    const configProjects = PORTFOLIO_CONFIG.projects || [];
    const githubUsername = PORTFOLIO_CONFIG.githubUsername;

    let repoMap = new Map();

    const needsGithubLookup = configProjects.some(project => project.githubRepo);

    if (needsGithubLookup) {

      const response = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100`
      );

      if (response.ok) {

        const repos = await response.json();

        if (Array.isArray(repos)) {

          repoMap = new Map(
            repos.map(repo => [repo.name.toLowerCase(), repo])
          );

        }
      }
    }

    if (!configProjects.length) {

      container.innerHTML = `
        <div class="project-empty">
          <div class="project-state-title">NO PROJECTS FOUND</div>
          <p class="project-state-text">Add projects inside data.js</p>
        </div>
      `;

      return;
    }

    const html = configProjects.map((project, index) => {

      const repo =
        project.githubRepo
          ? repoMap.get(project.githubRepo.toLowerCase())
          : null;

      const githubUrl =
        project.githubUrl ||
        (repo ? repo.html_url : "");

      const liveUrl =
        project.liveUrl || "";

      const techStack =
        (project.tech || []).join(" • ");

      const title =
        escapeHtml(project.title);

      const description =
        escapeHtml(
          project.summary ||
          (repo && repo.description) ||
          "A selected engineering project demonstrating practical implementation."
        );

      const featuredClass =
        project.featured ? "featured" : "";

      const imageMarkup =
        project.image
          ? `<img src="${escapeAttribute(project.image)}"
                   alt="${title} preview"
                   loading="lazy">`
          : `<div class="project-thumb-fallback">
                ${getProjectInitials(title)}
             </div>`;

      const liveButton =
        liveUrl
          ? `<a href="${escapeAttribute(liveUrl)}"
                 target="_blank"
                 class="project-link">
                 Live Site
             </a>`
          : "";

      const githubButton =
        githubUrl
          ? `<a href="${escapeAttribute(githubUrl)}"
                 target="_blank"
                 class="project-link">
                 Source Code
             </a>`
          : "";

      return `
        <article class="project-card ${featuredClass} reveal"
                 style="transition-delay:${index * 0.08}s">

          <div class="project-card-inner">

            <div class="project-thumb">
              ${imageMarkup}
            </div>

            <div class="project-info">

              <div>

                <div class="project-meta">
                  ${escapeHtml(techStack)}
                </div>

                <div class="project-title">
                  ${title}
                </div>

                <p class="project-desc">
                  ${description}
                </p>

              </div>

              <div class="project-links">
                ${liveButton}
                ${githubButton}
              </div>

            </div>

          </div>

        </article>
      `;

    }).join("");

    container.innerHTML = html;

    observeReveals(container);

  }
  catch (error) {

    console.error("Project rendering error:", error);

    container.innerHTML = `
      <div class="project-error">
        <div class="project-state-title">
          UNABLE TO LOAD PROJECTS
        </div>
        <p class="project-state-text">
          Please check GitHub username or repo names.
        </p>
      </div>
    `;
  }
}

buildProjects();

/* =========================
   CONTACT MODAL
========================= */

const contactModal =
  document.getElementById('contactModal');

const modalOverlay =
  document.getElementById('modalOverlay');

const openContactModal =
  document.getElementById('openContactModal');

const openContactModalBottom =
  document.getElementById('openContactModalBottom');

const closeContactModal =
  document.getElementById('closeContactModal');

function openModal() {

  if (!contactModal) return;

  contactModal.classList.add('active');
  document.body.style.overflow = "hidden";
}

function closeModal() {

  if (!contactModal) return;

  contactModal.classList.remove('active');
  document.body.style.overflow = "";
}

openContactModal?.addEventListener('click', openModal);
openContactModalBottom?.addEventListener('click', openModal);
closeContactModal?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {

  if (e.key === "Escape") {
    closeModal();
  }

});

/* =========================
   WEB3FORMS CONTACT SUBMIT
========================= */

const contactForm =
  document.getElementById("contactForm");

const formStatus =
  document.getElementById("formStatus");

const submitBtn =
  document.getElementById("submitBtn");

const accessKeyInput =
  document.getElementById("access_key");

const replyToInput =
  document.getElementById("replyto");

if (accessKeyInput) {

  accessKeyInput.value =
    PORTFOLIO_CONFIG.web3formsAccessKey;

}

contactForm?.addEventListener(
  "submit",
  async function (e) {

    e.preventDefault();

    const email =
      document.getElementById("email").value;

    if (replyToInput) {

      replyToInput.value = email;

    }

    const formData =
      new FormData(contactForm);

    submitBtn.disabled = true;

    formStatus.textContent =
      "Sending message...";

    try {

      const response =
        await fetch(
          "https://api.web3forms.com/submit",
          {
            method: "POST",
            body: formData
          }
        );

      const result =
        await response.json();

      if (result.success) {

        formStatus.textContent =
          "Message sent successfully.";

        formStatus.className =
          "form-status success";

        contactForm.reset();

        setTimeout(closeModal, 1200);

      }
      else {

        throw new Error();

      }

    }
    catch {

      formStatus.textContent =
        "Message failed. Try again later.";

      formStatus.className =
        "form-status error";

    }

    submitBtn.disabled = false;

  }
);

/* =========================
   HELPERS
========================= */

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

}

function escapeAttribute(value) {

  return String(value)
    .replace(/"/g, "&quot;");

}

function getProjectInitials(title) {

  return title
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

}