"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
document.addEventListener('DOMContentLoaded', () => {
  function toggleStoryForm(event) {
    event.preventDefault();
    const storyFormContainer = document.querySelector('.story-form-container');
    const storyForm = document.getElementById('story-form');
    storyFormContainer.classList.toggle('hidden');
    storyForm.classList.toggle('hidden');
  }

  document.getElementById('nav-submit').addEventListener('click', toggleStoryForm);
});
