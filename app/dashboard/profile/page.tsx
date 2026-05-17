'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Edit2, Save, X, ShieldCheck, Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            // Edit Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="bg-neutral-100 px-3 rounded-lg flex items-center text-neutral-500 font-medium">
                    +91
                  </div>
                  <Input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>

              <div className="flex gap-2 border-t border-neutral-200 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-brand-600 hover:bg-brand-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Display View
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-lg font-semibold text-neutral-900">{user?.name}</p>
                  <Badge className="mt-1">{user?.role === 'admin' ? 'Admin' : 'Customer'}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <User className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500">Full Name</p>
                    <p className="font-medium text-neutral-900 truncate">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <Mail className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500">Email Address</p>
                    <p className="font-medium text-neutral-900 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <Phone className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500">Phone Number</p>
                    <p className="font-medium text-neutral-900">+91 {user?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500">City</p>
                    <p className="font-medium text-neutral-900">{user?.city}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-600" />
              Loyalty Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-600">{user?.loyaltyPoints || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">Points earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Member Since
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">2026</p>
            <p className="text-xs text-neutral-500 mt-1">Active member</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Password</p>
              <p className="text-sm text-neutral-500">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
              <p className="text-sm text-neutral-500">Additional security for your account</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your notification and communication preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Email Notifications</p>
              <p className="text-sm text-neutral-500">Receive updates via email</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">SMS Notifications</p>
              <p className="text-sm text-neutral-500">Receive updates via SMS</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Marketing Emails</p>
              <p className="text-sm text-neutral-500">Promotions and special offers</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
