const { DateTime } = require("luxon");

/**
 * One line from original data CSV
 * @typedef {Object} OrigSchedItem
 * @property {string} id
 * @property {string} type
 * @property {string} belongs_to
 * @property {string} title
 * @property {string} presented_by
 * @property {string} room
 * @property {string} time_start
 * @property {string} time_end
 */

/**
 * Schedule item
 * @typedef {Object} SchedItem
 * @property {number} id
 * @property {string} type
 * @property {string} belongs_to
 * @property {string} title
 * @property {string} presented_by
 * @property {string} room
 * @property {string} time_start
 * @property {number} time_start_shift
 * @property {string} time_end
 * @property {number} time_end_shift
 * @property {SchedItem[]} children
 */

module.exports = {
  schedule_array: data => {
    /**
     * Converts CSV record to SchedItem format; does not populat children.
     * @function origToNewItem
     * @param {OrigSchedItem} origItem
     * @returns {SchedItem}
     */
    function origToNewItem(origItem) {
      return {
        ...origItem,
        id: parseInt(origItem.id),
        time_start_shift: DateTime.fromISO(`${data.constants.eventDate}T${origItem.time_start}`),
        time_end_shift: DateTime.fromISO(`${data.constants.eventDate}T${origItem.time_end}`),
        children: []
      };
    }

    /** @type {OrigSchedItem[]} */
    const orig_schedule = data.bdsd_sched;

    /** @type {SchedItem[]} */
    const arr = orig_schedule.map(origToNewItem);

    // Sort by start time
    arr.sort((itemA, itemB) => itemA.time_start_shift - itemB.time_start_shift);

    // Populate array's children based on belongs_to
    arr.forEach(item => {
      item.children = arr.filter(candidate => candidate.belongs_to == item.type);
    });

    return arr;
  },

  test: data => {
    /** @type {OrigSchedItem[]} */
    const orig_schedule = data.bdsd_sched;

    return Number(orig_schedule[4].id) + Number(orig_schedule[5].id);
  }
};