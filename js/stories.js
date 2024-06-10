"use strict";
async function handleStoryFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const title = document.getElementById('story-title').value;
  const author = document.getElementById('story-author').value;
  const url = document.getElementById('story-url').value;

  const storyData = {
    title: title,
    author: author,
    url: url
  };

  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint where you want to send the data
    const response = await axios.post('YOUR_API_ENDPOINT', storyData);
    if (response.status === 201) {
      // Assuming 201 is the status code for successful creation
      alert('Story submitted successfully!');
      // Optionally, you can reset the form and hide it after successful submission
      document.getElementById('story-form').reset();
      document.querySelector('.story-form-container').classList.add('hidden');
    } else {
      alert('Failed to submit the story. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting the story:', error);
    alert('An error occurred while submitting the story. Please try again.');
  }
}

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
let currentPage = 1; // Track the current page of stories

// Function to fetch more stories and append them to the list
async function fetchMoreStories() {
  try {
    const response = await axios.get(`${BASE_URL}/stories?page=${currentPage}`);
    const newStories = response.data.stories.map(story => new Story(story));
    currentPage++;
    return newStories;
  } catch (error) {
    console.error("Error fetching more stories:", error);
    return [];
  }
}

// Function to check if the user has scrolled to the bottom of the page
function isAtBottom() {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

// Function to handle the scroll event and trigger fetching more stories
async function handleScroll() {
  if (isAtBottom()) {
    const newStories = await fetchMoreStories();
    if (newStories.length > 0) {
      // Append new stories to the list
      newStories.forEach(story => {
        const storyHTML = generateStoryHTML(story, currentUser);
        $allStoriesList.append(storyHTML);
      });
    } else {
      // No more stories available, remove scroll event listener
      window.removeEventListener("scroll", handleScroll);
    }
  }
}

// Listen for the scroll event
window.addEventListener("scroll", handleScroll);
// JavaScript code to toggle the 'clicked' class when the star is clicked
$('.star').click(function() {
  $(this).toggleClass('clicked');
});
