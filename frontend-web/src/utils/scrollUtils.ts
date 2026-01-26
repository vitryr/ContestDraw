/**
 * Smooth scroll utility for anchor navigation
 * Provides smooth scrolling to section IDs with offset for fixed headers
 */

export const scrollToSection = (sectionId: string, offset: number = 80) => {
  const element = document.getElementById(sectionId);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export const handleAnchorClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) => {
  // Check if it's an anchor link (starts with #)
  if (href.startsWith("#")) {
    event.preventDefault();
    const sectionId = href.substring(1);

    if (sectionId) {
      scrollToSection(sectionId);

      // Update URL without scrolling
      window.history.pushState(null, "", href);
    }
  }
};

/**
 * Navigate to a different page and then scroll to a section
 * Useful for footer links that need to navigate to home page first
 */
export const navigateAndScroll = (
  navigate: (path: string) => void,
  path: string,
  sectionId?: string,
) => {
  if (path === window.location.pathname && sectionId) {
    // Same page, just scroll
    scrollToSection(sectionId);
  } else {
    // Different page, navigate first
    navigate(path);

    // Wait for navigation and then scroll
    if (sectionId) {
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  }
};
