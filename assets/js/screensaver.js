function screensaver() {
}

(function () {

    // Ideal time in seconds 
    const idleDurationSecs = 10;

    // Variable to hold the timeout 
    let idleTimeout;

    const resetIdleTimeout = function () {

        // Clears the existing timeout 
        if (idleTimeout)
            clearTimeout(idleTimeout);

        // Set a new idle timeout to load the 
        // redirectUrl after idleDurationSecs 
        idleTimeout = setTimeout(() => screensaver(), idleDurationSecs * 1000);
    };

    // Init on page load 
    resetIdleTimeout();

    // Reset the idle timeout on any of 
    // the events listed below 
    ['click', 'touchstart', 'mousemove']
    .forEach(evt => document.addEventListener(
        evt, resetIdleTimeout, false));
})();