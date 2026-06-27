import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { StatusBadge } from '../utils/status.jsx';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil } from 'lucide-react';

const emptyForm = {
  deviceId: '',
  locationId: '',
  name: '',
  type: 'IsokoUnit',
  location: { name: '', district: '', lat: '', lng: '' },
  description: '',
};

export function DevicesPage() {
  const { isAdmin } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      const data = await api.getDevices();
      setDevices(data.devices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      location: {
        ...form.location,
        lat: form.location.lat ? parseFloat(form.location.lat) : undefined,
        lng: form.location.lng ? parseFloat(form.location.lng) : undefined,
      },
    };

    try {
      if (editingId) {
        await api.updateDevice(editingId, payload);
      } else {
        await api.registerDevice(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchDevices();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (device) => {
    setEditingId(device.deviceId);
    setForm({
      deviceId: device.deviceId,
      locationId: device.locationId,
      name: device.name,
      type: device.type,
      location: {
        name: device.location?.name || '',
        district: device.location?.district || '',
        lat: device.location?.lat?.toString() || '',
        lng: device.location?.lng?.toString() || '',
      },
      description: device.description || '',
    });
    setShowForm(true);
  };

  const toggleActive = async (device) => {
    try {
      await api.updateDevice(device.deviceId, { active: !device.active });
      fetchDevices();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800">
        Device management is restricted to administrators.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Devices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage Isoko Units and IsokoChambers</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Device
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4"
        >
          <h3 className="text-lg font-black text-gray-900">
            {editingId ? 'Edit Device' : 'Register New Device'}
          </h3>
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Device ID (e.g. ISU-003)"
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
              disabled={!!editingId}
              required
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm disabled:opacity-50"
            />
            <input
              placeholder="Location ID"
              value={form.locationId}
              onChange={(e) => setForm({ ...form, locationId: e.target.value })}
              required
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
            />
            <input
              placeholder="Device Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold"
            >
              <option value="IsokoUnit">Isoko Unit (Surface)</option>
              <option value="IsokoChamber">IsokoChamber (Underground)</option>
            </select>
            <input
              placeholder="Location Name"
              value={form.location.name}
              onChange={(e) =>
                setForm({ ...form, location: { ...form.location, name: e.target.value } })
              }
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
            />
            <input
              placeholder="District"
              value={form.location.district}
              onChange={(e) =>
                setForm({ ...form, location: { ...form.location, district: e.target.value } })
              }
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
            rows={2}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              {editingId ? 'Save Changes' : 'Register Device'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading devices...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Device', 'Type', 'Location', 'Status', 'Last Ping', 'Active', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {devices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{device.name}</p>
                      <p className="text-xs text-gray-400">{device.deviceId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{device.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {device.location?.name || device.locationId}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={device.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {device.lastPing
                        ? new Date(device.lastPing).toLocaleString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(device)}
                        className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                          device.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {device.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => startEdit(device)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
