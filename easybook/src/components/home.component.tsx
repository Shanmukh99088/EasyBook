import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css';
import './home.component.css'; // Import your custom CSS file for styling
import MyAppointments from './MyAppointment.component';

interface Appointment {
  date: string;
  timeSlot: TimeSlot;
}

interface HomeProps {
  bookedAppointments?: Appointment[];
  setBookedAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

interface TimeSlot {
  _id: string;
  year: number;
  month: number;
  day: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  userId: string;
}

const Home: React.FC<HomeProps> = ({ bookedAppointments = [], setBookedAppointments = () => {} }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // January is 0
    const day = date.getDate();

    // Fetch available time slots from the backend
    try {
      const response = await fetch(`/available-time-slots/${year}/${month}/${day}`);
      const data = await response.json();
      if (response.ok) {
        const timeSlots = data.timeSlots;
        setAvailableTimeSlots(timeSlots);
        setSelectedTimeSlot(null);
      } else {
        setAvailableTimeSlots([]);
        setSelectedTimeSlot(null);
        alert('Please login first');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    console.log(timeSlot)
    setSelectedTimeSlot(timeSlot);
    console.log(selectedTimeSlot)
  };

  const handleBookAppointment = async () => {
    console.log(selectedTimeSlot)
    console.log(selectedDate)
    if (selectedDate && selectedTimeSlot) {
      const selectedTimeSlotObj = availableTimeSlots.find(slot => slot.startTime === selectedTimeSlot);
      console.log(selectedTimeSlot)
      if (!selectedTimeSlotObj) {
        return;
      }
  
      const timeSlotId = selectedTimeSlotObj._id;
  
      try {
        const response = await fetch(`/book-time-slot/${timeSlotId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          // Booking successful
          alert(data.message);
          // Redirect to My Appointments page
          window.location.href = '/my-appointments';
        } else {
          // Booking failed
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
        alert('Error booking time slot');
      }
    } else {
      alert('Please select a date and time slot.');
    }
  };
  const exampleAvailableTimeSlots: TimeSlot[] = [
    {
      _id: '1',
      year: 2023,
      month: 8,
      day: 30,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      isBooked: false,
      userId: '',
    },
    {
      _id: '2',
      year: 2023,
      month: 8,
      day: 30,
      startTime: '11:00 AM',
      endTime: '11:30 AM',
      isBooked: false,
      userId: '',
    },
    {
      _id: '3',
      year: 2023,
      month: 8,
      day: 31,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      isBooked: false,
      userId: '',
    },
    {
      _id: '4',
      year: 2023,
      month: 8,
      day: 31,
      startTime: '11:00 AM',
      endTime: '11:30 AM',
      isBooked: false,
      userId: '',
    },
    
    
    // Add more example time slots here
  ];
   

  return (
    <div className="container mt-5 ">
    <h2 className="text-center mb-4 ">Appointment Scheduler</h2>
    <div className="row">
      <div className="col-md-6">
        <div className="calendar-container">
          <Calendar onClickDay={handleDateClick} />
        </div>
      </div>
      <div className="col-md-6">
        {selectedDate && (
          <div>
            <h3>Available Time Slots for {selectedDate.toDateString()}:</h3>
            <div className="btn-group-vertical">
              {availableTimeSlots?.map((timeSlot, index) => (
                <button
                  key={index}
                  className={`btn ${selectedTimeSlot === timeSlot.startTime ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => handleTimeSlotClick(timeSlot.startTime)}
                >
                  {`${timeSlot.startTime} - ${timeSlot.endTime}`}
                </button>
              ))}
            </div>
            {selectedTimeSlot && (
              <button className="btn btn-success mt-3" onClick={handleBookAppointment}>
                Book Appointment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Home;
