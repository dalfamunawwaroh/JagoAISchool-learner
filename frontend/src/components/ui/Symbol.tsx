import React from 'react';

interface SymbolProps {
  name: string;
  className?: string;
  fill?: boolean;
}

export const Symbol = ({ name, className = "", fill = false }: SymbolProps) => (
  <span 
    className={`material-symbols-rounded notranslate ${className} ${fill ? 'fill-1' : ''}`} 
    translate="no"
    style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
  >
    {name}
  </span>
);
