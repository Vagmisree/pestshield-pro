'use client';

import { useState } from 'react';
import { mockBookings } from '@/lib/data/bookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload } from 'lucide-react';

const issueTypes = [
  'Re-service needed',
  'Pest returned',
  'Technician issue',
  'Other',
];

export default function ComplaintsPage() {
  const [selectedBooking, setSelectedBooking] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    setComplaintId(id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedBooking('');
    setIssueType('');
    setDescription('');
    setPhoto(null);
    setSubmitted(false);
    setComplaintId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Raise a Complaint</h1>
        <p className="text-neutral-500 mt-1">Let us know if something went wrong with your service</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-600" />
            Complaint Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Complaint #{complaintId} raised.
              </h3>
              <p className="text-neutral-600 mb-6">
                Our team will contact you within 24 hours.
              </p>
              <Button onClick={handleReset} className="bg-brand-600 hover:bg-brand-700 rounded-full">
                Raise Another Complaint
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Booking Selector */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Booking
                </label>
                <select
                  required
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm"
                >
                  <option value="">Choose a past booking...</option>
                  {mockBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.bookingNumber} — {booking.service} ({booking.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Issue Type
                </label>
                <select
                  required
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm"
                >
                  <option value="">Select issue type...</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors text-sm resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Upload Photo (optional)
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-neutral-300 cursor-pointer hover:border-brand-600 transition-colors">
                  <Upload className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm text-neutral-500">
                    {photo ? photo.name : 'Click to upload a photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-full py-3"
              >
                Submit Complaint
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
