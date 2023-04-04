(function a() {
    const scope = {
        target:   document.querySelector('title'),
        oldValue: document.title,
    };

    scope.onChange = () => {
        if (scope.oldValue !== document.title) {
            scope.oldValue = document.title;
            
            const match = document.title.match(/Feedbin(?: \((\d+)\))*/);
            if (match !== null && match.length > 1) {
                const unreadCount = match[1] || 0;
                browser.runtime.sendMessage({ newCount: unreadCount });
            }
        }
    };

    scope.delay = (mutationList, _observer) => {
        for (const _mutation of mutationList) {
            scope.onChange();
        }
    };

    const observerOptions = { childList: true };
    const observer = new MutationObserver(scope.delay);
    observer.observe(scope.target, observerOptions);
}());
