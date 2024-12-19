import { useState, useEffect } from 'react';
import { ListGroup, Badge, Spinner } from 'react-bootstrap';

function MechanicsList({ updateMechanics }) {
  const [mechanics, setMechanics] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track the first load

  useEffect(() => {
    const fetchMechanics = async () => {
      if (isInitialLoad) setIsInitialLoad(true); // Set to true only for the first load
      try {
        const response = await fetch('https://cse391a03backend.vercel.app/api/mechanics');
        const data = await response.json();
        setMechanics(data);
        updateMechanics(data);
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      } finally {
        if (isInitialLoad) setIsInitialLoad(false); // Turn off initial loading after the first fetch
      }
    };

    fetchMechanics();
    const intervalId = setInterval(fetchMechanics, 1000);

    return () => clearInterval(intervalId);
  }, [isInitialLoad, updateMechanics]);

  if (isInitialLoad) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading mechanics...</p>
      </div>
    );
  }

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
