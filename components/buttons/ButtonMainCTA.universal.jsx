/**
 * Universal ButtonMainCTA component that works in both server and client contexts
 * This component automatically detects the environment and uses the appropriate version
 */

import dynamic from 'next/dynamic';

// Check if we're in a server component context
const isServerComponent = typeof window === 'undefined' && 
  typeof require !== 'undefined' &&
  !process.env.NEXT_RUNTIME;

// Dynamically import the appropriate component
const ButtonMainCTA = isServerComponent
  ? require('./ButtonMainCTA.server').default
  : dynamic(() => import('./ButtonMainCTA.client'), { 
      ssr: false,
      loading: () => {
        // Return a loading state that matches the button structure
        const ButtonLoader = (props) => (
          <button 
            className={props.className || "px-4 py-2 rounded"}
            disabled
          >
            {props.text || 'Loading...'}
          </button>
        );
        return ButtonLoader;
      }
    });

export default ButtonMainCTA;