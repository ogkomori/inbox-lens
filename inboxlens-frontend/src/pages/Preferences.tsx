import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import DashboardNavigation from '../components/DashboardNavigation';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';

// Move static arrays outside the component for performance
const question1Options = [
  'Student - I’m in school or university and mostly care about academic, internship, or scholarship emails.',
  'Job Seeker - I’m actively looking for work and want to prioritize recruiter or company emails.',
  'Professional / Employee - I’m currently working and want to stay on top of work-related emails and industry updates.',
  'Entrepreneur / Freelancer - I manage my own business or freelance work and want to focus on client, contract, and invoice emails.',
  'Recruiter / HR Professional - I manage candidates or hiring and want alerts about applications, resumes, or interviews.',
  'General / Casual User - I just want to get summaries of my emails and notifications.'
];

const question2Options = [
  'Tech',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Media',
  'Government',
  'Other'
];

const question3Options = [
  'Job offers',
  'Academic updates',
  'Work projects',
  'Client communications',
  'Newsletters',
  'Deals',
  'Other'
];

const preferredTimes = Array.from({ length: 12 }, (_, i) => `${i === 0 ? 12 : i} AM`);

export const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    q1: [] as string[],
    q2: [] as string[],
    q3: [] as string[],
    preferredTime: '12 AM',
  });
  const [contactOpen, setContactOpen] = useState(false);
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const handleCheckbox = (key: 'q1' | 'q2' | 'q3', value: string, checked: boolean) => {
    if (key === 'q1') {
      const isGeneral = value.includes('General / Casual User');
      if (isGeneral) {
        if (checked) {
          // Only General should be selected
          setAnswers(prev => ({ ...prev, q1: [value] }));
        } else {
          // Uncheck General
          setAnswers(prev => ({ ...prev, q1: [] }));
        }
        return;
      } else {
        if (checked) {
          // If any other is checked, remove General if present
          setAnswers(prev => ({
            ...prev,
            q1: [...prev.q1.filter(opt => !opt.includes('General / Casual User')), value]
          }));
        } else {
          setAnswers(prev => ({
            ...prev,
            q1: prev.q1.filter(opt => opt !== value)
          }));
        }
        return;
      }
    }
    setAnswers(prev => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((v: string) => v !== value)
    }));
  };

  const handleTimeChange = (value: string) => {
    setAnswers(prev => ({ ...prev, preferredTime: value }));
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleNext = () => {
    setStep(s => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 0));
  };

  // Convert "12 AM" to "00:00", "1 AM" to "01:00", ... "11 AM" to "11:00"
  function to24Hour(time: string) {
    const [h, period] = time.split(' ');
    let hour = parseInt(h, 10);
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  const handleSave = async () => {
    setError(null);
    if (!answers.preferredTime) {
      setError('Please select a preferred time.');
      saveButtonRef.current?.focus();
      return;
    }
    setLoading(true);
    const payload = {
      preferredTime: to24Hour(answers.preferredTime),
      userCategory: answers.q1,
      industries: answers.q2 || [],
      emailTypes: answers.q3 || [],
    };
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/profile/set-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save preferences');
      toast({
        title: 'Preferences saved!',
        description: 'Your preferences have been updated.',
        className: 'bg-green-500 text-white',
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (e) {
      setError('Failed to save preferences. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
  <DashboardNavigation user={{ name: '', email: '' }} />
  <div className="min-h-screen flex items-center justify-center p-2 mt-[-12px]">
        <Card className="w-full max-w-4xl p-4 md:p-6 relative">
          <Button variant="outline" className="absolute top-4 right-4" onClick={handleSkip}>
            Select Preferences Later
          </Button>
          <h2 className="text-2xl font-bold mb-6 text-center">Tell us about your preferences</h2>
          {/* Step progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              {[0,1,2,3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary' : 'bg-muted'}`}
                  aria-label={`Step ${s+1}`}
                />
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground font-semibold">
              {`Question ${step + 1} out of 4`}
            </div>
          </div>
          {step === 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">1. Which of the following best describes you right now?</h3>
                <p className="text-xs text-muted-foreground mb-2">You can select multiple options.</p>
                <div className="flex flex-col gap-2">
                  {question1Options.map(option => {
                    const isGeneral = option.includes('General / Casual User');
                    const generalSelected = answers.q1.includes('General / Casual User – I just want to get summaries of my emails and notifications.');
                    const otherSelected = answers.q1.some(
                      o => o !== 'General / Casual User – I just want to get summaries of my emails and notifications.'
                    );
                    // Only disable other options if General is selected, but never disable General itself
                    const disabled = !isGeneral && generalSelected;
                    // Bold the main name before the dash
                    const dashIdx = option.indexOf(' - ');
                    let main, rest;
                    if (dashIdx !== -1) {
                      main = option.slice(0, dashIdx);
                      rest = option.slice(dashIdx + 3);
                    } else {
                      main = option;
                      rest = '';
                    }
                    return (
                      <label key={option} className={`flex items-center gap-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Checkbox
                          checked={answers.q1.includes(option)}
                          onCheckedChange={checked => handleCheckbox('q1', option, checked === true)}
                          disabled={disabled}
                        />
                        <span><strong>{main}</strong>{rest ? ' - ' + rest : ''}</span>
                      </label>
                    );
                  })}
                </div>
                {answers.q1.length === 0 && (
                  <div className="text-destructive text-sm mt-2" role="alert">Please select at least one option to continue.</div>
                )}
              </div>
          )}
          {step === 1 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">2. Which industries or topics are most important to you? <span className='text-xs text-muted-foreground'>(Optional)</span></h3>
              <p className="text-xs text-muted-foreground mb-2">You can skip this question if you want.</p>
              <div className="flex flex-col gap-2">
                {question2Options.map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <Checkbox
                      checked={answers.q2.includes(option)}
                      onCheckedChange={checked => handleCheckbox('q2', option, !!checked)}
                    />
                    <span><strong>{option}</strong></span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">3. What kind of emails are most urgent for you? <span className='text-xs text-muted-foreground'>(Optional)</span></h3>
              <p className="text-xs text-muted-foreground mb-2">You can skip this question if you want.</p>
              <div className="flex flex-col gap-2">
                {question3Options.map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <Checkbox
                      checked={answers.q3.includes(option)}
                      onCheckedChange={checked => handleCheckbox('q3', option, !!checked)}
                    />
                    <span><strong>{option}</strong></span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">4. What time of day do you want to receive your email summary? <span className='text-xs text-destructive'>(Required)</span></h3>
              <p className="text-sm text-muted-foreground mb-2">Default is 12AM. You can change this later in settings.</p>
              <div className="grid grid-rows-6 grid-flow-col gap-2" role="radiogroup" aria-labelledby="preferredTimeLabel">
                {preferredTimes.map(time => (
                  <label key={time} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredTime"
                      value={time}
                      checked={answers.preferredTime === time}
                      onChange={() => handleTimeChange(time)}
                      aria-checked={answers.preferredTime === time}
                      aria-label={time}
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
              {error && <div className="text-destructive text-sm mt-2" role="alert">{error}</div>}
            </div>
          )}
          {step === 0 ? (
            <div className="flex justify-end mt-8 items-center gap-2">
              <Button
                onClick={handleNext}
                disabled={loading || answers.q1.length === 0}
                aria-disabled={loading || answers.q1.length === 0}
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="flex justify-between mt-8 items-center gap-2">
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                Back
              </Button>
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  aria-disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button ref={saveButtonRef} onClick={handleSave} disabled={loading || !answers.preferredTime} aria-disabled={loading || !answers.preferredTime} aria-busy={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>Saving...</span>
                  ) : 'Save Preferences'}
                </Button>
              )}
            </div>
          )}
                </Card>
              </div>
    </div>
  )
}
