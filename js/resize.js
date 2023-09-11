// resize.js

let isResizing = false;
const handle = document.getElementById('resizable-handle');
const sidebar = document.querySelector('aside');
const minSidebarWidth = window.innerWidth * 0.1; // 10% of the window width
const maxSidebarWidth = window.innerWidth * 0.4; // 40% of the window width

handle.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
  });
});

function handleMouseMove(e) {
  if (isResizing) {
    const newSidebarWidth = e.clientX;
    if (newSidebarWidth >= minSidebarWidth && newSidebarWidth <= maxSidebarWidth) {
      sidebar.style.width = newSidebarWidth + 'px';
    }
  }
}