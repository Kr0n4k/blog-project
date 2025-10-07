interface MediaGalleryProps {
  photos: string[];
  videos: string[];
}

export function MediaGallery({ photos, videos }: MediaGalleryProps) {
  return (
    <>
      {photos && photos.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-card-foreground mb-3">Фотографии</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <button
                key={index}
                type="button"
                className="group aspect-square rounded-xl overflow-hidden bg-secondary relative focus:outline-none"
                onClick={() => openLightbox(photo)}
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="pointer-events-none absolute inset-0 ring-0 group-hover:ring-2 ring-primary/60 rounded-xl transition" />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {videos && videos.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-card-foreground mb-3">Видео</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="bg-black rounded-xl overflow-hidden">
                <video
                  controls
                  className="w-full aspect-video"
                  poster={`https://via.placeholder.com/400x225/1e293b/64748b?text=Video+${index + 1}`}
                >
                  <source src={video} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function openLightbox(src: string) {
  if (typeof window === 'undefined') return;
  const el = document.createElement('dialog');
  el.className = 'backdrop:bg-black/60 rounded-xl p-0';
  el.innerHTML = `
    <div class="relative">
      <button aria-label="Закрыть" class="absolute top-3 right-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black/80">
        ✕
      </button>
      <img src="${src}" class="max-h-[80vh] max-w-[90vw] object-contain rounded-xl" />
    </div>
  `;
  document.body.appendChild(el);
  const closeBtn = el.querySelector('button');
  closeBtn?.addEventListener('click', () => {
    el.close();
    el.remove();
  });
  el.addEventListener('click', (e) => {
    if (e.target === el) {
      el.close();
      el.remove();
    }
  });
  (el as any).showModal?.();
}