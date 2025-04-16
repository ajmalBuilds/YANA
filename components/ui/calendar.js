import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const CalendarComponent = ({ selectedDate, onChange }) => (
  <Calendar value={selectedDate} onChange={onChange} />
);
