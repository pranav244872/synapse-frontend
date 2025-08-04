import React, { useState, useEffect } from 'react';

// Importing subcomponents that make up different parts of the landing page
import HeroSection from '../components/landing/HeroSection/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection/FeaturesSection';
import AboutSection from '../components/landing/AboutSection/AboutSection';
import SectionSeparator from '../components/common/SectionSeparator/SectionSeparator';

// List of dynamic hero texts to rotate in the typing animation
const heroTexts = [
  'with AI-powered recommendations.',
  'by matching skills to tasks.',
  'and boost productivity.',
];

// Syntax-highlighted code snippet as an HTML string for the visual code block
const codeToShow = `
<span style="color: var(--pink);">const</span> <span style="color: var(--yellow);">getBestEngineer</span> = (<span style="color: var(--orange);">task</span>) => {
  <span style="color: var(--grey);">// 1. Analyze task requirements</span>
  <span style="color: var(--pink);">const</span> <span style="color: var(--orange);">requiredSkills</span> = <span style="color: var(--blue);">synapse.nlp.extractSkills</span>(task.description);

  <span style="color: var(--grey);">// 2. Query recommendation model</span>
  <span style="color: var(--pink);">const</span> <span style="color: var(--orange);">recommendation</span> = <span style="color: var(--blue);">synapse.ml.recommend</span>({
    skills: requiredSkills,
    availability: <span style="color: var(--green);">'available'</span>,
  });

  <span style="color: var(--pink);">return</span> recommendation.topCandidate;
};
`;

const LandingPage = () => {
  // State for controlling which phrase is currently being typed
  const [textIndex, setTextIndex] = useState(0);

  // State for currently displayed portion of the text (incremental typing)
  const [displayedText, setDisplayedText] = useState('');

  // Tracks whether we are currently deleting characters
  const [isDeleting, setIsDeleting] = useState(false);

  // State to display the animated HTML code snippet in the Hero section
  const [codeVisualHtml, setCodeVisualHtml] = useState('');

  // Effect for animated typing and deleting of hero text
  useEffect(() => {
    const fullText = heroTexts[textIndex];
    const typingSpeed = 100;       // Speed for typing
    const deletingSpeed = 50;      // Speed for deleting
    const pauseDuration = 2000;    // Pause before deleting starts

    const handleTyping = () => {
      if (isDeleting) {
        // If deleting, remove one character at a time
        if (displayedText.length > 0) {
          setDisplayedText(prev => prev.slice(0, -1));
        } else {
          // When done deleting, switch to typing next phrase
          setIsDeleting(false);
          setTextIndex(prev => (prev + 1) % heroTexts.length);
        }
      } else {
        // If typing, add one character at a time
        if (displayedText.length < fullText.length) {
          setDisplayedText(prev => fullText.slice(0, prev.length + 1));
        } else {
          // Pause briefly before starting to delete
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }
    };

    // Set timeout for each frame of typing/deleting
    const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    
    // Clean up the timeout on each effect cycle
    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, textIndex]);

  // Effect to animate typing of the syntax-highlighted code block (runs once)
  useEffect(() => {
    if (codeVisualHtml.length < codeToShow.length) {
      const codeTypingTimeout = setTimeout(() => {
        setCodeVisualHtml(codeToShow.slice(0, codeVisualHtml.length + 1));
      }, 10); // Fast typing speed for code
      return () => clearTimeout(codeTypingTimeout);
    }
  }, [codeVisualHtml]);

  // Render the full landing page
  return (
    <div>
      {/* Hero section with typing effect and animated code visual */}
      <HeroSection 
        displayedText={displayedText} 
        codeVisualHtml={codeVisualHtml} 
      />
      <SectionSeparator />

      {/* Features section with three core highlights */}
      <FeaturesSection />
      <SectionSeparator />

      {/* About section describing what Synapse does */}
      <AboutSection />

      {/* Future: Add a footer or newsletter signup */}
    </div>
  );
};

export default LandingPage; // Export for use in routing or main App component
