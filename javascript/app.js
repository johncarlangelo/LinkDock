// Get the necessary elements
const darkModeToggle = document.getElementById("darkModeToggle");
const addLinkButton = document.getElementById("addLinkButton");
const nameInput = document.getElementById("nameInput");
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
    const name = nameInput.value.trim();
    const link = linkInput.value.trim();
    if (name && link) {
        addLink(name, link);
        nameInput.value = ""; // Clear name input field
        linkInput.value = ""; // Clear link input field
    }
});

// Function to add link to a category
function addLink(name, link) {
    const category = "category1"; // Default category for now

    // Create list item with the name and link
    const li = document.createElement("li");

    // Create a link element
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";  // This ensures the link opens in a new tab
    anchor.textContent = name;
    anchor.classList.add("link-item"); // Adding class for styling

    // Append anchor to list item
    li.appendChild(anchor);
    
    // Add list item to category
    const categoryLinks = document.getElementById(`${category}Links`);
    categoryLinks.appendChild(li);

    // Save link to localStorage
    const links = JSON.parse(localStorage.getItem("links")) || {};
    if (!links[category]) {
        links[category] = [];
    }
    links[category].push({ name, link });
    localStorage.setItem("links", JSON.stringify(links));
}

// Load links from localStorage
function loadLinks() {
    const links = JSON.parse(localStorage.getItem("links")) || {};
    for (const category in links) {
        const categoryLinks = document.getElementById(`${category}Links`);
        links[category].forEach(({ name, link }) => {
            const li = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.href = link;
            anchor.target = "_blank";  // This ensures the link opens in a new tab
            anchor.textContent = name;
            anchor.classList.add("link-item"); // Adding class for styling
            li.appendChild(anchor);
            categoryLinks.appendChild(li);
        });
    }
}

// Call loadLinks on page load
loadLinks();
