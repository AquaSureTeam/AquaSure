import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { StatusBadge } from '../utils/status.jsx';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      const data: any = await api.getDevices();
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (device: any) => {
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

  const toggleActive = async (device: any) => {
    try {
      await api.updateDevice(device.deviceId, { active: !device.active });
      fetchDevices();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="card p-8 text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Cpu size={24} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Access restricted</h3>
        <p className="text-sm text-gray-500">
          Device management is available to administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Devices</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage monitoring units</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus size={16} />
          Add device
        </button>
      </div>

      {/* Add / Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="card p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Edit device' : 'Register new device'}
            </h3>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Device ID (e.g. ISU-003)"
                value={form.deviceId}
                onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
                disabled={!!editingId}
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 disabled:opacity-50"
              />
              <input
                placeholder="Location ID"
                value={form.locationId}
                onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
              />
              <input
                placeholder="Device name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                <option value="IsokoUnit">Isoko Unit (Surface)</option>
                <option value="IsokoChamber">IsokoChamber (Underground)</option>
              </select>
              <input
                placeholder="Location name"
                value={form.location.name}
                onChange={(e) =>
                  setForm({ ...form, location: { ...form.location, name: e.target.value } })
                }
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
              />
              <input
                placeholder="District"
                value={form.location.district}
                onChange={(e) =>
                  setForm({ ...form, location: { ...form.location, district: e.target.value } })
                }
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none"
              rows={2}
            />

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Save changes' : 'Register device'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Device table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No devices registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Device', 'Type', 'Location', 'Status', 'Last ping', 'Active', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-xs font-medium text-gray-500"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {devices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">{device.name}</p>
                      <p className="text-xs text-gray-400">{device.deviceId}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{device.type}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {device.location?.name || device.locationId}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={device.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {device.lastPing
                        ? new Date(device.lastPing).toLocaleString()
                        : 'Never'}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(device)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${device.active
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        {device.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => startEdit(device)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                        aria-label="Edit device"
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
