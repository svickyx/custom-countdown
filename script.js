const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const datePicker = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownTimeList = document.querySelectorAll('span');
const countdownBtn = document.getElementById('countdown-button');

const completeContainer = document.getElementById('complete-container');
const completeInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownFormTitle = '';
let countdownFormDate = '';

// when user set a future date in the date picker, we want to get the value of that date in milliseconds
// when we set global variable, it is important to keep the format consistance, which means, if the variable is a string, when assign a new value, its better to keep it as a string
let userSelectDateValue = new Date();

let coutdownActive;
let savedCountdownForm;
// Save localstorage:
// step 1: set global variable: savedCountdownForm(information user input in the input-container)
// step 2: in the updateCountdownForm function, change savedCountdownForm object, give it key and value;


const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


// 1. user can only set a future goal start from the day they open this website
// 2. get 'today''s date, use toISOString to standalize the format of the giving date
// 3. toISOString give back date + time: 2020-10-27T14:10:42.754Z, use split to split date and time from 'T' and choose only date(which is no.0 in the return array)
const today = new Date().toISOString().split('T')[0];
// 4. console.log(today); ===> 2020-10-27
// 5. set datePicker min value from today, so user can only choose future date from today
datePicker.setAttribute('min', today);



function updateCountdownElement() {
    countdownActive = setInterval(()=> {
        const currentDateValue = new Date().getTime();
        const distanceFromNow = userSelectDateValue - currentDateValue;
        const distanceDays = Math.floor(distanceFromNow / day);
        const distanceHours = Math.floor((distanceFromNow % day) / hour);
        const distanceMinutes = Math.floor((distanceFromNow % hour) / minute);
        const distanceSeconds = Math.floor((distanceFromNow % minute) / second);

        // when get the distance number, put condition here to decide whether go to countdown part or complete part
        // if the distance < 0, it means the countdown has finished, so populate information into complete part, stop the interval, show complete, hide count down part
        // if the distance > 0. put distance days/hours/minutes/seconds into countdown part, hide input container, show count down part
        if(distanceFromNow < 0) {
            completeInfo.textContent = `Congrats! ${countdownFormTitle} has finished on ${countdownFormDate}`;
            clearInterval(countdownActive);
            inputContainer.hidden = true;
            completeContainer.hidden = false;
        } else {
            countdownElTitle.textContent = `${countdownFormTitle}`;
            countdownTimeList[0].textContent = `${distanceDays}`;
            countdownTimeList[1].textContent = `${distanceHours}`;
            countdownTimeList[2].textContent = `${distanceMinutes}`;
            countdownTimeList[3].textContent = `${distanceSeconds}`;
    
            // Hide input container
            inputContainer.hidden = true;
            // Show count down part
            countdownEl.hidden = false;
        }
    }, second);
}

function updateCountdownForm(e) {
    e.preventDefault();
    countdownFormTitle = e.srcElement[0].value;
    countdownFormDate = e.srcElement[1].value;

    // save localStorage here: use JSON.stringify to transform js object into string, and save it at local storage
    savedCountdownForm = {
        title: countdownFormTitle,
        date: countdownFormDate
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdownForm));

    userSelectDateValue = new Date(countdownFormDate).getTime();
    updateCountdownElement();
}

function resetCountdown() {
    // Hide count down part
    countdownEl.hidden = true;
    // hide complete container
    completeContainer.hidden = true;
    // Show input container
    inputContainer.hidden = false;
    // stop the countdown
    clearInterval(countdownActive);
    //set input-container to empty string
    countdownFormTitle = '';
    countdownFormDate = '';

    // reset localStorage
    localStorage.removeItem('countdown');
}

// Get localStorage Information, put it back to countdown part, or if it's finished, go to complete part
// step 1: we want to get the localStorage info if there is one named 'countdown', (use if statement to do so)
// step 2: if 'countdown' exist, (it is JSON string format, transform to js savedCountdownForm object first), and hide the input-container,
// step 3: populate saveCOuntdownForm info into countdown part, do the updateCountdownForm function again
// step 4: when user click the rest button, localStorage should also be reset, see resetCountdown function
function getCountdownInfoFromLocalStorage() {
    if(localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdownForm = JSON.parse(localStorage.getItem('countdown'));
        countdownFormTitle = savedCountdownForm.title;
        countdownFormDate = savedCountdownForm.date;
        userSelectDateValue = new Date(countdownFormDate).getTime();
        updateCountdownElement();
    }
}



// 1. add submit event and updateCountdown function to the entire form
// 2. edit updateCountdownForm function, console.log(e) when submit the form, use preventDefault to stop refresh the page(something wrong with the submit event)
// 3. pull the title and date of submit form from event
// 4. get userSelectDateValue using getTime method
// 5. run updateCountdownElement function, this will update the countdown part
// 6. get the user actually time value when they use this app, and use the future date that user select - current time = how many milliseconds left before user achive their goal
// 7. when we get the distanceFromNow(it's show in milliseconds), we transform this value to days, hours, minutes and seconds
// 8. then we put all the distance value into the countdown part and hide the input container and show the count down part
countdownForm.addEventListener('submit', updateCountdownForm);
countdownBtn.addEventListener('click', resetCountdown);
completeBtn.addEventListener('click', resetCountdown);

// Make sure the localStorage is always working, so loading the getCountdownInfoFromLOcalStorage function on hold
getCountdownInfoFromLocalStorage();
