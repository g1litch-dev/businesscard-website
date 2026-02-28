const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .footer-nav a[href^="#"], .brand[href^="#"], .footer-brand[href^="#"]');
const revealItems = document.querySelectorAll("[data-reveal]");
const faqItems = document.querySelectorAll(".faq-item");
const codeOutput = document.querySelector("[data-code-output]");
const codeStatus = document.querySelector("[data-code-status]");
const codeFile = document.querySelector("[data-code-file]");
const servicesToggle = document.querySelector("[data-services-toggle]");
const extraServiceCards = document.querySelectorAll("[data-service-extra]");
const servicesSection = document.querySelector("#services");
const scrollTopButton = document.querySelector(".scroll-top-button");
const siteHeaderElement = document.querySelector(".site-header");
const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const codeSnippets = [
  {
    file: "hero.tsx",
    code: [
      "const project = {",
      '  layout: "landing",',
      '  style: "glass",',
      '  status: "ready"',
      "};",
    ].join("\n"),
  },
  {
    file: "fix-ui.js",
    code: [
      "if (client.needsUpdate) {",
      "  improveUI();",
      "  fixBugs();",
      "  deployPatch();",
      "}",
    ].join("\n"),
  },
  {
    file: "support.ts",
    code: [
      "function launchTask(task) {",
      "  estimate(task);",
      "  buildCleanUI();",
      "  return deliverFast();",
      "}",
    ].join("\n"),
  },
];

function setMenuState(isOpen) {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", String(isOpen));
  siteNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });
}

revealItems.forEach((item) => {
  const delay = item.dataset.delay;

  if (delay) {
    item.style.setProperty("--delay", `${delay}ms`);
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

function renderCodeSnippet(snippet, visibleChars) {
  if (!codeOutput) {
    return;
  }

  codeOutput.textContent = snippet.code.slice(0, visibleChars);

  if (codeFile) {
    codeFile.textContent = snippet.file;
  }
}

function startCodeTypingAnimation() {
  if (!codeOutput || codeSnippets.length === 0) {
    return;
  }

  if (prefersReducedMotion) {
    renderCodeSnippet(codeSnippets[0], codeSnippets[0].code.length);

    if (codeStatus) {
      codeStatus.textContent = "preview";
    }

    return;
  }

  let snippetIndex = 0;
  let visibleChars = 0;
  let isDeleting = false;

  const tick = () => {
    const activeSnippet = codeSnippets[snippetIndex];

    renderCodeSnippet(activeSnippet, visibleChars);

    let delay = isDeleting ? 18 : 42;

    if (!isDeleting && visibleChars < activeSnippet.code.length) {
      visibleChars += 1;

      if (codeStatus) {
        codeStatus.textContent = "typing";
      }
    } else if (!isDeleting) {
      isDeleting = true;
      delay = 1100;

      if (codeStatus) {
        codeStatus.textContent = "clearing";
      }
    } else if (visibleChars > 0) {
      visibleChars -= 1;

      if (codeStatus) {
        codeStatus.textContent = "rewriting";
      }
    } else {
      isDeleting = false;
      snippetIndex = (snippetIndex + 1) % codeSnippets.length;
      delay = 240;

      if (codeStatus) {
        codeStatus.textContent = "typing";
      }
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

startCodeTypingAnimation();

if (servicesToggle) {
  if (extraServiceCards.length === 0) {
    servicesToggle.hidden = true;
  } else {
    servicesToggle.addEventListener("click", () => {
      const isExpanded = servicesToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;

      extraServiceCards.forEach((card) => {
        card.hidden = !nextExpanded;
      });

      servicesToggle.setAttribute("aria-expanded", String(nextExpanded));
      servicesToggle.textContent = nextExpanded ? "Скрыть" : "Показать еще";
    });
  }
}

function updateScrollTopButtonVisibility() {
  if (!scrollTopButton || !servicesSection) {
    return;
  }

  const headerOffset = siteHeaderElement ? siteHeaderElement.offsetHeight : 0;
  const triggerPoint = Math.max(0, servicesSection.offsetTop - headerOffset - 24);
  const shouldShow = window.scrollY >= triggerPoint;

  scrollTopButton.classList.toggle("is-visible", shouldShow);
  scrollTopButton.setAttribute("aria-hidden", String(!shouldShow));
  scrollTopButton.tabIndex = shouldShow ? 0 : -1;
}

if (scrollTopButton && servicesSection) {
  updateScrollTopButtonVisibility();

  window.addEventListener("scroll", updateScrollTopButtonVisibility, { passive: true });
  window.addEventListener("resize", updateScrollTopButtonVisibility);
}

function closeFaq(item) {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!button || !answer) {
    return;
  }

  button.setAttribute("aria-expanded", "false");
  answer.classList.remove("open");
  answer.style.maxHeight = "0px";
}

function openFaq(item) {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!button || !answer) {
    return;
  }

  button.setAttribute("aria-expanded", "true");
  answer.classList.add("open");
  answer.style.maxHeight = `${answer.scrollHeight}px`;
}

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!button || !answer) {
    return;
  }

  if (button.getAttribute("aria-expanded") === "true") {
    openFaq(item);
  } else {
    closeFaq(item);
  }

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    faqItems.forEach((faqItem) => {
      if (faqItem !== item) {
        closeFaq(faqItem);
      }
    });

    if (isOpen) {
      closeFaq(item);
      return;
    }

    openFaq(item);
  });
});

window.addEventListener("load", () => {
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    if (button && button.getAttribute("aria-expanded") === "true") {
      openFaq(item);
    }
  });
});
