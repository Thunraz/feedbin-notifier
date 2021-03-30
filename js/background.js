function updateIconOverlay(numberOfFeeds) {
    if (numberOfFeeds != null) {
        if (numberOfFeeds > 999) {
            browser.browserAction.setBadgeText({ text: '999+' });
        } else if (numberOfFeeds === 0) {
            browser.browserAction.setBadgeText({ text: '' });
        } else {
            browser.browserAction.setBadgeText({ text: numberOfFeeds.toString() });
        }
    } else {
        browser.browserAction.setBadgeText({ text: '!' });

        // An error occurred, show the user by setting the background color to an opaque red.
        browser.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    }
}

function handleStateChange() {
    if (this.readyState === this.DONE) {
        if (this.status === 200 && this.responseText != null) {
            const numberOfFeeds = JSON.parse(this.responseText).length;
            // eslint-disable-next-line no-console
            console.log(`Found ${numberOfFeeds} unread entries.`);
            updateIconOverlay(numberOfFeeds);
        } else {
            updateIconOverlay(null);
        }
    }
}

function getNumberOfUnreadFeeds(alarm) {
    if (alarm && alarm.name === 'feedbin-updater') {
        const { email, password } = localStorage;

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleStateChange;

        if (email != null && email !== '' && password != null && password !== '') {
            xhr.withCredentials = true;
            xhr.open('GET', 'https://api.feedbin.com/v2/unread_entries.json', true, email, password);
            xhr.send();
        }
    }
}

function setAlarm() {
    const interval = parseInt(localStorage.interval, 10) || 15;

    browser.alarms.create('feedbin-updater', {
        delayInMinutes:  interval,
        periodInMinutes: interval,
    });
    
    browser.alarms.onAlarm.addListener(getNumberOfUnreadFeeds);
}

if (browser.runtime && browser.runtime.onStartup) {
    setAlarm();
    getNumberOfUnreadFeeds({ name: 'feedbin-updater' });

    // Open feedbin.com on click on the button
    browser.browserAction.onClicked.addListener(() => {
        browser.tabs.create({ url: 'https://feedbin.com' }, () => {});
    });
}

browser.runtime.onMessage.addListener(
    (req) => {
        if (req.refresh !== null && req.refresh) {
            getNumberOfUnreadFeeds({ name: 'feedbin-updater' });
        } else if (req.newCount !== null) {
            updateIconOverlay(req.newCount);
        }
    },
);
