// ==========================================
// GitHub Repository Explorer
// ==========================================

// Get elements from HTML
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const statusContainer = document.getElementById("status");


// ==========================================
// Search GitHub Repositories
// ==========================================

async function searchRepositories() {

    // Get the user's search text
    const query = searchInput.value.trim();

    // Clear previous results
    resultsContainer.innerHTML = "";
    statusContainer.innerHTML = "";

    // Check if search box is empty
    if (query === "") {
        statusContainer.innerHTML =
            "<p>Please enter a repository name to search.</p>";
        return;
    }

    // Show loading message
    statusContainer.innerHTML =
        "<p>Searching GitHub...</p>";

    try {

        // GitHub Search API
        const apiUrl =
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`;

        // Send request to GitHub
        const response = await fetch(apiUrl);

        // Check if GitHub returned an error
        if (!response.ok) {

            if (response.status === 403) {
                throw new Error(
                    "GitHub API rate limit reached. Please try again later."
                );
            }

            throw new Error(
                `GitHub API error: ${response.status}`
            );
        }

        // Convert response into JavaScript object
        const data = await response.json();

        // Check if no repositories were found
        if (data.items.length === 0) {

            statusContainer.innerHTML =
                "<p>No repositories found.</p>";

            return;
        }

        // Remove loading message
        statusContainer.innerHTML =
            `<p>Found ${data.total_count.toLocaleString()} repositories.</p>`;

        // Display repositories
        displayRepositories(data.items);

    } catch (error) {

        console.error("Error:", error);

        statusContainer.innerHTML =
            `<p>${error.message}</p>`;
    }
}


// ==========================================
// Display Repository Cards
// ==========================================

function displayRepositories(repositories) {

    resultsContainer.innerHTML = "";

    repositories.forEach(repository => {

        // Create repository card
        const card = document.createElement("div");

        card.classList.add("repository-card");

        card.innerHTML = `
            <h3>
                ${repository.full_name}
            </h3>

            <p>
                ${repository.description || "No description available."}
            </p>

            <div class="repository-meta">

                <span>
                    ⭐ ${repository.stargazers_count.toLocaleString()}
                </span>

                <span>
                    💻 ${repository.language || "Unknown"}
                </span>

                <span>
                    🍴 ${repository.forks_count.toLocaleString()}
                </span>

            </div>

            <br>

            <a
                href="${repository.html_url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                View Repository →
            </a>
        `;

        resultsContainer.appendChild(card);
    });
}


// ==========================================
// Button Click
// ==========================================

searchButton.addEventListener("click", searchRepositories);


// ==========================================
// Search Using Enter Key
// ==========================================

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchRepositories();
    }

});