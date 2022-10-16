import './App.css';
import React, { useState, useEffect } from 'react';
//import { hasConflict, courseConflict, getCourseTerm, terms} from './utilities/times.js';
import CourseList from './components/CourseList';
import { useDbData } from './utilities/firebase.js';


const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const mapValues = (fn, obj) => (
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});

const Banner = ({ title }) => (
  <h1>{ title }</h1>
);





const App = () => {
  const [schedule, error] = useDbData('/');
 
  
  
  if (error) return <h1>Error loading user data: {`${error}`}</h1>;
  if (!schedule) return <h1>Loading the schedule...</h1>

  return (
    <div className="container">
      <Banner title={ schedule.title } />
      <CourseList courses={ schedule.courses } />
    </div>
  );
};



export default App;
