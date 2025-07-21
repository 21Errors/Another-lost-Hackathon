import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the path if needed


function EditDocumentPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: '',
    description: '',
    issuing_authority: '',
    keywords: '',
    applicable_to: '',
    external_url: '',
    source: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`https://hackathon-w8qk.onrender.com/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!data || data.id !== parseInt(id)) throw new Error('Document not found.');
        setFormData(data); // Set the single document object directly
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://hackathon-w8qk.onrender.com/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.username, // ✅ Add this!
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      alert('Document updated!');
      navigate('/documents');
    } catch (err) {
      console.error(err);
      alert(`Update failed: ${err.message}`);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
    <h1 className="text-2xl font-bold mb-6">Edit Document</h1>
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
        Category:
        <input
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </label>
  
      <label className="block">
        Type:
        <input
          name="type"
          value={formData.type || ''}
          onChange={handleChange}
          className="w-full border px-2 py-1"
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
        />
      </label>
  
      <label className="block">
        Issuing Authority:
        <input
          name="issuing_authority"
          value={formData.issuing_authority || ''}
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
        Applicable To:
        <input
          name="applicable_to"
          value={formData.applicable_to || ''}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </label>
  
      <label className="block">
        External URL:
        <input
          name="external_url"
          value={formData.external_url || ''}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
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
    <Link to="/documents" className="text-blue-600 underline mt-4 inline-block">
      &larr; Back to Documents
    </Link>
  </div>
  
  );
}

export default EditDocumentPage;