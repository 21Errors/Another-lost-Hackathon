import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function EditEventPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    host: '',
    link_or_rsvp: '',
    category: '',
    keywords: '',
    source: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://hackathon-w8qk.onrender.com/api/events/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!data || data.id !== parseInt(id)) throw new Error('Event not found.');
        if (data.event_date) {
          data.event_date = data.event_date.split('T')[0];
        }
        setFormData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://hackathon-w8qk.onrender.com/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
          Authorization: user?.username,
         },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      alert('Event updated!');
      navigate('/events');
    } catch (err) {
      console.error(err);
      alert(`Update failed: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Title:
          <input
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </label>
        <label className="block">
          Description:
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            rows={3}
            required
          />
        </label>
        <label className="block">
          Event Date:
          <input
            name="event_date"
            type="date"
            value={formData.event_date || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </label>
        <label className="block">
          Location:
          <input
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </label>
        <label className="block">
          Host:
          <input
            name="host"
            value={formData.host || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </label>
        <label className="block">
          Link or RSVP:
          <input
            name="link_or_rsvp"
            value={formData.link_or_rsvp || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </label>
        <label className="block">
          Category:
          <input
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </label>
        <label className="block">
          Keywords:
          <input
            name="keywords"
            value={formData.keywords || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </label>
        <label className="block">
          Source:
          <input
            name="source"
            value={formData.source || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
      <Link to="/events" className="text-blue-600 underline mt-4 inline-block">
        ← Back to Events
      </Link>
    </div>
  );
}