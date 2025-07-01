import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const today = new Date();
const rectSize = 15;
const gutterSize = 4;
const weeks = Math.ceil(180 / 7);
const heatmapWidth = (rectSize + gutterSize) * weeks;

const classForValue = (value) => {
  if (!value) return 'color-empty';
  if (value.count >= 5) return 'color-scale-4';
  if (value.count >= 3) return 'color-scale-3';
  if (value.count >= 2) return 'color-scale-2';
  return 'color-scale-1';
};

const StudyCalendar = () => {
  const [values, setValues] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    const fetchHeatmapData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/progress/calendar/${user._id}`);
        setValues(res.data);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      }
    };

    fetchHeatmapData();
  }, [user]);

  return (
    <div className="w-full px-4 mt-12 mb-20 flex justify-center">
      <div
        className="bg-white p-8 rounded-2xl shadow-lg"
        style={{ width: `${heatmapWidth + 64}px` }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center font-inter">
          Your Study Activity (Past 6 Months)
        </h2>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={subDays(today, 180)}
            endDate={today}
            values={values}
            classForValue={classForValue}
            showWeekdayLabels={false}
            horizontal={true}
            rectSize={rectSize}
            gutterSize={gutterSize}
            tooltipDataAttrs={(value) =>
              value?.date
                ? { 'data-tip': `${value.date} — ${value.count} session(s)` }
                : { 'data-tip': 'No activity' }
            }
          />
        </div>

        {/* Legend */}
        <div className="mt-4 text-sm text-gray-600 flex flex-wrap items-center gap-2 justify-center">
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 border rounded-sm color-empty"></span>
            <span>No activity</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded-sm color-scale-1"></span>
            <span className="inline-block w-4 h-4 rounded-sm color-scale-2"></span>
            <span className="inline-block w-4 h-4 rounded-sm color-scale-3"></span>
            <span className="inline-block w-4 h-4 rounded-sm color-scale-4"></span>
            <span>More sessions</span>
          </div>
        </div>

        <style>
          {`
            .color-empty {
              fill: #fff;
              stroke: #d1d5db;
              stroke-width: 1;
            }
            .color-scale-1 { fill: #d6b2ff; }
            .color-scale-2 { fill: #b980ff; }
            .color-scale-3 { fill: #9d4dff; }
            .color-scale-4 { fill: #7e22ce; }

            .react-calendar-heatmap .react-calendar-heatmap-week > rect {
              width: ${rectSize}px !important;
              height: ${rectSize}px !important;
            }
            .react-calendar-heatmap .react-calendar-heatmap-week {
              margin-right: ${gutterSize}px;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default StudyCalendar;
