// STEP 1: GET REFERENCES TO ALL HTML ELEMENTS WE'LL USE
// This is like creating shortcuts to elements on the page so we can interact with them

// Form input elements
const courseSelect = document.getElementById('course-select');
// Gets the course dropdown

const dateSelect = document.getElementById('date-select');
// Gets the date picker

const timeSelect = document.getElementById('time-select');
// Gets the time slot dropdown

// Button elements
const checkAvailabilityBtn = document.getElementById('check-availability-btn');
// Gets the "Check Availability" button

const continueBtn = document.getElementById('continue-btn');
// Gets the "Continue to Choose Tutor" button

// Result containers
const availabilityResult = document.getElementById('availability-result');
// Gets the container that holds success/warning messages

const availableMessage = document.getElementById('available-message');
// Gets the green success message

const unavailableMessage = document.getElementById('unavailable-message');
// Gets the yellow warning message

const tutorCount = document.getElementById('tutor-count');
// Gets the span that shows number of tutors

const unavailableTime = document.getElementById('unavailable-time');
// Gets the span that shows the unavailable time

const alternativeTimes = document.getElementById('alternative-times');
// Gets the container for alternative time buttons

const selectionForm = document.getElementById('selection-form');
// Gets the entire form