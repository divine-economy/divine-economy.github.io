'use client';

import React from 'react';
import LetterPreview from './LetterPreview';
import { BlobParams, GridParams, DisplayParams } from '@/lib/displayParams';
import { getLetterPath, getLetterWidth } from '@/lib/letterTemplates';

interface TextPreviewProps {
  text: string;
  blobParams: BlobParams;
  gridParams: GridParams;
  displayParams: DisplayParams;
  showGrid: boolean;
}

export default function TextPreview({
  text,
  blobParams,
  gridParams,
  displayParams,
  showGrid,
}: TextPreviewProps) {
  const {
    letterSpacing,
    wordSpacing,
    size,
    rotationVariance,
    verticalOffset,
    verticalCrop,
    monospace,
    letterColor,
  } = displayParams;

  // Split text into characters
  const chars = text.split('');

  // Calculate positions
  let currentX = 0;
  const letterElements: JSX.Element[] = [];

  chars.forEach((char, index) => {
    if (char === '\n') {
      return; // Skip newlines for now
    }

    // For spaces, add word spacing as a gap
    if (char === ' ') {
      letterElements.push(
        <div
          key={index}
          style={{
            display: 'inline-block',
            width: wordSpacing,
          }}
        />
      );
      return;
    }

    const path = getLetterPath(char);
    const baseWidth = getLetterWidth(char);

    // Calculate width (monospace or proportional)
    const width = monospace ? 100 : baseWidth;

    // Random variations
    const rotation = rotationVariance * (Math.random() - 0.5) * 2;
    const vOffset = verticalOffset * (Math.random() - 0.5) * 2;

    // Add letter
    letterElements.push(
      <div
        key={index}
        style={{
          display: 'inline-block',
          marginLeft: index === 0 ? 0 : letterSpacing,
        }}
      >
        <LetterPreview
          char={char}
          path={path}
          blobParams={blobParams}
          gridParams={gridParams}
          showGrid={showGrid}
          color={letterColor}
          size={size}
          rotation={rotation}
          verticalOffset={vOffset}
          verticalCrop={verticalCrop}
        />
      </div>
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {letterElements}
    </div>
  );
}
