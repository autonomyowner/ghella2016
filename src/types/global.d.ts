import React from 'react';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'framer-motion' {
  import { ComponentProps, ReactElement } from 'react';
  
  interface MotionProps {
    children?: ReactElement | ReactElement[];
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    className?: string;
    onClick?: (e: any) => void;
    [key: string]: any;
  }
  
  export const motion: {
    div: (props: MotionProps) => ReactElement;
    button: (props: MotionProps) => ReactElement;
  };
  
  export const AnimatePresence: (props: { children: ReactElement | null }) => ReactElement;
}

declare module 'leaflet' {
  export const map: any;
  export const tileLayer: any;
  export const marker: any;
  export const circle: any;
  export const control: any;
  export const DomUtil: any;
  export const GeometryUtil: any;
}

declare global {
  interface Window {
    exportCoordinates?: () => void;
    L?: any;
  }
} 