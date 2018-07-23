/**
 * publish/subscribe 模式
 * @type {{events: {}, on: (function(*, *=)), emit: (function(*, *=))}}
 */
window.eventHub = {
    events: {

    },
    emit(eventName, data) { // publish
        const onList = this.events[eventName] || [];
        onList.map((fn) => {
            fn.call(undefined, data);
        })
    },
    on(eventName, fn) { // subscribe
        const onList = this.events[eventName] || [];
        onList.push(fn);
    }
};