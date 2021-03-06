/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Calendar.js
 *
 *
 */

import { useState } from "react";
import cStyle from "./reusableStyles/CalendarDay.module.css";
/* scripts */
const time = [
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];
const overlayTime = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];
function CalendarDay(props) {
  const [dragState, setDragState] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { dayName, timePrefState, timePrefDay, addTimePref, removeTimePref } =
    props;

  console.log("TimePrefDay ", timePrefDay, " ", timePrefState);
  /*  To check if a time slot is highlighted during time pref selection  */
  const onHighlight = (e) => {
    console.log("CalendaryD e: ", e);
    console.log("CalendaryD e.target.style.backgroundColor: ", e.target);

    /*  Add highlight, add time pref to array  */
    if (e.target.style.backgroundColor.localeCompare("") === 0) {
      e.target.style.backgroundColor = "#A1C97D";
      addTimePref(dayName, e.target.id);
    } else {
      /*  Remove highlight, remove time pref from array  */
      console.log("calendarfbk  highlighted");
      e.target.style.backgroundColor = "";
      removeTimePref(dayName, e.target.id);
    }
  };

  /*  returns the background styling for overlay calendar slots  */
  const backgroundColorCheck = (timeName) => {
    let res = { backgroundColor: "" };
    // eslint-disable-next-line no-unused-expressions
    timePrefDay &&
      timePrefDay.forEach((element) => {
        if (element.time_earliest === timeName) {
          res = { backgroundColor: "#A1C97D" };
        }
      });

    return res;
  };

  return (
    <div className={cStyle.dayContainer}>
      <div className={cStyle.timeSlotTitle}>{dayName}</div>
      <div className={cStyle.timeContainer}>
        {timePrefState
          ? /* Time Pref Selection View */
            overlayTime.map((timeName) => (
              <div
                role="button"
                tabIndex={0}
                className={cStyle.timeSlotOverlay}
                key={timeName}
                id={timeName}
                style={backgroundColorCheck(timeName)}
                onMouseDown={() => setDragState((prev) => !prev)}
                onMouseOver={(e) => dragState && onHighlight(e)}
                onMouseUp={() => setDragState((prev) => !prev)}
                onTouchStart={() => setDragState((prev) => !prev)}
                onTouchMove={(e) => dragState && onHighlight(e)}
                onTouchEnd={() => setDragState((prev) => !prev)}
                onClick={onHighlight}
              />
            ))
          : /* Normal Calendar View */
            time.map((timeName) => (
              <div className={cStyle.timeSlot} key={timeName} />
            ))}
      </div>
    </div>
  );
}

export default CalendarDay;
