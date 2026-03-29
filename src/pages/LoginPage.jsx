import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';

const MODES = ['phone', 'email'];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('phone');
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep('otp');
  };

  const handleOtpChange = (val, i) => {
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login({ id: '1', name: 'FOOD 101 User', email: `${phone}@food101.ng`, phone, address: '', createdAt: new Date() });
    navigate('/');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login({ id: '1', name: 'John Doe', email: formData.email, phone: '+234 803 123 4567', address: '', createdAt: new Date() });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-food-orange to-food-red rounded-2xl mb-4 shadow-lg shadow-food-orange/30">
            <span className="text-white font-bold text-2xl">F</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue ordering</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-black/5 p-6">
          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-5">
            {MODES.map((m) => (
              <button key={m} onClick={() => { setMode(m); setStep('input'); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${mode === m ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
                {m === 'phone' ? '📱 Phone OTP' : '✉️ Email'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'phone' ? (
              <motion.div key="phone" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {step === 'input' ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone number</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          <span className="text-sm">🇳🇬</span>
                          <span className="text-sm text-gray-400">+234</span>
                        </div>
                        <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="pl-16 h-12 rounded-xl" placeholder="803 123 4567" maxLength={10} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">We'll send a 6-digit OTP via SMS</p>
                    </div>
                    <Button type="submit" disabled={isLoading || phone.length < 10}
                      className="w-full h-12 bg-gradient-to-r from-food-orange to-food-red rounded-xl text-white font-semibold flex items-center justify-center gap-2">
                      {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter the 6-digit code sent to <span className="font-semibold text-gray-900 dark:text-white">+234 {phone}</span></p>
                      <div className="flex gap-2 justify-between">
                        {otp.map((digit, i) => (
                          <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, i)}
                            onKeyDown={(e) => e.key === 'Backspace' && !digit && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
                            className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-food-orange focus:outline-none transition-colors" />
                        ))}
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading || otp.some((d) => !d)}
                      className="w-full h-12 bg-gradient-to-r from-food-orange to-food-red rounded-xl text-white font-semibold">
                      {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Verify & Sign In'}
                    </Button>
                    <button type="button" onClick={() => setStep('input')} className="w-full text-sm text-gray-500 hover:text-food-orange transition-colors">
                      ← Change number
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-9 h-12 rounded-xl" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-9 pr-10 h-12 rounded-xl" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-food-orange to-food-red rounded-xl text-white font-semibold">
                    {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Sign In'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guest checkout note */}
          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/menu" className="text-food-orange hover:underline">Continue as guest</Link> · No account needed
          </p>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">
          No account? <Link to="/signup" className="text-food-orange font-semibold hover:underline">Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}
