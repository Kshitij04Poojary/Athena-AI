import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios'; // If using axios to make the request

const TeamsStyleCalendar = () => {
  // Define calendar settings
  const startHour = 8;
  const endHour = 16;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Colors mapped to mentors for consistency
  const mentorColors = {
    "mentor1": "#6264A7", // Teams purple
    "mentor2": "#4CC9F0",
    "mentor3": "#4895EF",
    "mentor4": "#560BAD"
  };

  // Format time like "08:00"
  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Fetch events data from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await axios.get('http://127.0.0.1:5004/genetic-algorithm', {withCredentials: true}); // Make a request to your backend API
        const eventsData = response.data; // Assuming your backend sends data in the same format as shown
        console.log(eventsData)
        // Process events data
        const processedEvents = Object.entries(eventsData).map(([title, data], index) => {
          const startHourBlock = Math.floor((data.start[0] - startHour) / 2) * 2 + startHour;
          const endHourBlock = Math.ceil((data.end[0] + (data.end[1] > 0 ? 1 : 0) - startHour) / 2) * 2 + startHour;

          const startTime = formatTime(data.start[0], data.start[1]);
          const endTime = formatTime(data.end[0], data.end[1]);

          return {
            id: index,
            title,
            startTime,
            endTime,
            mentor: data.mentor,
            mentees: data.mentees,
            startHour: data.start[0],
            endHour: data.end[0] + (data.end[1] > 0 ? 1 : 0),
            startHourBlock,
            endHourBlock,
            color: mentorColors[data.mentor] || "#6264A7"
          };
        });

        setEvents(processedEvents); // Set the events data
      } catch (err) {
        setError("Failed to load events data");
        console.error(err);
      } finally {
        setLoading(false); // Set loading state to false after the request
      }
    };

    fetchEvents();
  }, []);

  // Generate 2-hour time slots
  const timeSlots = [];
  for (let hour = startHour; hour < endHour; hour += 2) {
    timeSlots.push(hour);
  }

  // Handle day navigation
  const navigateDay = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Handle slot click
  const handleSlotClick = (startHour) => {
    const blockEvents = events.filter(event => 
      (event.startHour < (startHour + 2) && event.endHour > startHour)
    );

    setSelectedTimeBlock(startHour);
    setSelectedEvents(blockEvents);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Calendar for ${currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })}`, 20, 20);

    doc.setFontSize(10);

    let yPosition = 40;
    const pageHeight = doc.internal.pageSize.height;

    events.forEach((event, index) => {
      if (yPosition + 50 > pageHeight) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(`${event.title}`, 20, yPosition);
      doc.text(`Time: ${event.startTime} - ${event.endTime}`, 20, yPosition + 10);
      doc.text(`Mentor: ${event.mentor}`, 20, yPosition + 20);
      doc.text(`Mentees: ${event.mentees.join(', ')}`, 20, yPosition + 30);

      doc.line(20, yPosition + 35, 190, yPosition + 35);

      yPosition += 50;
    });

    const totalPages = doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageNumberText = `Page ${i}`;
      doc.text(pageNumberText, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }

    doc.save(`calendar-${currentDate.toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-100">
        <div className="flex items-center">
          <button 
            onClick={() => navigateDay(-1)}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            ←
          </button>
          
          <div className="text-center mx-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>
          
          <button 
            onClick={() => navigateDay(1)}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            →
          </button>
        </div>

        <button 
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">↓</span> Download PDF
        </button>
      </div>

      {/* Loading or Error Messages */}
      {loading && <div className="text-center py-4">Loading events...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {/* Calendar Body */}
      <div className="flex flex-col p-4">
        <div className="grid grid-cols-[100px_1fr] w-full">
          {timeSlots.map(startHour => {
            const blockEvents = events.filter(event => 
              (event.startHour < (startHour + 2) && event.endHour > startHour)
            );
            
            return (
              <React.Fragment key={startHour}>
                {/* Time Label */}
                <div className="py-6 px-2 text-right text-sm text-gray-500 border-r border-b">
                  {formatTime(startHour, 0)} - {formatTime(startHour + 2, 0)}
                </div>

                {/* Block Cell */}
                <div 
                  className="min-h-32 p-2 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSlotClick(startHour)}
                >
                  {blockEvents.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {blockEvents.map(event => (
                        <div 
                          key={event.id}
                          className="rounded px-3 py-2 text-white text-sm w-64"
                          style={{ backgroundColor: event.color }}
                        >
                          <div className="font-medium text-base">{event.title}</div>
                          <div className="text-sm mt-1">{event.startTime} - {event.endTime}</div>
                          <div className="text-xs mt-1 opacity-90">
                            Mentor: {event.mentor}
                          </div>
                          <div className="text-xs opacity-90">
                            {event.mentees.length} mentee{event.mentees.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                      No events scheduled
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {formatTime(selectedTimeBlock, 0)} - {formatTime(selectedTimeBlock + 2, 0)}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map(event => (
                  <div key={event.id} className="border-l-4 p-3 bg-gray-50 rounded" style={{ borderColor: event.color }}>
                    <div className="flex justify-between">
                      <div className="font-bold text-gray-800">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.startTime} - {event.endTime}</div>
                    </div>
                    <div className="mt-2">
                      <div><span className="font-medium text-gray-700">Mentor:</span> {event.mentor}</div>
                      <div className="mt-1">
                        <span className="font-medium text-gray-700">Mentees:</span>
                        <ul className="list-disc ml-5 mt-1">
                          {event.mentees.map(mentee => (
                            <li key={mentee} className="text-sm">{mentee}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No lectures scheduled for this time slot
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsStyleCalendar;
