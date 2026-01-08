'use client';

import React from 'react';
import { LetterPreview } from './LetterPreview';
import { BlobParams } from '@/lib/blobGenerator';
import { GridParams } from '@/lib/gridOverlay';

interface TextPreviewProps {
  text: string;
  blobParams: BlobParams;
  gridParams: GridParams;
  letterSize?: number;
}

export function TextPreview({
  text,
  blobParams,
  gridParams,
  letterSize = 80,
}: TextPreviewProps) {
  // Filter to only supported characters
  const filteredText = text
    .toUpperCase()
    .split('')
    .filter((char) => /[A-Z0-9]/.test(char));

  if (filteredText.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Type some text above to see your blob font preview
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center p-4">
      {filteredText.map((char, index) => (
        <LetterPreview
          key={`${char}-${index}`}
          letter={char}
          blobParams={blobParams}
          gridParams={gridParams}
          size={letterSize}
        />
      ))}
    </div>
  );
}
