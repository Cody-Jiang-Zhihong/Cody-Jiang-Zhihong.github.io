// Data-only content is shared with the no-JavaScript portfolio generator.
// Videos load only when an exhibit is open and the visitor presses play.
export function renderMedia(container, media = []) {
  container.replaceChildren();
  for (const item of media) {
    const figure = document.createElement('figure');
    if (item.type === 'pending' || item.pending) {
      figure.className = 'media-placeholder';
      figure.textContent = item.label || 'Actual project media to be added.';
    } else if (item.type === 'image') {
      const link = document.createElement('a');
      link.href = item.fullSrc || item.src; link.target = '_blank'; link.rel = 'noopener';
      link.setAttribute('aria-label', 'Open full image: ' + item.alt);
      const img = document.createElement('img');
      img.src = item.src; img.alt = item.alt; img.loading = 'lazy'; img.decoding = 'async';
      link.append(img); figure.append(link);
      const failed = () => {
        const message = document.createElement('p'); message.textContent = 'This image could not load.';
        const retry = document.createElement('button'); retry.textContent = 'Retry image';
        retry.onclick = () => { message.remove(); retry.remove(); img.hidden = false; img.src = item.src; };
        img.hidden = true; figure.prepend(message, retry);
      };
      img.addEventListener('error', failed);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.controls = true; video.playsInline = true; video.preload = 'none';
      if (item.poster) video.poster = item.poster;
      video.src = item.src;
      for (const track of item.tracks || []) {
        const el = document.createElement('track');
        Object.assign(el, {kind:'captions',srclang:track.lang,label:track.label,src:track.src});
        video.append(el);
      }
      const fallback = document.createElement('a'); fallback.href = item.src; fallback.textContent = 'Open video';
      video.append(fallback); figure.append(video);
      video.addEventListener('error', () => {
        const retry = document.createElement('button'); retry.textContent = 'Video unavailable · retry';
        retry.onclick = () => { retry.remove(); video.load(); };
        figure.append(retry);
      });
    }
    if (item.caption) {
      const caption = document.createElement('figcaption'); caption.textContent = item.caption;
      figure.append(caption);
    }
    container.append(figure);
  }
}

export function stopMedia(container) {
  container.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
}
