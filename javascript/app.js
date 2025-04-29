// Get the necessary elements
const darkModeToggle = document.getElementById("darkModeToggle");
const addLinkButton = document.getElementById("addLinkButton");
const nameInput = document.getElementById("nameInput");
const linkInput = document.getElementById("linkInput");
const categories = document.getElementById("categories");
const CATEGORY_TITLES_KEY = "categoryTitles";
let categoryTitles = JSON.parse(localStorage.getItem(CATEGORY_TITLES_KEY)) || {};

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

    // Create list item with the link and delete button
    const li = document.createElement("li");
    li.classList.add("link-item");

    // Create the link element
    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.target = "_blank"; // Open in a new tab
    linkElement.textContent = name;
    linkElement.classList.add("link-item-link");

    // Create the delete button (X)
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.classList.add("delete-btn");

    // Append the link and delete button to the list item
    li.appendChild(linkElement);
    li.appendChild(deleteButton);

    // Add the list item to the category
    const categoryLinks = document.getElementById(`${category}Links`);
    categoryLinks.appendChild(li);

    // Save link to localStorage
    const links = JSON.parse(localStorage.getItem("links")) || {};
    if (!links[category]) {
        links[category] = [];
    }
    links[category].push({ name: name, url: link });
    localStorage.setItem("links", JSON.stringify(links));

    // Add delete functionality to the button
    deleteButton.addEventListener("click", () => {
        // Remove the link from the UI
        li.remove();

        // Remove the link from Local Storage
        const links = JSON.parse(localStorage.getItem("links")) || {};
        if (links[category]) {
            const index = links[category].findIndex((item) => item.url === link);
            if (index !== -1) {
                links[category].splice(index, 1);
                localStorage.setItem("links", JSON.stringify(links));
            }
        }
    });
}

// Load links from localStorage
function loadLinks() {
    const links = JSON.parse(localStorage.getItem("links")) || {};
    for (const category in links) {
        const categoryLinks = document.getElementById(`${category}Links`);
        links[category].forEach(({ name, url }) => {
            const li = document.createElement("li");
            li.classList.add("link-item");

            // Create the link element
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.target = "_blank"; // Open in a new tab
            anchor.textContent = name;
            anchor.classList.add("link-item-link");

            // Create the delete button (X)
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "❌";
            deleteButton.classList.add("delete-btn");

            // Append the link and delete button to the list item
            li.appendChild(anchor);
            li.appendChild(deleteButton);

            // Append the list item to the category
            categoryLinks.appendChild(li);

            // Add delete functionality to the button
            deleteButton.addEventListener("click", () => {
                // Remove the link from the UI
                li.remove();

                // Remove the link from Local Storage
                const links = JSON.parse(localStorage.getItem("links")) || {};
                if (links[category]) {
                    const index = links[category].findIndex((item) => item.url === url);
                    if (index !== -1) {
                        links[category].splice(index, 1);
                        localStorage.setItem("links", JSON.stringify(links));
                    }
                }
            });
        });
    }
}

// Call loadLinks on page load
loadLinks();

function loadCategoryTitles() {
    for (const categoryId in categoryTitles) {
        const titleElement = document.querySelector(`#${categoryId} .category-title`);
        if (titleElement) {
            titleElement.textContent = categoryTitles[categoryId];
        }
    }
}
loadCategoryTitles();

document.querySelectorAll(".rename-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const titleSpan = button.previousElementSibling;
        const currentText = titleSpan.textContent;

        // Create input field
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.classList.add("category-title-input");

        // Replace the span with the input
        titleSpan.replaceWith(input);
        input.focus();

        // Save on Enter or when focus is lost
        function saveTitle() {
            const newTitle = input.value.trim() || currentText;
            const newSpan = document.createElement("span");
            newSpan.textContent = newTitle;
            newSpan.classList.add("category-title");
        
            // Save to localStorage
            const categoryId = button.closest(".category").id;
            categoryTitles[categoryId] = newTitle;
            localStorage.setItem(CATEGORY_TITLES_KEY, JSON.stringify(categoryTitles));
        
            input.replaceWith(newSpan);
        }

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveTitle();
        });

        input.addEventListener("blur", saveTitle);
    });
});