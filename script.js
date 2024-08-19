const submitDebateButton = document.getElementById('submitDebate');
const debateTopicInput = document.getElementById('debateTopic');
const debatesContainer = document.getElementById('debatesContainer');
const errorMessage = document.getElementById('error-message');

let debates = [];

// Function to render debates
function renderDebates() {
    debatesContainer.innerHTML = '';
    debates.forEach((debate, index) => {
        const debateDiv = document.createElement('div');
        debateDiv.className = 'debate';
        debateDiv.style.opacity = 0; // Start with opacity 0 for transition
        debateDiv.innerHTML = `
            <h3>${debate.topic}</h3>
            <div class="input-group">
                <textarea placeholder="Enter your argument" id="argumentInput${index}" rows="3" oninput="autoResize(this)"></textarea>
            </div>
            <div class="button-container">
                <button onclick="submitArgument(${index})">Submit</button>
            </div>
            <div class="sort-group">
                <label for="sortArguments${index}">Sort Arguments:</label>
                <select id="sortArguments${index}" class="sort-select" aria-label="Sort arguments for ${debate.topic}" onchange="sortArguments(${index})">
                    <option value="highest">Highest Likes</option>
                    <option value="lowest">Lowest Likes</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
            <div id="argumentsContainer${index}">
                <h4>Arguments:</h4>
                <button onclick="toggleArguments(${index})" class="toggle-arguments">Show</button>
                <div class="arguments-list" id="argumentsList${index}" style="display: none;">
                    ${renderArguments(debate.arguments)}
                </div>
            </div>
        `;
        debatesContainer.appendChild(debateDiv);
        setTimeout(() => { debateDiv.style.opacity = 1; }, 10); // Fade in effect
    });
}

// Function to render arguments
function renderArguments(argumentsList) {
    return argumentsList.map(arg => {
        const voteClass = arg.votes > 0 ? 'positive' : arg.votes < 0 ? 'negative' : '';
        return `
            <div class="argument">
                <span>${arg.text.trim()}</span>
                <div class="argument-buttons">
                    <button onclick="voteArgument(${arg.id}, 1)">
                        <i class="fas fa-thumbs-up"></i>
                    </button>
                    <button onclick="voteArgument(${arg.id}, -1)">
                        <i class="fas fa-thumbs-down"></i>
                    </button>
                    <span class="vote-count ${voteClass}">Votes: <span id="voteCount${arg.id}">${arg.votes}</span></span>
                </div>
            </div>
        `;
    }).join('');
}

// Function to toggle arguments visibility
function toggleArguments(debateIndex) {
    const argumentsList = document.getElementById(`argumentsList${debateIndex}`);
    const toggleButton = argumentsList.previousElementSibling; // Get the toggle button
    if (argumentsList.style.display === 'none') {
        argumentsList.style.display = 'block';
        toggleButton.textContent = 'Hide'; // Change button text
    } else {
        argumentsList.style.display = 'none';
        toggleButton.textContent = 'Show'; // Change button text
    }
}

// Function to submit a new debate topic
submitDebateButton.addEventListener('click', () => {
    const topic = debateTopicInput.value.trim();
    if (topic) {
        errorMessage.style.display = 'none'; // Hide error message
        debates.push({ topic, arguments: [] });
        debateTopicInput.value = '';
        renderDebates();
    } else {
        errorMessage.textContent = 'Please enter a debate topic.';
        errorMessage.style.display = 'block'; // Show error message
    }
});

// Function to submit an argument
function submitArgument(debateIndex) {
    const argumentInput = document.getElementById(`argumentInput${debateIndex}`);
    const argumentText = argumentInput.value.trim();
    if (argumentText) {
        const newArgument = {
            id: Date.now(),
            text: argumentText,
            votes: 0
        };
        debates[debateIndex].arguments.push(newArgument);
        argumentInput.value = ''; // Clear the input after submission
        sortArguments(debateIndex); // Sort arguments after adding a new one
        renderArgumentsForDebate(debateIndex); // Render only the arguments for the specific debate
    } else {
        alert('Please enter an argument.'); // Alert for empty argument submission
    }
}

// Function to render arguments for a specific debate
function renderArgumentsForDebate(debateIndex) {
    const argumentsContainer = document.getElementById(`argumentsList${debateIndex}`);
    argumentsContainer.innerHTML = renderArguments(debates[debateIndex].arguments);
}

// Function to vote on an argument
function voteArgument(argumentId, vote) {
    for (let debate of debates) {
        const argument = debate.arguments.find(arg => arg.id === argumentId);
        if (argument) {
            argument.votes += vote;
            sortArguments(debates.indexOf(debate)); // Sort after voting
            renderArgumentsForDebate(debates.indexOf(debate)); // Render only the arguments for the specific debate
            break; // Exit loop once found
        }
    }
}

// Function to sort arguments
function sortArguments(debateIndex) {
    const sortOption = document.getElementById(`sortArguments${debateIndex}`).value;
    const argumentsList = debates[debateIndex].arguments;

    switch (sortOption) {
        case 'highest':
            argumentsList.sort((a, b) => b.votes - a.votes);
            break;
        case 'lowest':
            argumentsList.sort((a, b) => a.votes - b.votes);
            break;
        case 'newest':
            argumentsList.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            argumentsList.sort((a, b) => a.id - b.id);
            break;
    }
    renderArgumentsForDebate(debateIndex); // Render only the arguments for the specific debate
}

// Function to auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set height to scroll height
}

// Initial render
renderDebates();

