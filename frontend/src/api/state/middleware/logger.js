const zustandLogger = (storeName, newState, prevState) => {
    console.groupCollapsed(
        `%c🔄 ${storeName} State Changed`,
        'color: #7c3aed; font-weight: bold; font-size: 12px; padding: 2px 4px;'
    );
    console.log('%cPrevious State:', 'color: #ef4444; font-weight: bold;', prevState);
    console.log('%cNew State:', 'color: #22c55e; font-weight: bold;', newState);
    console.groupEnd();
};
