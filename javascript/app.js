// Get the necessary elements
const darkModeToggle = document.getElementById("darkModeToggle");
const addLinkButton = document.getElementById("addLinkButton");
const linkInput = document.getElementById("linkInput");
const categories = document.getElementById("categories");

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // Save dark mode state to localStorage
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Load dark mode state from localStorage
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}

// Add Link Functionality
addLinkButton.addEventListener("click", () => {
    const link = linkInput.value.trim();
    if (link) {
        addLink(link);
        linkInput.value = ""; // Clear input field after adding
    }
});

// Function to add link to a category
function addLink(link) {
    const category = "category1"; // Default category for now

    // Create list item with the link
    const li = document.createElement("li");
    li.textContent = link;
    
    // Add link to category
    const categoryLinks = document.getElementById(`${category}Links`);
    categoryLinks.appendChild(li);

    // Save link to localStorage
    const links = JSON.parse(localStorage.getItem("links")) || {};
    if (!links[category]) {
        links[category] = [];
    }
    links[category].push(link);
    localStorage.setItem("links", JSON.stringify(links));
}

// Load links from localStorage
function loadLinks() {
    const links = JSON.parse(localStorage.getItem("links")) || {};
    for (const category in links) {
        const categoryLinks = document.getElementById(`${category}Links`);
        links[category].forEach(link => {
            const li = document.createElement("li");
            li.textContent = link;
            categoryLinks.appendChild(li);
        });
    }
}

// Call loadLinks on page load
loadLinks();
