export const Mapa = ({ embedUrl }: { embedUrl: string }) => (
    <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md">
      <iframe
        src={embedUrl}
        width="100%"
        height="200"
        allowFullScreen
        loading="lazy"
        className="border-0"
      />
    </div>
  );