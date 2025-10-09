import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation';
import { Typography } from '@mui/material';
import { quotes } from '../../../assets/quotes';

const AnimatedQuotes: React.FC = () => {
  const { i18n } = useTranslation();
  const [sequence, setSequence] = useState<(string | number)[]>([]);

  useEffect(() => {
    const currentLanguage = i18n.language.split('-')[0];
    const shuffledQuotes = [...quotes].sort(() => 0.5 - Math.random());

    const newSequence = shuffledQuotes.flatMap(quote => {
      const lang = currentLanguage as keyof typeof quote;
      const text = quote[lang] || quote['en'];
      return [text, 2000];
    });

    setSequence(newSequence);
  }, [i18n.language]);

  if (sequence.length === 0) {
    return null; // Don't render until the sequence is ready
  }

  return (
    <Typography variant="h5" component="div" sx={{ textAlign: 'center', fontStyle: 'italic', padding: 2 }}>
      <TypeAnimation
        sequence={sequence}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
    </Typography>
  );
};

export default AnimatedQuotes;