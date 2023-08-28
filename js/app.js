/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * 
*/

const sectionsDOM = document.querySelectorAll('section');
const pageHeaderDOM = document.querySelector('.page__header');
let navDOM = null;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

function handleMenuAnchorClick(sectionID){
    // Return an arrow function that handles the click event
    return (event) => {
        // Prevent the default behavior of the anchor element (page scroll)
        event.preventDefault();

        // Scroll to the specified section using the provided sectionID
        scrollToSection(sectionID);
    }
}

function navLinkRemoveActive(sectionID) {
    document.querySelector(`a[data-section-id="${sectionID}"]`).classList.remove('active');
}

function navLinkAddActive(sectionID) {
    document.querySelector(`a[data-section-id="${sectionID}"]`).classList.add('active');
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
function buildNav() {
    navDOM = document.createElement('nav')
    // Add a CSS class to the <nav> element
    navDOM.className = 'navbar__menu';
    pageHeaderDOM.appendChild(navDOM);
}

// Function to hide the navbar
function hideNav() {
    navDOM.classList.add('hidden');
}

// Function to show the navbar
function showNav() {
    navDOM.classList.remove('hidden');
}

// Automatically hides the navigation bar when there's no scrolling activity for a certain period of time.
function autoHideNavbarOnIdleScroll() {
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        // Clear the timeout while scrolling
        window.clearTimeout(isScrolling);
        
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function() {
            console.log(navDOM.getBoundingClientRect())
            if(window.scrollY >= 32) {
                // Hide the navbar after scrolling ends
                hideNav();
            }
             
        }, 400); // 400ms: To give user time to navigate between sections
    
        // Show the navbar immediately
        showNav();
    });
}

// Add class 'active' to section when near top of viewport
function activeOnNearTopViewport(sectionDOM) {
    // Create an IntersectionObserver to track element visibility
    const observer = new IntersectionObserver(entries => {
        // Check if the observed element is intersecting with the viewport
        if (entries[0].isIntersecting) {

            // Get references to the next and previous siblings of the observed element
            const nextSibling = sectionDOM.nextElementSibling;
            const prevSibling = sectionDOM.previousElementSibling;
            // Remove the 'active' class from next and previous siblings if they exist
            if (nextSibling) {
                nextSibling.classList.remove('active');
                navLinkRemoveActive(nextSibling.id)
            }

            if (prevSibling && prevSibling.tagName === 'SECTION') {
                prevSibling.classList.remove('active');
                navLinkRemoveActive(prevSibling.id);
            }

            sectionDOM.classList.add('active');
            navLinkAddActive(sectionDOM.id);
        }
    }, { threshold: 0.65 }); // Define the intersection threshold for triggering the observer

    // Start observing the provided DOM element
    observer.observe(sectionDOM);
}

// Scroll to anchor ID using scrollTO event
function scrollToSection(sectionID) {
    const scrollToElementDOM = document.querySelector(`section[id="${sectionID}"]`);

    // Get the position and dimensions of the element relative to the viewport
    const scrollToElementRect = scrollToElementDOM.getBoundingClientRect();

    // Calculate the scroll position needed to bring the element to the top of the viewport
    const scrollToValue = window.scrollY - (scrollToElementRect.top * -1);

    window.scrollTo({
        top: scrollToValue,
        behavior: 'smooth'
    });
}

function activeBtnGoTopOnScrollEnd() {
    const scrollToTopBtnDOM = document.getElementById('scrollToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY + 1100 >= document.documentElement.scrollHeight) {
            scrollToTopBtnDOM.classList.add('active');
        } else {
            scrollToTopBtnDOM.classList.remove('active');
        }
    });

    // Scroll to the top when the button is clicked
    scrollToTopBtnDOM.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 
const navMenuListDOM = document.createElement('ul');
navMenuListDOM.id = 'navbar__list';

// Scroll to section on link click
sectionsDOM.forEach(section => {
    const sectionID = section.id;
    const sectionNavText = section.dataset.nav;

    const menuListItemDOM = document.createElement('li');
    const menuListItemAnchorDOM = document.createElement('a');
    const menuListItemAnchorTextDOM = document.createTextNode(sectionNavText);

    // Configure the anchor element with attributes and content
    menuListItemAnchorDOM.href = "#"; 
    menuListItemAnchorDOM.setAttribute('data-section-id', sectionID);
    menuListItemAnchorDOM.className = 'menu__link';
    menuListItemAnchorDOM.appendChild(menuListItemAnchorTextDOM);

    // Attach a click event listener to the anchor element
    menuListItemAnchorDOM.addEventListener('click', handleMenuAnchorClick(sectionID));

    menuListItemDOM.appendChild(menuListItemAnchorDOM);
    navMenuListDOM.appendChild(menuListItemDOM);
});

buildNav();
navDOM.appendChild(navMenuListDOM);

// Set sections as active
sectionsDOM.forEach(section=> activeOnNearTopViewport(section));

autoHideNavbarOnIdleScroll();
activeBtnGoTopOnScrollEnd();