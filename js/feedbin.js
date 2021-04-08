(function a() {
    const scope = {
        target:   document.getElementsByTagName('title')[0],
        oldValue: document.title,
    };

    scope.onChange = () => {
        if (scope.oldValue !== document.title) {
            scope.oldValue = document.title;
            
            const match = document.title.match(/Feedbin(?: \((\d+)\))*/);

            if (match !== null && match.length > 1 && match[1] !== undefined) {
                const unreadCount = match[1];
                browser.runtime.sendMessage({ newCount: unreadCount });
            }
        }
    };

    scope.delay = () => {
        setTimeout(scope.onChange, 1);
    };

    scope.target.addEventListener('DOMSubtreeModified', scope.delay, false);
}());
