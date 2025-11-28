let defaultPrompts = [{
    id: 1,
    title: "WCAG Color Contrast Checker",
    text: "Do these two colors pass the Level AAA test? Hex 1: [insert], Hex 2: [insert]",
    tags: ["css", "accessibility"],
},
{
    id: 2,
    title: "Code Reviewer",
    text: `Act as a Senior [programming language] Developer.
I will provide a code snippet. Please perform a code review looking for any errors.
Here is the code: [PASTE CODE HERE]`,
    tags: ["python", "java", "javascript", "code review"],
}, 
{
    id: 3,
    title: "Make Website Mobile Responsive",
    text: `Act as a Senior Front-End Developer.
 I will provide a code snippet. Analyze if my current code is mobile-friendly, if not,
revise it and make it mobile-friendly.
Here is th code: [PASTE CODE HERE]`,
    tags: ["css", "mobile responsive", "accessibility"],
},
{
    id: 4,
    title: "Recommend Best Array Higher Order Functions",
    text: "For this kind of array, [explain here], recommend me which higher order function works best here",
    tags: ["javascript", "arrays"],
},
];

let promptData = JSON.parse(localStorage.getItem("prompt")) || defaultPrompts;

const promptForm = document.querySelector(".prompt-form");
const promptContainer = document.getElementById("prompt-container");
const promptTitle = document.getElementById("prompt-title");
const promptTextArea = document.getElementById("user-prompt");
const promptTags = document.getElementById("tags");
const submitBtn = document.getElementById("submit-btn");;
const filterContainer = document.querySelector(".filter-container");

function renderPrompts(listToRender) {
    promptContainer.innerHTML = "";
    const htmlString = listToRender.map((prompt) => {
        return `<div class="prompt-card" id="${prompt.id}">
            <h2>${prompt.title}</h2>
            <p>${prompt.text}</p>
            <div class="tags">Tags: ${prompt.tags.join(", ")}</div>
            <button class="delete-btn">Delete</button>
            <button class="copy-btn">Copy</button>
        </div>`;
    }).join("");
    promptContainer.innerHTML = htmlString;
};

promptForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = promptTitle.value;
    const text = promptTextArea.value;
    const rawTags = promptTags.value;

    // String -> Array
    const tagsArray = rawTags.split(",").map((tag) => tag.trim().toLowerCase());

    const newPrompt = {
        id: Date.now(),
        title: title,
        text: text,
        tags: tagsArray,
    };

    promptData.push(newPrompt);
    promptForm.reset();
    localStorage.setItem("prompt", JSON.stringify(promptData));
    // Makes sure that it reflects the new data submitted onto the screen.
    currentFilter = "all";
    renderPrompts(promptData);
});

let currentFilter = "all";

function handleFilter() {
    if (currentFilter === "all") {
        renderPrompts(promptData);
    } else {
        // Dynamic filtering: Show prompts where tags include the current filter
        const filteredList = promptData.filter((prompt) => prompt.tags.includes(currentFilter));
        renderPrompts(filteredList);
    }
}


promptContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const promptEl = e.target.parentElement;
        const idToDelete = Number(promptEl.id);
        promptData = promptData.filter((prompt) => prompt.id !== idToDelete);
        handleFilter();
        localStorage.setItem("prompt", JSON.stringify(promptData));
    } else if (e.target.classList.contains("copy-btn")) {
        const promptEl = e.target.parentElement;
        const promptId = Number(promptEl.id);
        const promptToFind = promptData.find((item) => item.id === promptId);
        try {
            navigator.clipboard.writeText(promptToFind.text);
            // 1. Changes the copy button's text
            e.target.textContent = "Copied!";
            // 2. Add the 'success' class to change it style.
            e.target.classList.add("success");
            setTimeout(() => {
                // 3. Revert text back to "Copy"
                e.target.textContent = "Copy";
                // 4. Remove the added styling
                e.target.classList.remove("success");
            }, 2000);
        } catch (error) {
            throw new Error("Failed to copy text", error);
        }
    };
});

// Handles all the button's event listener
filterContainer.addEventListener("click", (event) => {
    if (!event.target.value) return;
    currentFilter = event.target.value;
    handleFilter();
});



renderPrompts(promptData);