import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import apcLogo from '../assets/image.png';

const roles = [
  {
    id: 'owner',
    title: 'I am a Property Owner',
    description: 'Sign in to manage your listed properties',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    ],
    path: '/owner/login',
  },
  {
    id: 'agent',
    title: 'I am an Agent',
    description: 'Sign in to track sales and manage properties',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
    ],
    path: '/agent/login',
  },
];

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* Left — role cards */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-16 lg:py-0 animate-in fade-in slide-in-from-left-4 duration-500">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 self-start lg:self-center">
          <img src={apcLogo} alt="APC" className="w-9 h-9 rounded-xl object-cover" />
          <span className="text-[#002C3D] font-bold text-lg">APC Portal</span>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#002C3D] mb-1.5">Welcome back</h1>
          <p className="text-gray-500 mb-8 font-medium">Select your account type to continue</p>

          <div className="flex flex-col gap-3 mb-8">
            {roles.map((role, i) => (
              <button
                key={role.id}
                onClick={() => navigate(role.path)}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group flex items-center justify-between w-full p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left animate-in fade-in slide-in-from-bottom-3"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 flex-shrink-0">
                    {role.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-800 leading-snug">{role.title}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{role.description}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#002C3D] flex items-center justify-center flex-shrink-0 ml-3 transition-all duration-200">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </div>
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm text-center">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-[#002C3D] font-bold hover:underline transition-all"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Right — preview panel */}
      <div className="hidden lg:flex w-[480px] xl:w-[520px] bg-[#F5F9FA] border-l border-gray-100 flex-col justify-between p-14 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">

        <div>
          <blockquote className="text-xl font-medium text-[#002C3D] leading-relaxed mb-8 max-w-sm">
            "I've never come across a platform like this before. It has completely transformed how I manage my properties."
          </blockquote>
          <div>
            <p className="font-bold text-[#002C3D] text-sm">John Olamide</p>
            <p className="text-gray-400 text-sm">Property Owner</p>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-gray-200 shadow-2xl transform scale-110 translate-x-10 translate-y-10">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa3b587a02e754b3fa8caa8e9139eb545%2F789e32ee6357472bba44a3ac6b83bff5?format=webp&width=800&height=1200"
            alt="Dashboard Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

    </div>
  );
};

export default LoginSelection;
