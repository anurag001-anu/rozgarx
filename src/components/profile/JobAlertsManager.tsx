'use client';

import { useState } from 'react';
import { Bell, BellOff, Edit2, Trash2, Plus, X } from 'lucide-react';
import { createJobAlert, toggleJobAlert, deleteJobAlert, updateJobAlert } from '@/app/actions/jobAlerts';
import { useRouter } from 'next/navigation';

export default function JobAlertsManager({ alerts = [] }: { alerts: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('government');
  const [govtCategory, setGovtCategory] = useState('');
  const [privateCategory, setPrivateCategory] = useState('');
  const [stateName, setStateName] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [keywords, setKeywords] = useState('');

  const openModal = (alert?: any) => {
    setError('');
    if (alert) {
      setEditingAlert(alert);
      setName(alert.name || '');
      setType(alert.type || 'government');
      setGovtCategory(alert.govtCategory || '');
      setPrivateCategory(alert.privateCategory || '');
      setStateName(alert.state || '');
      setLocation(alert.location || '');
      setWorkMode(alert.workMode || '');
      setQualification(alert.qualification || '');
      setExperience(alert.experience || '');
      setKeywords(alert.keywords || '');
    } else {
      setEditingAlert(null);
      setName('');
      setType('government');
      setGovtCategory('');
      setPrivateCategory('');
      setStateName('');
      setLocation('');
      setWorkMode('');
      setQualification('');
      setExperience('');
      setKeywords('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData: any = {
      name,
      type,
      location: location || null,
      qualification: qualification || null,
      keywords: keywords || null,
    };

    if (type === 'government') {
      if (govtCategory) formData.govtCategory = govtCategory;
      if (stateName) formData.state = stateName;
    } else {
      if (privateCategory) formData.privateCategory = privateCategory;
      if (workMode) formData.workMode = workMode;
      if (experience) formData.experience = experience;
    }

    try {
      let res;
      if (editingAlert) {
        res = await updateJobAlert(editingAlert.id, formData);
      } else {
        res = await createJobAlert(formData);
      }

      if (res.success) {
        setIsModalOpen(false);
      } else {
        setError(res.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await toggleJobAlert(id, !isActive);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      await deleteJobAlert(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">Manage your custom job alerts to stay updated on new opportunities.</p>
        <button onClick={() => openModal()} className="bg-black hover:bg-gray-800 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={18} /> Create Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No active alerts</h3>
          <p className="text-gray-500 mb-6">Create an alert to get notified when new jobs match your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-white p-5 rounded-2xl border ${alert.isActive ? 'border-gray-200 hover:border-brand/30' : 'border-gray-200 opacity-60'} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{alert.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${alert.type === 'government' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {alert.type}
                  </span>
                  {!alert.isActive && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">Paused</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
                  {alert.type === 'government' && alert.govtCategory && <span>Category: {alert.govtCategory}</span>}
                  {alert.type === 'government' && alert.state && <span>State: {alert.state}</span>}
                  
                  {alert.type === 'private' && alert.privateCategory && <span>Category: {alert.privateCategory}</span>}
                  {alert.type === 'private' && alert.workMode && <span>Mode: {alert.workMode}</span>}
                  {alert.type === 'private' && alert.experience && <span>Exp: {alert.experience}</span>}
                  
                  {alert.location && <span>Loc: {alert.location}</span>}
                  {alert.qualification && <span>Qual: {alert.qualification}</span>}
                  {alert.keywords && <span>Keywords: "{alert.keywords}"</span>}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button 
                  onClick={() => handleToggle(alert.id, alert.isActive)} 
                  title={alert.isActive ? "Pause Alert" : "Resume Alert"}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {alert.isActive ? <BellOff size={20} /> : <Bell size={20} />}
                </button>
                <button 
                  onClick={() => openModal(alert)}
                  title="Edit Alert"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(alert.id)}
                  title="Delete Alert"
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Alert Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SSC CGL Updates" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Alert Type <span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition-colors ${type === 'government' ? 'border-brand bg-brand/5 text-brand font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="radio" name="type" value="government" checked={type === 'government'} onChange={() => setType('government')} className="sr-only" />
                      <div className="text-center">Government Jobs</div>
                    </label>
                    <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition-colors ${type === 'private' ? 'border-brand bg-brand/5 text-brand font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="radio" name="type" value="private" checked={type === 'private'} onChange={() => setType('private')} className="sr-only" />
                      <div className="text-center">Private Jobs</div>
                    </label>
                  </div>
                </div>

                {type === 'government' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                      <select value={govtCategory} onChange={e => setGovtCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none bg-white">
                        <option value="">Any Category</option>
                        <option value="SSC">SSC</option>
                        <option value="UPSC">UPSC</option>
                        <option value="Railway">Railway</option>
                        <option value="Banking">Banking</option>
                        <option value="Defence">Defence</option>
                        <option value="Police">Police</option>
                        <option value="Teaching">Teaching</option>
                        <option value="State Government">State Government</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">State</label>
                      <input type="text" value={stateName} onChange={e => setStateName(e.target.value)} placeholder="e.g. Bihar" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none" />
                    </div>
                  </div>
                )}

                {type === 'private' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                        <select value={privateCategory} onChange={e => setPrivateCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none bg-white">
                          <option value="">Any Category</option>
                          <option value="IT & Software">IT & Software</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Finance">Finance</option>
                          <option value="Sales">Sales</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="BPO">BPO</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Work Mode</label>
                        <select value={workMode} onChange={e => setWorkMode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none bg-white">
                          <option value="">Any Mode</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Experience</label>
                      <input type="text" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. Fresher, 2 years" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none" />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Location / City</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Delhi, Remote" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Qualification</label>
                    <input type="text" value={qualification} onChange={e => setQualification(e.target.value)} placeholder="e.g. Graduation, B.Tech" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Keywords</label>
                  <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. Java, Data Entry (searches title & description)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand outline-none" />
                </div>
                
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button disabled={isLoading} type="submit" className="px-8 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl transition-colors disabled:opacity-70">
                  {isLoading ? 'Saving...' : 'Save Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
