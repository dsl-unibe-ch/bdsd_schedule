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
 * @property {string[]} rooms
 * @property {string} time_start
 * @property {number} time_start_shift
 * @property {string} time_end
 * @property {number} time_end_shift
 * @property {string} time_string
 * @property {SchedItem[]} children
 */

function origToNewItem(eventDate) {
  return origItem => ({
    ...origItem,
    id: parseInt(origItem.id),
    rooms: origItem.room.split(", "),
    time_string: `${origItem.time_start}–${origItem.time_end}`,
    time_start_shift: DateTime.fromISO(`${eventDate}T${origItem.time_start}`),
    time_end_shift: DateTime.fromISO(`${eventDate}T${origItem.time_end}`),
    children: []
  });
}

function schedule_array(data) {
    /** @type {OrigSchedItem[]} */
    const orig_schedule = data.bdsd_sched;
    const eventDate = data.constants.eventDate;

    /** @type {SchedItem[]} */
    const arr = orig_schedule.map(origToNewItem(eventDate));

    // Sort by start time
    arr.sort((itemA, itemB) => itemA.time_start_shift - itemB.time_start_shift);

    // Populate array's children based on belongs_to
    arr.forEach(item => {
      item.children = arr.filter(candidate => candidate.belongs_to == item.type);
    });

    return arr;
}

module.exports = {
  schedule: data => {
    return schedule_array(data);
  },

  sessions: data => {
    const sessions = schedule_array(data).filter(item => item.type.match("_session_"));

    sessions.forEach(
      item => {
        item.room_tracks = item.rooms.map(room => ({
          room,
          children: item.children.filter(child => child.room == room)
        }));
        item.room_tracks.forEach(room_track => {
          const unique_times = [...new Set(room_track.children.map(child => child.time_string))];
          room_track.times = unique_times.map(time => ({time, subschedule: room_track.children.filter(child => child.time_string == time)}))
        });
        item.session_type = item.children[0].type;
      }
    );

    return sessions.reduce((acc, item) => { acc[item.type] = item; return acc; }, {})
  }
};