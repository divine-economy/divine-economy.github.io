'use client';

import React from 'react';
import { LetterPreview } from './LetterPreview';
import { BlobParams } from '@/lib/blobGenerator';
import { GridParams } from '@/lib/gridOverlay';
import { DisplayParams, getRandomRotation, getRandomVerticalOffset } from '@/lib/displayParams';

interface TextPreviewProps {
  text: string;
  blobParams: BlobParams;
  gridParams: GridParams;
  displayParams: DisplayParams;
}

export function TextPreview({
  text,
  blobParams,
  gridParams,
  displayParams,
}: TextPreviewProps) {
  // Split text into words and characters
  const words = text.toUpperCase().split(' ');

  if (text.trim().length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Type some text above to see your blob font preview
      </div>
    );
  }

  let globalCharIndex = 0;

  return (
    <div
      className="flex flex-wrap items-center justify-center p-4"
      style={{
        gap: `${displayParams.letterSpacing}px`,
        backgroundColor: displayParams.backgroundColor,
        borderRadius: '8px',
      }}
    >
      {words.map((word, wordIndex) => {
        const chars = word.split('').filter((char) => /[A-Z0-9]/.test(char));

        if (chars.length === 0) return null;

        return (
          <React.Fragment key={`word-${wordIndex}`}>
            <div
              className="flex items-center"
              style={{
                gap: `${displayParams.letterSpacing}px`,
              }}
            >
              {chars.map((char, charIndex) => {
                const currentIndex = globalCharIndex++;
                const rotation = getRandomRotation(displayParams.rotationVariance, currentIndex);
                const verticalOffset = getRandomVerticalOffset(displayParams.verticalVariance, currentIndex);

                return (
                  <LetterPreview
                    key={`${char}-${currentIndex}`}
                    letter={char}
                    blobParams={blobParams}
                    gridParams={gridParams}
                    size={displayParams.letterSize}
                    rotation={rotation}
                    verticalOffset={verticalOffset}
                    letterColor={displayParams.letterColor}
                  />
                );
              })}
            </div>
            {/* Add word spacing between words */}
            {wordIndex < words.length - 1 && (
              <div style={{ width: `${displayParams.wordSpacing}px` }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
