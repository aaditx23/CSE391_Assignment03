import { useState, useEffect } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

function MechanicsList() {
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mechanics');
        const data = await response.json();
        setMechanics(data);
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      }
    };

    fetchMechanics();
    const intervalId = setInterval(fetchMechanics, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2 className="mb-4">Mechanics List</h2>
      {mechanics.length > 0 ? (
        <ListGroup>
          {mechanics.map((mechanic) => {
            const freeSlots = 4 - mechanic.appointmentIds.length; 
            return (
              <ListGroup.Item
                key={mechanic.mechanicId}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{mechanic.name}</span>
                <Badge
                  pill
                  bg={freeSlots > 0 ? 'primary' : 'danger'}
                >
                  Free Slots: {freeSlots}
                </Badge>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p className="text-muted">No mechanics available at the moment.</p>
      )}
    </div>
  );
}

export default MechanicsList;
