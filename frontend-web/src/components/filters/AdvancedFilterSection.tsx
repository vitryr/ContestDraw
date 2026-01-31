/**
 * AdvancedFilterSection Component
 * Renders a collapsible section of filters with availability checks
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle,
  AtSign,
  Hash,
  Users,
  User,
  Shield,
  UserPlus,
  Crown,
  AlertCircle,
} from 'lucide-react';
import {
  FilterTier,
  FilterAvailability,
  TIER_COLORS,
  TIER_LABELS,
} from '../../types/filters';

interface FilterSectionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: FilterTier;
  userTier: FilterTier;
  children: React.ReactNode;
  isAvailable: boolean;
  defaultOpen?: boolean;
}

const ICONS: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="w-5 h-5" />,
  AtSign: <AtSign className="w-5 h-5" />,
  Hash: <Hash className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  UserPlus: <UserPlus className="w-5 h-5" />,
};

const TIER_ORDER: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];

export function AdvancedFilterSection({
  id,
  title,
  description,
  icon,
  tier,
  userTier,
  children,
  isAvailable,
  defaultOpen = false,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tierIndex = TIER_ORDER.indexOf(tier);
  const userTierIndex = TIER_ORDER.indexOf(userTier);
  const needsUpgrade = tierIndex > userTierIndex;

  return (
    <div className={`bg-bg-card border rounded-xl overflow-hidden transition-all ${
      isAvailable ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-60'
    }`}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-bg-elevated transition-colors"
        disabled={!isAvailable && needsUpgrade}
      >
        <div className="flex items-center gap-3">
          <div className={`text-accent-secondary ${!isAvailable ? 'opacity-50' : ''}`}>
            {ICONS[icon] || <CheckCircle className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isAvailable ? 'text-white' : 'text-ink-secondary'}`}>
                {title}
              </span>
              {tier !== 'free' && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${TIER_COLORS[tier]}`}>
                  {TIER_LABELS[tier]}
                </span>
              )}
              {needsUpgrade && (
                <Lock className="w-4 h-4 text-ink-muted" />
              )}
            </div>
            <p className="text-sm text-ink-muted mt-0.5">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {needsUpgrade && (
            <span className="text-xs text-accent-primary flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              Upgrade
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-ink-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-ink-muted" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {needsUpgrade ? (
                <UpgradePrompt tier={tier} />
              ) : (
                children
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UpgradePrompt({ tier }: { tier: FilterTier }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-xl">
      <div className="p-2 bg-accent-primary/20 rounded-lg">
        <Crown className="w-6 h-6 text-accent-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">
          Passez à {TIER_LABELS[tier]} pour débloquer ces filtres
        </p>
        <p className="text-sm text-ink-secondary mt-1">
          Accédez à des filtres avancés pour des tirages plus précis et équitables.
        </p>
      </div>
      <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:brightness-110 transition-all">
        Voir les plans
      </button>
    </div>
  );
}

// === Individual Filter Components ===

interface FilterToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  unavailableReason?: string | null;
}

export function FilterToggle({
  label,
  description,
  value,
  onChange,
  disabled = false,
  unavailableReason,
}: FilterToggleProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">{label}</p>
          {unavailableReason && (
            <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
              {unavailableReason}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-ink-muted mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-accent-secondary' : 'bg-bg-elevated'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface FilterSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  unavailableReason?: string | null;
}

export function FilterSlider({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
  unavailableReason,
}: FilterSliderProps) {
  return (
    <div className={`${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">{label}</p>
          {unavailableReason && (
            <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
              {unavailableReason}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-accent-secondary">
          {value}{unit}
        </span>
      </div>
      {description && (
        <p className="text-sm text-ink-muted mb-3">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-secondary disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-xs text-ink-muted mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  unavailableReason?: string | null;
}

export function FilterSelect({
  label,
  description,
  value,
  onChange,
  options,
  disabled = false,
  unavailableReason,
}: FilterSelectProps) {
  return (
    <div className={`${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-medium text-white">{label}</p>
        {unavailableReason && (
          <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
            {unavailableReason}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-ink-muted mb-3">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => !disabled && onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none disabled:cursor-not-allowed"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FilterTagInputProps {
  label: string;
  description?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  unavailableReason?: string | null;
}

export function FilterTagInput({
  label,
  description,
  value,
  onChange,
  placeholder = 'Ajouter...',
  disabled = false,
  unavailableReason,
}: FilterTagInputProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  const handleRemove = (item: string) => {
    onChange(value.filter(v => v !== item));
  };

  return (
    <div className={`${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-medium text-white">{label}</p>
        {unavailableReason && (
          <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
            {unavailableReason}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-ink-muted mb-3">{description}</p>
      )}
      
      {/* Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-elevated rounded-full text-sm"
            >
              <span className="text-ink-secondary">{item}</span>
              <button
                onClick={() => handleRemove(item)}
                className="text-ink-muted hover:text-error transition-colors"
                disabled={disabled}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none disabled:cursor-not-allowed"
        />
        <button
          onClick={handleAdd}
          disabled={disabled || !input.trim()}
          className="px-4 py-3 bg-accent-secondary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

interface FilterDateRangeProps {
  label: string;
  description?: string;
  from?: string;
  to?: string;
  onChangeFrom: (value: string | undefined) => void;
  onChangeTo: (value: string | undefined) => void;
  disabled?: boolean;
  unavailableReason?: string | null;
}

export function FilterDateRange({
  label,
  description,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  disabled = false,
  unavailableReason,
}: FilterDateRangeProps) {
  return (
    <div className={`${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-medium text-white">{label}</p>
        {unavailableReason && (
          <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
            {unavailableReason}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-ink-muted mb-3">{description}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-secondary mb-1">Du</label>
          <input
            type="datetime-local"
            value={from || ''}
            onChange={(e) => onChangeFrom(e.target.value || undefined)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-secondary mb-1">Au</label>
          <input
            type="datetime-local"
            value={to || ''}
            onChange={(e) => onChangeTo(e.target.value || undefined)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilterSection;
