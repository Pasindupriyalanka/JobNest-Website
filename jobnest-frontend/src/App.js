import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    reminder: ''
  });

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search and status
  useEffect(() => {
    let filtered = jobs;

    // Filter by search term (company name)
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/jobs`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('Backend server is not running. Please start it on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company.trim() || !formData.role.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingJob) {
        // Update existing job
        const response = await fetch(`${API_BASE_URL}/jobs/${editingJob._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        const updatedJob = await response.json();
        setJobs(jobs.map(job => job._id === updatedJob._id ? updatedJob : job));
        setEditingJob(null);
      } else {
        // Create new job
        const response = await fetch(`${API_BASE_URL}/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        const newJob = await response.json();
        setJobs([newJob, ...jobs]);
      }
      
      // Reset form
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        reminder: ''
      });
    } catch (error) {
      console.error('Error saving job:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        alert('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        alert(`Error saving job: ${error.message}`);
      }
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      role: job.role,
      status: job.status,
      reminder: job.reminder || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
      });
      setJobs(jobs.filter(job => job._id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      reminder: ''
    });
  };

  // Calculate stats
  const stats = {
    total: jobs.length,
    interviews: jobs.filter(j => j.status === 'Interview').length,
    offers: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
  };

  // Get reminders (jobs with reminder field)
  const reminders = jobs.filter(job => job.reminder && job.reminder.trim() !== '');

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Applied': 'badge-blue',
      'Interview': 'badge-yellow',
      'Offer': 'badge-green',
      'Rejected': 'badge-red'
    };
    return statusClasses[status] || 'badge-blue';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>JobNest Dashboard</h1>
        <p>Track your job applications in one place</p>
      </header>

      <div className="dashboard-container">
        {/* Stats Overview */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">📊</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-yellow">💼</div>
            <div className="stat-content">
              <h3>{stats.interviews}</h3>
              <p>Interviews</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">🎉</div>
            <div className="stat-content">
              <h3>{stats.offers}</h3>
              <p>Offers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-red">❌</div>
            <div className="stat-content">
              <h3>{stats.rejected}</h3>
              <p>Rejections</p>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="left-panel">
            {/* Add New Job Form */}
            <div className="form-card">
              <h2>{editingJob ? 'Edit Job Application' : 'Add New Job Application'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="company">Company Name *</label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    placeholder="Enter company name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Job Role *</label>
                  <input
                    type="text"
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="Enter job role"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reminder">Reminder (Optional)</label>
                  <input
                    type="text"
                    id="reminder"
                    value={formData.reminder}
                    onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                    placeholder="e.g., Follow up on Monday"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingJob ? 'Update Job' : 'Add Job'}
                  </button>
                  {editingJob && (
                    <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Search & Filter */}
            <div className="search-filter-card">
              <h3>Search & Filter</h3>
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search by company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="table-card">
              <h3>Applications ({filteredJobs.length})</h3>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : filteredJobs.length === 0 ? (
                <div className="no-data">No applications found</div>
              ) : (
                <div className="table-responsive">
                  <table className="applications-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Date Applied</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job._id}>
                          <td>{job.company}</td>
                          <td>{job.role}</td>
                          <td>{formatDate(job.appliedDate)}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-icon btn-edit"
                                onClick={() => handleEdit(job)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn-icon btn-delete"
                                onClick={() => handleDelete(job._id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Reminders Sidebar */}
          <div className="right-panel">
            <div className="reminders-card">
              <h3>📝 Reminders & Notifications</h3>
              {reminders.length === 0 ? (
                <div className="no-reminders">
                  <p>No reminders set</p>
                  <small>Add a reminder when creating a job application</small>
                </div>
              ) : (
                <div className="reminders-list">
                  {reminders.map((job) => (
                    <div key={job._id} className="reminder-item">
                      <div className="reminder-header">
                        <strong>{job.company}</strong>
                        <span className={`badge badge-small ${getStatusBadgeClass(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="reminder-text">{job.reminder}</p>
                      <small className="reminder-role">{job.role}</small>
                      <small className="reminder-date">Applied: {formatDate(job.appliedDate)}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
