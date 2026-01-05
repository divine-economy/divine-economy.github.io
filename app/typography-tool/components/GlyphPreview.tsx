'use client';

import { useEffect, useState } from 'react';
import { useTypographyStore } from '@/lib/typography/store';
import { generateCharacterGlyph } from '@/lib/typography/glyphGenerator';
import { CAP_HEIGHT } from '@/lib/typography/gridEngine';

interface GlyphPreviewProps {
  character: string;
  size?: number;
}

export function GlyphPreview({ character, size = 200 }: GlyphPreviewProps) {
  const { parameters } = useTypographyStore();
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    // Generate glyph
    const glyph = generateCharacterGlyph(character, parameters);

    if (glyph) {
      const viewBoxSize = 1000;
      const xOffset = (viewBoxSize - glyph.advanceWidth) / 2;
      const yOffset = (viewBoxSize - CAP_HEIGHT) / 2;

      const svg = `
        <svg
          width="${size}"
          height="${size}"
          viewBox="0 0 ${viewBoxSize} ${viewBoxSize}"
          xmlns="http://www.w3.org/2000/svg"
          style="background: transparent;"
        >
          <path
            d="${glyph.svgPath}"
            fill="currentColor"
            transform="translate(${xOffset}, ${yOffset})"
          />
        </svg>
      `;

      setSvgContent(svg);
    }
  }, [character, parameters, size]);

  return (
    <div
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

interface TextPreviewProps {
  text: string;
  fontSize?: number;
}

export function TextPreview({ text, fontSize = 72 }: TextPreviewProps) {
  const { parameters } = useTypographyStore();
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const glyphs = [];
    let totalWidth = 0;

    // Generate glyphs for each character
    for (const char of text) {
      const glyph = generateCharacterGlyph(char.toUpperCase(), parameters);
      if (glyph) {
        glyphs.push(glyph);
        totalWidth += glyph.advanceWidth;
      }
    }

    if (glyphs.length === 0) {
      setSvgContent('');
      return;
    }

    const scale = fontSize / CAP_HEIGHT;
    const width = totalWidth * scale;
    const height = 1000 * scale;

    let paths = '';
    let xOffset = 0;

    for (const glyph of glyphs) {
      paths += `
        <path
          d="${glyph.svgPath}"
          fill="currentColor"
          transform="translate(${xOffset}, 0) scale(${scale})"
        />
      `;
      xOffset += glyph.advanceWidth * scale;
    }

    const svg = `
      <svg
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
        xmlns="http://www.w3.org/2000/svg"
        style="background: transparent;"
      >
        ${paths}
      </svg>
    `;

    setSvgContent(svg);
  }, [text, parameters, fontSize]);

  return (
    <div
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
