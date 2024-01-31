// create-draft.js

function createNewDraft(event) {
  // Perform any actions or logic you want when the "Create New Draft" button is clicked
  // For example, you can display a confirmation message or perform additional validations

  // Once the necessary actions are completed, submit the form programmatically
  const form = document.querySelector("#createDraftForm");
  if (form) {
    form.submit();
  }
}