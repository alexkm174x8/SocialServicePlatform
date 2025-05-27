// archivo: Mapa.tsx

import { MapPin } from 'lucide-react';

type MapaProps = {
  embedUrl: string | undefined;
};

const Mapa = ({ embedUrl }: MapaProps) => {
  const isValidGoogleMapsUrl = (url: string | undefined): boolean => {
    return !!url && url.includes('https://www.google.com/maps');
  };

  if (isValidGoogleMapsUrl(embedUrl)) {
    return (
      <iframe
        src={embedUrl}
        width="100%"
        height="200"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-2xl w-200px h-200px"
      />
    );
  }

  return (
    <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl text-blue-900 bg-blue-200">
      <MapPin className="w-10 h-10 mb-2" />
      <span>Mapa no definido por la OSF</span>
    </div>
  );
};

export default Mapa;