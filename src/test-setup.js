import '@testing-library/jest-dom'

// jsdom does not implement IntersectionObserver — stub it so Reveal.jsx doesn't crash
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
