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
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      // Generate glyph
      const glyph = generateCharacterGlyph(character, parameters);

      if (glyph && glyph.svgPath) {
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
        setError('');
      } else {
        setError(`No glyph generated for ${character}`);
      }
    } catch (err) {
      console.error('Error generating glyph:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [character, parameters, size]);

  if (error) {
    return <div className="text-red-500 text-sm p-4">{error}</div>;
  }

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
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const glyphs = [];
      let totalWidth = 0;

      // Generate glyphs for each character
      for (const char of text) {
        if (char === ' ') {
          // Handle spaces
          glyphs.push({
            character: ' ',
            unicode: 32,
            svgPath: '',
            advanceWidth: 300,
          });
          totalWidth += 300;
        } else {
          const glyph = generateCharacterGlyph(char.toUpperCase(), parameters);
          if (glyph) {
            glyphs.push(glyph);
            totalWidth += glyph.advanceWidth;
          }
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
        if (glyph.svgPath) {
          paths += `
            <path
              d="${glyph.svgPath}"
              fill="currentColor"
              transform="translate(${xOffset}, 0) scale(${scale})"
            />
          `;
        }
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
      setError('');
    } catch (err) {
      console.error('Error generating text preview:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [text, parameters, fontSize]);

  if (error) {
    return <div className="text-red-500 text-sm p-4">{error}</div>;
  }

  return (
    <div
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
