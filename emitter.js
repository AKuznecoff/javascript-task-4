'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: new Map(),

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }
            handler = typeof handler === 'object' ? handler
                : { func: handler, times: Infinity, frequency: 1, count: 0 };
            this.events.get(event).push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            this.events.forEach((v, k) => {
                if (k.indexOf(event) === 0 &&
                (k.length === event.length || event[k.length] === '.')) {
                    let eventsToOff = v.filter((e) => e.context === context);
                    for (let i = 0; i < eventsToOff.length; i++) {
                        let current = this.events.get(k);
                        current.splice(current.indexOf(eventsToOff[i]), 1);
                    }
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            let ev;
            let toEmit = event.split('.');
            for (let i = 0; i < toEmit.length; i++) {
                let currentEvent = toEmit.slice(0, toEmit.length - i).join('.');
                if (this.events.has(currentEvent)) {
                    ev = this.events.get(currentEvent);
                }
                if (ev) {
                    ev.forEach(e => {
                        if (e.handler.times !== 0 && e.handler.count % e.handler.frequency === 0) {
                            e.handler.func.call(e.context);
                            e.handler.times--;
                        }
                        e.handler.count++;
                    });
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            times = times <= 0 ? Infinity : times;
            this.on(event, context, { func: handler, times, frequency: 1, count: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            frequency = frequency <= 0 ? 1 : frequency;
            this.on(event, context, { func: handler, times: Infinity, frequency, count: 0 });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
