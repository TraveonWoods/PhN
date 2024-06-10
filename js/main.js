"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:
const $body = $("body");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $storyForm = $("#story-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $storyForm.parent()
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app
$(start);

document.getElementById('nav-submit').addEventListener('click', function(event) {
  event.preventDefault();
  document.querySelector('.story-form-container').classList.toggle('hidden');
  document.getElementById('story-form').classList.toggle('hidden');
});

async function handleStoryFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('story-title').value;
  const author = document.getElementById('story-author').value;
  const url = document.getElementById('story-url').value;

  const storyData = {
    title: title,
    author: author,
    url: url
  };

  try {
    const response = await axios.post('YOUR_API_ENDPOINT', storyData);
    if (response.status === 201) {
      alert('Story submitted successfully!');
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

document.getElementById('story-form').addEventListener('submit', handleStoryFormSubmit);

function generateStoryHTML(story, user) {
  const isFavorite = user && user.isFavorite(story.storyId);
  const starClass = isFavorite ? "fas" : "far";
  return $(`
    <li id="${story.storyId}">
      <span class="star">
        <i class="${starClass} fa-star"></i>
      </span>
      <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
      <small class="story-hostname">(${getHostName(story.url)})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

function generateStoriesHTML(stories, user) {
  const storiesList = stories.map(story => generateStoryHTML(story, user));
  $('#all-stories-list').empty().append(storiesList);
}

function getHostName(url) {
  let hostName;
  if (url.indexOf("://") > -1) {
    hostName = url.split('/')[2];
  } else {
    hostName = url.split('/')[0];
  }
  if (hostName.slice(0, 4) === "www.") {
    hostName = hostName.slice(4);
  }
  return hostName;
}

async function toggleFavorite(event) {
  const target = $(event.target);
  const storyId = target.closest('li').attr('id');
  if (currentUser.isFavorite(storyId)) {
    await currentUser.removeFavorite(storyId);
    target.removeClass('fas').addClass('far');
  } else {
    await currentUser.addFavorite(storyId);
    target.removeClass('far').addClass('fas');
  }
}

$body.on('click', '.star i', toggleFavorite);
