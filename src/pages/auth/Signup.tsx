import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, AgeGroup } from '@/contexts/ThemeContext';
import AgeGroupSelector from '@/components/auth/AgeGroupSelector';
import { toast } from '@/hooks/use-toast';
import { Loader2, GamepadIcon } from 'lucide-react';

const avatarOptions = ['🎮', '🎯', '🚀', '⚡', '🌟', '🦄', '🎨', '🎪', '🎭', '🎸', '🎲', '🏆'];

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const { setAgeGroup } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'age' | 'details' | 'avatar'>('age');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    ageGroup: null as AgeGroup | null,
    avatarUrl: '',
    agreeToTerms: false,
    parentalConsent: false,
  });

  const handleAgeGroupSelect = (ageGroup: AgeGroup) => {
    setFormData(prev => ({ ...prev, ageGroup }));
    setAgeGroup(ageGroup);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setStep('avatar');
  };

  const handleFinalSubmit = async () => {
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    if (formData.ageGroup === 'kids' && !formData.parentalConsent) {
      toast({
        title: "Parental consent required",
        description: "Parental consent is required for users under 13.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await signup({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        ageGroup: formData.ageGroup,
        avatarUrl: formData.avatarUrl,
      });
      navigate('/');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'age':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AgeGroupSelector
              selectedAgeGroup={formData.ageGroup}
              onSelect={handleAgeGroupSelect}
              title="Choose Your Adventure Style"
              description="This helps us customize your experience!"
            />
            {formData.ageGroup && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
              >
                <Button 
                  onClick={() => setStep('details')}
                  className="btn-game px-8"
                >
                  Continue
                </Button>
              </motion.div>
            )}
          </motion.div>
        );

      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription>
                  Join the adventure! Fill in your details below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Choose a cool username"
                      minLength={3}
                      maxLength={20}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Choose a strong password"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="button" variant="outline" onClick={() => setStep('age')}>
                      Back
                    </Button>
                    <Button type="submit" className="btn-game flex-1">
                      Next Step
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'avatar':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Avatar</CardTitle>
                <CardDescription>
                  Pick an avatar that represents you!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Selection */}
                <div className="grid grid-cols-4 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      className={`p-4 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                        formData.avatarUrl === avatar
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, avatarUrl: avatar }))}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  {/* Parental Consent for Kids */}
                  {formData.ageGroup === 'kids' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parental-consent"
                        checked={formData.parentalConsent}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, parentalConsent: !!checked }))
                        }
                      />
                      <Label htmlFor="parental-consent" className="text-sm">
                        I have parental permission to create this account
                      </Label>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setStep('details')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleFinalSubmit} 
                    disabled={loading}
                    className="btn-game flex-1"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-6xl opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🎮
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-4xl opacity-10"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-20 text-5xl opacity-10"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌟
        </motion.div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GamepadIcon className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Join the Game</h1>
          </div>
          <p className="text-muted-foreground">
            Create your account and start your adventure!
          </p>
        </motion.div>

        {/* Step Content */}
        {getStepContent()}

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;