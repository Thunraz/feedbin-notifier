/**
 * Save settings to localStorage.
 * @param {Event} evt Button click event
 * @returns {boolean} Always returns false.
 */
function saveOptions(evt) {
    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const interval = document.getElementById('interval');
    const intervalValue = parseInt(interval.value, 10);
    const button         = document.getElementById('save');
    const successMessage = document.getElementById('successMessage');

    // Set values in localStorage
    localStorage.email    = email;
    localStorage.password = password;
    localStorage.interval = intervalValue;

    // Disable save button again
    button.disabled = true;

    // Show label
    successMessage.classList.add('visible');
    setTimeout(() => successMessage.classList.remove('visible'), 5000);

    // Recreate the alarm
    browser.alarms.create('feedbin-updater', {
        delayInMinutes:  intervalValue,
        periodInMinutes: intervalValue,
    });
    
    // Refresh feeds right now
    browser.runtime.sendMessage({ refresh: true }, () => {});
    
    evt.preventDefault();
    return false;
}

/**
 * Restore options page state from localStorage
 * @returns {void}
 **/
function restoreOptions() {
    const { email, password, interval } = localStorage;

    // Set values
    if (email) {
        document.getElementById('email').value = email;
    }

    if (password) {
        document.getElementById('password').value = password;
    }

    if (interval) {
        document.getElementById('interval').value = interval;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();

    const settings = document.getElementById('settings');
    const save     = document.getElementById('save');
    const email    = document.getElementById('email');
    const password = document.getElementById('password');
    const interval = document.getElementById('interval');

    const enableSubmit = () => {
        // Just do some basic validation
        if (email.value && password.value
            && interval.value && interval.value > 0
            && interval.value.match(/^[0-9]+$/)) {
            document.getElementById('save').disabled = false;
        } else {
            document.getElementById('save').disabled = true;
        }
    };

    settings.addEventListener('submit', saveOptions);
    save.addEventListener('click', saveOptions);
    
    email.addEventListener('keyup',    enableSubmit);
    password.addEventListener('keyup', enableSubmit);
    interval.addEventListener('keyup', enableSubmit);
    interval.addEventListener('change',  enableSubmit);
});
