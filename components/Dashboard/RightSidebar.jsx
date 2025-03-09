'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { updateUserProfile } from '../../lib/actions/users.action';

const RightSidebar = ({ user, transactions, banks }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localUser, setLocalUser] = useState(user);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_images'); // Make sure this matches your Cloudinary preset name

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryRes.json();
      console.log("Cloudinary Response:", cloudinaryData); // Debugging

      // Update Appwrite with the new image URL
      const updateResult = await updateUserProfile(user.$id, cloudinaryData.secure_url);

      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }

      setUser(prev => ({
        ...prev,
        profile_img: cloudinaryData.secure_url
      }));

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!data.success || !data.user) throw new Error('Failed to fetch user data');

        setLocalUser(data.user);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <aside className="right-sidebar bg-white shadow-xl p-6 h-fit">
      <section className="flex flex-col items-center md:items-start mb-8 space-y-4">
        <div className="relative group w-full max-w-[150px] mx-auto">
          <div
            className={`relative aspect-square w-full border-4 border-white shadow-2xl overflow-hidden rounded-full z-10 transition-all ${localUser.profile_img ? "bg-gradient-to-r from-emerald-500 to-cyan-500 p-1" : ""
              }`}
          >
            {localUser.profile_img ? (
              <Image
                src={localUser.profile_img}
                alt="Profile"
                width={150}
                height={150}
                className="w-full h-full object-cover rounded-full transition duration-300"
                priority
              />
            ) : (
              <div className="relative group w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl md:text-4xl">👤</span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profileUpload"
                  ref={fileInputRef}
                />

                <label
                  htmlFor="profileUpload"
                  className="absolute inset-0 bg-black/60 text-white text-xs md:text-sm rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-300 opacity-50 group-hover:opacity-100 bg-gradient-green"
                >
                  Upload
                </label>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profileUpload"
              ref={fileInputRef}
              disabled={loading || !!localUser.profile_img}
            />
          </div>
        </div>

        <div className="text-center md:text-left w-full space-y-1 mt-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent truncate">
            {localUser.firstName} <span> </span> {localUser.lastName}
          </h1>
          <p className="text-sm font-medium text-gray-600 truncate mb-2 inline-flex items-center gap-1">
            {localUser.email}
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-1 animate-pulse font-medium">{error}</p>
          )}
        </div>
      </section>

      {/* Banks Section */}
      <section className="banks border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">My Banks</h2>
          <Link
            href="/"
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Image
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
              className="filter-green"
            />
            <span className="text-sm font-medium text-emerald-600">
              Add Bank
            </span>
          </Link>
        </div>

        {/* Bank Cards */}
        {banks?.length > 0 && (
          <div className="relative flex flex-col gap-4">
            {banks.map((bank, index) => (
              <div
                key={bank.$id}
                className={`relative ${index > 0 ? '-mt-4' : ''}`}
                style={{ zIndex: banks.length - index }}
              >
                {/* <BankCard 
                  account={bank}
                  userName={localUser.name}
                  showBalance={false}
                /> */}
              </div>
            ))}
          </div>
        )}

        {/* Categories Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Spending Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* {categories.map((category) => (
              <Category key={category.name} category={category} />
            ))} */}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;