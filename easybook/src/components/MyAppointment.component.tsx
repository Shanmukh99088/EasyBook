import React, { useEffect, useState } from 'react';

interface BookedTimeSlot {
  _id: string;
  year: number;
  month: number;
  day: number;
  startTime: string;
  endTime: string;
}

interface MyAppointmentsProps {
  bookedAppointments: BookedTimeSlot[];
  setBookedAppointments: React.Dispatch<React.SetStateAction<BookedTimeSlot[]>>;
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({ bookedAppointments, setBookedAppointments }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyBookedTimeSlots();
  }, []);

  const fetchMyBookedTimeSlots = async () => {
    try {
      const response = await fetch('/my-booked-time-slots', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setBookedAppointments(data.bookedTimeSlots);
      } else {
        console.error(data.message);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/cancel-booking/${bookingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        // Remove the canceled booking from the state
        setBookedAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== bookingId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Appointments</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {bookedAppointments.map(appointment => (
            <li key={appointment._id} className="list-group-item d-flex justify-content-between align-items-center">
              {`${appointment.startTime} - ${appointment.endTime}, ${appointment.year}-${appointment.month}-${appointment.day}`}
              <button
                className="btn btn-danger"
                onClick={() => handleCancelBooking(appointment._id)}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;