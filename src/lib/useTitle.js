import { useEffect } from 'react';

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | StudioSpace` : 'StudioSpace — Book Creative Studios by the Hour';
  }, [title]);
}
