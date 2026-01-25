import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { calculatePasswordStrength } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showSuggestions?: boolean;
}

export default function PasswordStrengthIndicator({
  password,
  showSuggestions = true,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  const barWidth = `${(strength.score / 5) * 100}%`;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            transition={{ duration: 0.3 }}
            className={`h-full transition-colors ${
              strength.score <= 1
                ? 'bg-red-600'
                : strength.score === 2
                ? 'bg-orange-600'
                : strength.score === 3
                ? 'bg-yellow-600'
                : 'bg-green-600'
            }`}
          />
        </div>
        <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
      </div>

      {/* Requirements Checklist */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          className="space-y-1"
        >
          <PasswordRequirement met={password.length >= 8} text="At least 8 characters" />
          <PasswordRequirement
            met={/[a-z]/.test(password) && /[A-Z]/.test(password)}
            text="Uppercase and lowercase letters"
          />
          <PasswordRequirement met={/\d/.test(password)} text="At least one number" />
          <PasswordRequirement
            met={/[@$!%*?&#]/.test(password)}
            text="At least one special character"
          />
        </motion.div>
      )}
    </div>
  );
}

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="w-3 h-3 text-green-600" />
      ) : (
        <X className="w-3 h-3 text-gray-400" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-600'}>{text}</span>
    </div>
  );
}
