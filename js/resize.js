// resize.js

let isResizing = false;
const handle = document.getElementById('resizable-handle');
const sidebar = document.querySelector('aside');
const minSidebarWidth = window.innerWidth * 0.2; // 20% of the window width
const maxSidebarWidth = window.innerWidth * 0.4; // 40% of the window width

handle.addEventListener('mousedown', (e) => {
  console.log("Mouse down event triggered"); // Debugging line
  isResizing = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', () => {
    console.log("Mouse up event triggered"); // Debugging line
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
  });
});

function handleMouseMove(e) {
  console.log("Mouse move event triggered"); // Debugging line
  if (isResizing) {
    const newSidebarWidth = e.clientX;
    console.log("New sidebar width: ", newSidebarWidth); // Debugging line
    if (newSidebarWidth >= minSidebarWidth && newSidebarWidth <= maxSidebarWidth) {
      sidebar.style.width = newSidebarWidth + 'px';
    }
  }
}