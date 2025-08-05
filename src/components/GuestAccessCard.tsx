import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Loader2, Shield, Zap } from 'lucide-react';
import { useAnonymousAuth } from '@/hooks/useAnonymousAuth';
import { useNavigate } from 'react-router-dom';

interface GuestAccessCardProps {
  onGuestAccess?: () => void;
}

export default function GuestAccessCard({ onGuestAccess }: GuestAccessCardProps) {
  const [starting, setStarting] = useState(false);
  const { startGuestSession } = useAnonymousAuth();
  const navigate = useNavigate();

  const handleStartGuest = async () => {
    setStarting(true);
    
    try {
      await startGuestSession();
      onGuestAccess?.();
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Failed to start guest session:', error);
    } finally {
      setStarting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <UserCheck className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Try as Guest</CardTitle>
        <CardDescription>
          Start using BotsRHere immediately without creating an account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Zap className="w-4 h-4 text-green-500" />
            <span>500 free tokens to get started</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Device-based tracking (no personal data required)</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <UserCheck className="w-4 h-4 text-purple-500" />
            <span>Full access to avatar creation and video generation</span>
          </div>
        </div>

        {/* Limitations */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Guest sessions are device-specific and have limited token refills. 
            Create a full account for unlimited access and cloud sync.
          </p>
        </div>

        {/* Guest Button */}
        <Button 
          onClick={handleStartGuest}
          disabled={starting}
          className="w-full gap-2"
          variant="outline"
          size="lg"
        >
          {starting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting Guest Session...
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Continue as Guest
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing as guest, you agree to our device tracking for abuse prevention
          </p>
        </div>
      </CardContent>
    </Card>
  );
}