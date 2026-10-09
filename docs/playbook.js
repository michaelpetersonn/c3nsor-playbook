const ACTIVE_OFFSET_PX = 32;

/**
 * Index of the heading the reader is in: the last one whose top edge has
 * scrolled past `threshold`. At the bottom of the page the last heading wins,
 * because short final sections can never reach the threshold.
 * @param {number[]} tops viewport-relative heading tops, in document order
 * @param {number} threshold
 * @param {boolean} atBottom
 * @returns {number}
 */
export function activeIndex(tops, threshold, atBottom = false) {
  if (tops.length === 0) return -1;
  if (atBottom) return tops.length - 1;
  let active = 0;
  for (let i = 0; i < tops.length; i += 1) {
    if (tops[i] > threshold) break;
    active = i;
  }
  return active;
}

function initContents() {
  const toc = document.getElementById("toc");
  const header = document.querySelector(".site-header");
  if (!toc || !header) return;

  const toggle = toc.querySelector(".toc-toggle");
  const current = toc.querySelector(".toc-toggle-current");
  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const entries = links
    .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
    .filter((entry) => entry.target);
  if (entries.length === 0) return;

  let activeLink = null;
  let frame = 0;

  const setOpen = (open) => {
    toc.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  const keepVisible = (link) => {
    if (toc.scrollHeight <= toc.clientHeight) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    if (top < toc.scrollTop) toc.scrollTop = top - 48;
    else if (bottom > toc.scrollTop + toc.clientHeight) toc.scrollTop = bottom - toc.clientHeight + 48;
  };

  const update = () => {
    frame = 0;
    const threshold = header.offsetHeight + ACTIVE_OFFSET_PX;
    const scroller = document.documentElement;
    const atBottom = window.innerHeight + window.scrollY >= scroller.scrollHeight - 2;
    const tops = entries.map((entry) => entry.target.getBoundingClientRect().top);
    const { link } = entries[activeIndex(tops, threshold, atBottom)];
    if (link === activeLink) return;

    if (activeLink) activeLink.removeAttribute("aria-current");
    link.setAttribute("aria-current", "location");
    const chapter = link.closest(".toc-chapter");
    toc.querySelectorAll(".toc-chapter.is-active").forEach((item) => {
      if (item !== chapter) item.classList.remove("is-active");
    });
    chapter.classList.add("is-active");
    current.textContent = chapter.querySelector(":scope > a span").textContent;
    activeLink = link;
    keepVisible(link);
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  toggle.hidden = false;
  toggle.addEventListener("click", () => setOpen(!toc.classList.contains("is-open")));
  toc.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toc.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}

if (typeof document !== "undefined") {
  document.documentElement.classList.add("js");
  initContents();
}
