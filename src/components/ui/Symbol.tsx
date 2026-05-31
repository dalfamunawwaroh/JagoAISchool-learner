import React from 'react';

interface SymbolProps {
  name: string;
  className?: string;
  fill?: boolean;
}

export const Symbol = ({ name, className = "", fill = false }: SymbolProps) => (
  <span 
    className={`material-symbols-outlined ${className} ${fill ? 'fill-1' : ''}`} 
    style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
  >
    {name}
  </span>
);
