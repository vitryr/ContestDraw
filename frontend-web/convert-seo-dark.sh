#!/bin/bash

# Script to convert SEO pages to dark mode
# Targets: src/pages/seo/**/*.tsx

find src/pages/seo -name "*.tsx" -type f | while read file; do
  echo "Converting: $file"
  
  # Main container backgrounds - gradient to dark
  sed -i '' 's/bg-gradient-to-b from-pink-50 via-white to-purple-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-blue-50 via-white to-indigo-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-red-50 via-white to-blue-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-purple-50 via-white to-pink-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-green-50 via-white to-emerald-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-cyan-50 via-white to-blue-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-orange-50 via-white to-red-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-yellow-50 via-white to-amber-50/bg-bg-primary/g' "$file"
  sed -i '' 's/bg-gradient-to-b from-slate-50 via-white to-gray-50/bg-bg-primary/g' "$file"
  
  # Section backgrounds
  sed -i '' 's/bg-gray-50/bg-bg-elevated/g' "$file"
  sed -i '' 's/bg-slate-50/bg-bg-elevated/g' "$file"
  sed -i '' 's/bg-pink-50/bg-bg-elevated/g' "$file"
  sed -i '' 's/bg-blue-50/bg-bg-elevated/g' "$file"
  sed -i '' 's/bg-purple-50/bg-bg-elevated/g' "$file"
  sed -i '' 's/bg-indigo-50/bg-bg-elevated/g' "$file"
  
  # Card backgrounds
  sed -i '' 's/bg-white/bg-bg-elevated/g' "$file"
  
  # Borders
  sed -i '' 's/border-gray-100/border-white\/10/g' "$file"
  sed -i '' 's/border-gray-200/border-white\/10/g' "$file"
  sed -i '' 's/border-gray-300/border-white\/20/g' "$file"
  sed -i '' 's/border-slate-100/border-white\/10/g' "$file"
  sed -i '' 's/border-slate-200/border-white\/10/g' "$file"
  
  # Text colors - gray to ink
  sed -i '' 's/text-gray-900/text-white/g' "$file"
  sed -i '' 's/text-gray-800/text-white/g' "$file"
  sed -i '' 's/text-gray-700/text-ink-secondary/g' "$file"
  sed -i '' 's/text-gray-600/text-ink-secondary/g' "$file"
  sed -i '' 's/text-gray-500/text-ink-tertiary/g' "$file"
  sed -i '' 's/text-gray-400/text-ink-tertiary/g' "$file"
  sed -i '' 's/text-slate-900/text-white/g' "$file"
  sed -i '' 's/text-slate-800/text-white/g' "$file"
  sed -i '' 's/text-slate-700/text-ink-secondary/g' "$file"
  sed -i '' 's/text-slate-600/text-ink-secondary/g' "$file"
  
  # Hover states
  sed -i '' 's/hover:border-gray-300/hover:border-white\/20/g' "$file"
  sed -i '' 's/hover:border-pink-200/hover:border-accent-primary\/50/g' "$file"
  sed -i '' 's/hover:border-pink-300/hover:border-accent-primary\/50/g' "$file"
  sed -i '' 's/hover:border-blue-200/hover:border-accent-secondary\/50/g' "$file"
  sed -i '' 's/hover:border-blue-300/hover:border-accent-secondary\/50/g' "$file"
  
  # Shadows
  sed -i '' 's/shadow-pink-500\/10/shadow-accent-primary\/20/g' "$file"
  sed -i '' 's/shadow-blue-500\/10/shadow-accent-secondary\/20/g' "$file"
  
  # Badge/tag backgrounds
  sed -i '' 's/bg-gray-100 text-gray-600/bg-white\/10 text-ink-secondary/g' "$file"
  sed -i '' 's/bg-gray-100 text-gray-700/bg-white\/10 text-ink-secondary/g' "$file"
  sed -i '' 's/bg-pink-100 text-pink-700/bg-accent-primary\/20 text-accent-primary/g' "$file"
  sed -i '' 's/bg-blue-100 text-blue-700/bg-accent-secondary\/20 text-accent-secondary/g' "$file"
  sed -i '' 's/bg-green-100 text-green-700/bg-green-500\/20 text-green-400/g' "$file"
  sed -i '' 's/bg-purple-100 text-purple-700/bg-accent-secondary\/20 text-accent-secondary/g' "$file"
  
  # Icon backgrounds
  sed -i '' 's/bg-pink-100/bg-accent-primary\/20/g' "$file"
  sed -i '' 's/bg-blue-100/bg-accent-secondary\/20/g' "$file"
  sed -i '' 's/bg-purple-100/bg-accent-secondary\/20/g' "$file"
  sed -i '' 's/bg-green-100/bg-green-500\/20/g' "$file"
  sed -i '' 's/bg-indigo-100/bg-accent-secondary\/20/g' "$file"
  
  # Text accents
  sed -i '' 's/text-pink-600/text-accent-primary/g' "$file"
  sed -i '' 's/text-pink-500/text-accent-primary/g' "$file"
  sed -i '' 's/text-blue-600/text-accent-secondary/g' "$file"
  sed -i '' 's/text-blue-500/text-accent-secondary/g' "$file"
  sed -i '' 's/text-purple-600/text-accent-secondary/g' "$file"
  sed -i '' 's/text-indigo-600/text-accent-secondary/g' "$file"
  
done

echo "Conversion complete!"
