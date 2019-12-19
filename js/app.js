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
 * Define Global Variables
 * 
*/
const header = document.getElementsByClassName("page__header")[0];
const navBar = document.getElementById("navbar__list");
const sections = document.querySelectorAll("section[data-nav]");
const scrollButton = document.getElementsByClassName("scroll__button")[0];
let isScrollButtonVisible = false;
let menuItems = null;
let isScrollingOn = false;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
const getIndexOfMinPositiveBounding = (sectionsArray) => {
    const boundingArray = sectionsArray.map(section =>{
        return section.getBoundingClientRect().top;
    });

    const minBounding = boundingArray.reduce((acc, item) => item < acc && item > 0 ? item : acc, Number.MAX_SAFE_INTEGER);

    return boundingArray.findIndex(item => item === minBounding);
};

const checkElementGenetics = (element, node) => {
    while (node.parentNode){
        if (node === element){
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

const getIndexForMenuItemClicked = (event, menuArray) => {
    const target = (event && event.target) || (event && event.srcElement);

    const menuStates = menuArray.map((menu) => checkElementGenetics(menu, target));

    return menuStates.findIndex(item => item === true);
};

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
const buildMenu = ()=> {
    const menuSector = document.createDocumentFragment();
    for (const section of sections) {
        const menuItem = document.createElement("li");
        const sectionId = section.getAttribute("id");
        menuItem.innerHTML = `
            <a class= "menu__link" href="#${sectionId}">
                ${section.dataset.nav}
            </a>
            `;
        menuSector.appendChild(menuItem);
    }
    navBar.appendChild(menuSector);
    menuItems = document.querySelectorAll("a.menu__link");
};

const hideMenu = () => {
    isScrollingOn = false;
    header.classList.add("hidden");
};

const toggleScrollButton = () => {
    isScrollButtonVisible = window.scrollY > window.innerHeight / 2;
    if (isScrollButtonVisible){
        scrollButton.classList.add("visible");
    }else{
        scrollButton.classList.remove("visible");
    }
};

const scrollToTop = () => {
    window.scrollTo(0, 0);
};

// Add class 'active' to section when near top of viewport
const activateMenu = () => {
    const indexOfMinBounding = getIndexOfMinPositiveBounding([...sections]);

    [...menuItems].map((menu, index) =>{
        if (index === indexOfMinBounding) {
            menu.classList.add("active");
        }else{
            menu.classList.remove("active");
        }
    })
};

const showMenu = () => {
    if (!isScrollingOn) {
        isScrollingOn = true;
        header.classList.remove("hidden");

        setTimeout(hideMenu, 1000);
    }
};
// Scroll to anchor ID using scrollTO event
const scrollToClickedItem = (event) => {
    event.preventDefault();

    const indexOfClickedItem = getIndexForMenuItemClicked(event, [...menuItems]);

    const menuSection = sections[indexOfClickedItem];
    const sectionTopBounding = menuSection.getBoundingClientRect().top;
    window.scrollTo({top: window.scrollY + sectionTopBounding -1, left: 0});
};

/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 
buildMenu();

// Scroll to section on link click
navBar.addEventListener("click", scrollToClickedItem);

// Set sections as active
document.addEventListener("scroll", activateMenu);
document.addEventListener("scroll", showMenu);
document.addEventListener("scroll", toggleScrollButton);

