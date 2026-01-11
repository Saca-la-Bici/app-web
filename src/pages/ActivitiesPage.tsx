import React, { useEffect, useState } from 'react';
import { getEvents, getRides, getWorkshops } from '../services/api';
import ActivityCard from '../components/ActivityCard';
import type { Activity } from '../types';
import { Tabs, Tab, Box } from '@mui/material';

const ActivitiesPage: React.FC = () => {
  const [events, setEvents] = useState<Activity[]>([]);
  const [rides, setRides] = useState<Activity[]>([]);
  const [workshops, setWorkshops] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [eventsResponse, ridesResponse, workshopsResponse] = await Promise.all([
          getEvents(),
          getRides(),
          getWorkshops(),
        ]);
        console.log('Events:', eventsResponse.data);
        console.log('Rides:', ridesResponse.data);
        console.log('Workshops:', workshopsResponse.data);
        setEvents(eventsResponse.data.eventos);
        setRides(ridesResponse.data.rodadas);
        setWorkshops(workshopsResponse.data.talleres);
      } catch (err) {
        setError('Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="activity tabs">
          <Tab label="Events" />
          <Tab label="Rides" />
          <Tab label="Workshops" />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {events.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {rides.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {workshops.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </TabPanel>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default ActivitiesPage;
