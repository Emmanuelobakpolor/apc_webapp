import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Info, CheckCircle2, X, Eye, EyeOff, ShieldCheck, AlertCircle,
} from 'lucide-react';
import apcLogo from '../../assets/image.png';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const steps = [
  { id: 1, label: 'Personal Info.' },
  { id: 2, label: 'Contact Info' },
  { id: 3, label: 'Login/Account Credentials' },
];

const SELECT_ARROW = "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234B5563%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat";

const API = 'http://localhost:8000/api/auth';

const OwnerSignup = () => {
  const navigate = useNavigate();
  const { setUserFromStorage } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    nationality: '',
    government_id_number: '',
    id_document: null,
    phone_number: '',
    email: '',
    address: '',
    preferred_contact: '',
    password: '',
    confirm_password: '',
  });

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const indicatorStep = showOtp ? 2 : currentStep;

  const startTimer = () => {
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    setError('');
    setIsSending(true);
    try {
      const res = await fetch(`${API}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.email?.[0] || data.detail || 'Failed to send OTP.');
      setShowOtp(true);
      startTimer();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 2 && !showOtp) {
      sendOtp();
    } else if (showOtp) {
      setShowOtp(false);
      setCurrentStep(3);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateAccount();
    }
  };

  const handleBack = () => {
    setError('');
    if (showOtp) {
      setShowOtp(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOtpChange = async (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      document.getElementById(`otp-o-${index + 1}`)?.focus();
    }

    if (newOtp.every((d) => d)) {
      const code = newOtp.join('');
      try {
        const res = await fetch(`${API}/verify-otp/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp: code }),
        });
        const data = await res.json();
        if (res.ok && data.verified) {
          setIsVerified(true);
        } else {
          setOtpError(data.detail || 'Invalid or expired OTP. Please try again.');
          setOtp(['', '', '', '', '', '']);
          document.getElementById('otp-o-0')?.focus();
        }
      } catch {
        setOtpError('Network error. Please try again.');
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-o-${index - 1}`)?.focus();
    }
  };

  const handleResendCode = async () => {
    setOtpError('');
    setIsVerified(false);
    setOtp(['', '', '', '', '', '']);
    setIsSending(true);
    try {
      const res = await fetch(`${API}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!res.ok) throw new Error('Failed to resend OTP.');
      startTimer();
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateAccount = async () => {
    setError('');
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== '') body.append(key, val);
      });

      const res = await fetch(`${API}/owner/signup/`, {
        method: 'POST',
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        const firstError = Object.values(data)[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify({ ...data.user, profile_picture_url: data.user?.avatarUrl || null }));
      setUserFromStorage();
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-10 overflow-hidden">
      {steps.map((step, idx) => {
        const done = indicatorStep > step.id;
        const active = indicatorStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn(
                'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-all',
                active ? 'bg-[#002C3D] text-white border-[#002C3D]'
                  : done ? 'bg-[#476D7C] text-white border-[#476D7C]'
                    : 'bg-white text-gray-300 border-gray-200'
              )}>
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={cn(
                'text-[10px] font-bold uppercase tracking-wide leading-tight hidden sm:block whitespace-nowrap',
                active ? 'text-[#002C3D]' : done ? 'text-[#476D7C]' : 'text-gray-300'
              )}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn('w-6 flex-shrink-0 h-px', done ? 'bg-[#476D7C]' : 'bg-gray-200')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const ErrorBanner = ({ msg }) => msg ? (
    <div className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{msg}</span>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center py-12 px-6 font-sans">
      <img src={apcLogo} alt="APC" className="w-12 h-12 rounded-xl object-cover mb-8" />

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-center text-[#002C3D] mb-8 tracking-tight">Landlord Sign-Up</h2>
        <StepIndicator />

        {/* Step 1 — Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-base font-bold text-[#002C3D] mb-0.5">Personal Information</h3>
              <p className="text-xs text-gray-400">Please ensure the details are inputted correctly for proper identification</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label-text">Full Name</label>
                <input type="text" placeholder="Enter your legal name" className="input-field" value={formData.full_name} onChange={set('full_name')} />
              </div>
              <div>
                <label className="label-text">Gender</label>
                <select className={cn('input-field', SELECT_ARROW)} value={formData.gender} onChange={set('gender')}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="label-text">Nationality</label>
                <select className={cn('input-field', SELECT_ARROW)} value={formData.nationality} onChange={set('nationality')}>
                  <option value="">Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                </select>
              </div>
              <div>
                <label className="label-text">Enter Govt. ID Number</label>
                <input type="text" placeholder="Enter ID number" className="input-field" value={formData.government_id_number} onChange={set('government_id_number')} />
              </div>
              <div>
                <label className="label-text">Upload ID Document</label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center gap-3 text-gray-400 hover:border-[#476D7C]/40 hover:bg-[#EEF5F8]/40 transition-all cursor-pointer group h-[50px]">
                  <Upload className="w-4 h-4 group-hover:text-[#002C3D] transition-colors flex-shrink-0" />
                  <span className="text-xs font-medium group-hover:text-[#002C3D] transition-colors">
                    {formData.id_document ? formData.id_document.name : 'Click to upload an image'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFormData((p) => ({ ...p, id_document: e.target.files[0] || null }))} />
                </label>
              </div>
            </div>
            <div className="bg-[#FFF1F2] p-4 rounded-xl flex items-start gap-3 border border-red-100">
              <Info className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800 font-medium leading-snug">We keep your information confidential for a trusted and smooth business experience.</p>
            </div>
            <button onClick={handleNext} className="w-full py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">
              Next: Contact Info
            </button>
          </div>
        )}

        {/* Step 2 — Contact Info */}
        {currentStep === 2 && !showOtp && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-base font-bold text-[#002C3D] mb-0.5">Contact Information</h3>
              <p className="text-xs text-gray-400">Please ensure the details are inputted correctly for proper identification</p>
            </div>
            {isSending ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-10 h-10 border-[3px] border-gray-200 border-t-[#002C3D] rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Sending verification code…</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label-text">Full Name</label>
                    <input type="text" placeholder="Enter your legal name" className="input-field" value={formData.full_name} onChange={set('full_name')} />
                  </div>
                  <div>
                    <label className="label-text">Phone Number</label>
                    <input type="text" placeholder="+234" className="input-field" value={formData.phone_number} onChange={set('phone_number')} />
                  </div>
                  <div>
                    <label className="label-text">Email Address</label>
                    <input type="email" placeholder="Enter email" className="input-field" value={formData.email} onChange={set('email')} />
                  </div>
                  <div>
                    <label className="label-text">Residential / Office Address</label>
                    <input type="text" placeholder="Enter Address" className="input-field" value={formData.address} onChange={set('address')} />
                  </div>
                  <div>
                    <label className="label-text">Preferred Contact Method</label>
                    <select className={cn('input-field', SELECT_ARROW)} value={formData.preferred_contact} onChange={set('preferred_contact')}>
                      <option value="">Select method</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                <div className="bg-[#FFF1F2] p-4 rounded-xl flex items-start gap-3 border border-red-100">
                  <Info className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-800 font-medium leading-snug">We keep your information confidential for a trusted and smooth business experience.</p>
                </div>
                <ErrorBanner msg={error} />
                <div className="flex gap-3">
                  <button onClick={handleBack} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Back</button>
                  <button onClick={handleNext} className="flex-[2] py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">
                    Next: Login Credentials
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* OTP Step */}
        {currentStep === 2 && showOtp && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-base font-bold text-[#002C3D] mb-0.5">Enter the OTP</h3>
              <p className="text-xs text-gray-400">
                To confirm it is you, we sent a 6-digit code to{' '}
                <span className="font-semibold text-gray-600">{formData.email}</span>
              </p>
            </div>
            <div className="flex gap-2.5 justify-start mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-o-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={cn(
                    'w-11 text-center text-lg font-bold border-2 rounded-xl focus:outline-none transition-all',
                    digit ? 'border-[#002C3D] bg-[#EEF5F8] text-[#002C3D]'
                      : 'border-gray-200 bg-white text-gray-800 focus:border-[#476D7C]'
                  )}
                  style={{ height: '52px' }}
                  placeholder=" "
                />
              ))}
            </div>
            {isVerified && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-800 font-semibold">Email verified successfully!</p>
              </div>
            )}
            {otpError && <ErrorBanner msg={otpError} />}
            <p className="text-sm text-gray-400">
              Didn't receive a code?{' '}
              {timeLeft > 0 ? (
                <span className="text-gray-500 font-semibold">Resend in {timeLeft}s</span>
              ) : (
                <button onClick={handleResendCode} className="text-[#002C3D] font-bold hover:underline">Resend Code</button>
              )}
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={handleBack} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Back</button>
              <button
                onClick={handleNext}
                disabled={!isVerified}
                className="flex-[2] py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next: Login Credentials
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Credentials */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-base font-bold text-[#002C3D] mb-0.5">You'll Need a Password</h3>
              <p className="text-xs text-gray-400">Create an 8-character long password to secure your account and keep it safe or more</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input-field pr-11" value={formData.password} onChange={set('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label-text">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="input-field pr-11" value={formData.confirm_password} onChange={set('confirm_password')} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <ErrorBanner msg={error} />
            <div className="flex gap-3 pt-2">
              <button onClick={handleBack} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Back</button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-[2] py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating…</>
                ) : 'Create Account'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsSuccessModalOpen(false)} className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <div className="w-11 h-11 rounded-full bg-[#476D7C] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#002C3D] mb-2">Account Created Successfully</h3>
            <p className="text-sm text-gray-400 mb-7 leading-relaxed">You can proceed to your dashboard to add and manage your property</p>
            <button onClick={() => navigate('/owner/dashboard')} className="w-full py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">
              Add more Properties
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerSignup;
