
function autoScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionPosition = section.offsetTop;
    window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
    });
}
